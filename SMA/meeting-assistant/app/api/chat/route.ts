import { auth } from "@/auth";

// In-memory rate limiter
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 20;
const RATE_WINDOW = 60_000;

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

export async function POST(req: Request) {
  try {
    // Auth check
    const session = await auth();
    if (!session?.user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id || session.user.email || "unknown";
    if (!checkRateLimit(userId)) {
      return Response.json({ error: "Rate limit exceeded. Please wait a moment." }, { status: 429 });
    }

    const body = await req.json();
    const systemPrompt = body.system || "You are a smart meeting assistant named SMA. Be concise, helpful, friendly, and professional. Use markdown formatting when helpful. You help with meeting summaries, action items, brainstorming, and general questions.";
    let messages = body.messages || [];

    // Input validation
    if (messages.length > 50) {
      messages = messages.slice(-50);
    }
    
    // Validate each message
    for (const msg of messages) {
      if (typeof msg.content !== "string" || msg.content.length > 10000) {
        return Response.json({ error: "Invalid message format" }, { status: 400 });
      }
    }

    const contents = messages.map((m: any) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.content || m.text || "" }]
    }));

    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      return Response.json({ error: "AI service not configured" }, { status: 500 });
    }

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:streamGenerateContent?key=${apiKey}`;
    
    const response = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents,
        systemInstruction: { parts: [{ text: systemPrompt }] },
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Gemini API error:", errText);
      return Response.json({ error: "AI service error" }, { status: response.status });
    }

    const reader = response.body?.getReader();
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();
    let buffer = "";

    const stream = new ReadableStream({
      async start(controller) {
        if (!reader) { controller.close(); return; }
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            buffer += decoder.decode(value, { stream: true });

            let braceCount = 0;
            let startIdx = -1;
            let i = 0;

            while (i < buffer.length) {
              const char = buffer[i];
              if (char === '{') {
                if (braceCount === 0) startIdx = i;
                braceCount++;
              } else if (char === '}') {
                braceCount--;
                if (braceCount === 0 && startIdx !== -1) {
                  const jsonStr = buffer.substring(startIdx, i + 1);
                  try {
                    const obj = JSON.parse(jsonStr);
                    const text = obj.candidates?.[0]?.content?.parts?.[0]?.text;
                    if (text) {
                      const sseData = `data: ${JSON.stringify({
                        type: "content_block_delta",
                        delta: { text }
                      })}\n\n`;
                      controller.enqueue(encoder.encode(sseData));
                    }
                  } catch {}
                  buffer = buffer.substring(i + 1);
                  i = -1;
                  startIdx = -1;
                }
              }
              i++;
            }
          }
        } catch (err) {
          console.error("Stream error:", err);
        } finally {
          controller.close();
        }
      }
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-store",
        "Connection": "keep-alive",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error: any) {
    console.error("Chat route error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}