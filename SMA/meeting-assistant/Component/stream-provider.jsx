"use client";
import { StreamVideo } from "@stream-io/video-react-sdk";
import { Chat } from "stream-chat-react";
import useStreamClient from "../app/hooks/use-steam-client";

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;

export default function StreamProvider({ children, user, token }) {
  const { videoClient, chatClient } = useStreamClient({ apiKey, user, token });

  if (!videoClient || !chatClient) {
    return (
      <div className="flex items-center justify-center min-h-screen gradient-bg">
        <div className="text-center space-y-4">
          <div className="relative w-16 h-16 mx-auto">
            <div className="absolute inset-0 rounded-full border-4 border-blue-100" />
            <div className="absolute inset-0 rounded-full border-4 border-t-blue-500 animate-spin" />
          </div>
          <p className="text-sm text-slate-500 font-medium">Establishing connection...</p>
        </div>
      </div>
    );
  }

  return (
    <StreamVideo client={videoClient}>
      <Chat client={chatClient}>{children}</Chat>
    </StreamVideo>
  );
}