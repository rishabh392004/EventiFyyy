"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import StreamProvider from "../../../Component/stream-provider";
import MeetingRoom from "../../../Component/meeting-room";

export default function MeetingPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();

  const callId = params.id;
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [error, setError] = useState(null);

  const user = useMemo(() => {
    if (!session?.user) return null;
    const id = session.user.id || session.user.email?.replace(/[^a-zA-Z0-9]/g, "-") || "anonymous";
    return {
      id,
      name: session.user.name || "Anonymous",
      image: session.user.image || undefined,
    };
  }, [session]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth");
      return;
    }
    if (!user) return;

    const controller = new AbortController();

    fetch("/api/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
      signal: controller.signal,
    })
      .then(res => {
        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        return res.json();
      })
      .then(data => {
        if (data.token) {
          setToken(data.token);
          setUserId(data.userId);
        } else {
          setError("Failed to get session token");
        }
      })
      .catch(err => {
        if (err.name === "AbortError") return;
        setError(err.message);
      });

    return () => controller.abort();
  }, [user, status, router]);

  const handleLeave = () => router.push("/");

  if (status === "loading" || (!token && !error)) {
    return (
      <div className="flex items-center justify-center min-h-screen gradient-bg">
        <div className="text-center space-y-4">
          <div className="relative w-16 h-16 mx-auto">
            <div className="absolute inset-0 rounded-full border-4 border-blue-100" />
            <div className="absolute inset-0 rounded-full border-4 border-t-blue-500 animate-spin" />
          </div>
          <p className="text-sm text-slate-500 font-medium">Connecting to meeting...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen gradient-bg">
        <div className="glass-card p-8 max-w-md text-center">
          <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center text-2xl mx-auto mb-4">⚠️</div>
          <h3 className="text-lg font-bold text-slate-800 mb-2">Connection Error</h3>
          <p className="text-sm text-slate-500 mb-6">{error}</p>
          <button onClick={() => router.push("/")} className="btn-primary">Back to Home</button>
        </div>
      </div>
    );
  }

  const streamUser = {
    id: userId,
    name: user?.name || "Anonymous",
    image: user?.image,
  };

  return (
    <StreamProvider user={streamUser} token={token}>
      <MeetingRoom
        callId={callId}
        onLeave={handleLeave}
        userId={userId}
        userName={user?.name}
        userImage={user?.image}
      />
    </StreamProvider>
  );
}