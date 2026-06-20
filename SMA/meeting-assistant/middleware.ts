export { auth as middleware } from "@/auth";

export const config = {
  matcher: [
    "/meeting/:path*",
    "/api/token/:path*",
    "/api/chat/:path*",
  ],
};
