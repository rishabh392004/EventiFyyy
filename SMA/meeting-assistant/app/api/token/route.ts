import { auth } from "@/auth";
import { createHmac } from "crypto";

const apiKey = process.env.STREAM_API_KEY!;
const apiSecret = process.env.STREAM_API_SECRET!;

function buildStreamToken(userId: string, secretKey: string): string {
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
  const nowInSeconds = Math.floor(Date.now() / 1000);
  const iat = nowInSeconds - 3600;
  const exp = nowInSeconds + 60 * 60 * 24;
  const payload = Buffer.from(JSON.stringify({ user_id: userId, iat, exp })).toString("base64url");
  const signature = createHmac("sha256", secretKey)
    .update(`${header}.${payload}`)
    .digest("base64url");
  return `${header}.${payload}.${signature}`;
}

// Simple in-memory rate limiter
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 10; // requests per window
const RATE_WINDOW = 60_000; // 1 minute

function checkRateLimit(key: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(key);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + RATE_WINDOW });
    return true;
  }
  if (entry.count >= RATE_LIMIT) return false;
  entry.count++;
  return true;
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id || session.user.email?.replace(/[^a-zA-Z0-9]/g, "-") || "anonymous";

    if (!checkRateLimit(userId)) {
      return Response.json({ error: "Rate limit exceeded" }, { status: 429 });
    }

    if (!apiKey || !apiSecret) {
      return Response.json({ error: "Missing Stream API keys" }, { status: 500 });
    }

    // Upsert user on Stream
    try {
      const { StreamClient } = await import("@stream-io/node-sdk");
      const serverClient = new StreamClient(apiKey, apiSecret);
      await serverClient.upsertUsers([{
        id: userId,
        role: "admin",
        name: session.user.name || userId,
        image: session.user.image || undefined,
      }]);
    } catch (upsertError: any) {
      console.warn("Stream upsert warning:", upsertError.message);
    }

    const token = buildStreamToken(userId, apiSecret);
    return Response.json({ token, userId });
  } catch (error: any) {
    console.error("Token error:", error);
    return Response.json({ error: "Failed to generate token" }, { status: 500 });
  }
}
