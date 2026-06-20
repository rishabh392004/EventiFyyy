import type { Metadata } from "next";
import { Inter } from "next/font/google";
import SessionProvider from "@/components/session-provider";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SMA — Smart Meeting Assistant",
  description: "Professional video meetings with AI-powered assistance. Create, join, and collaborate with Google & GitHub sign-in.",
  keywords: ["meeting", "video call", "AI assistant", "collaboration"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
