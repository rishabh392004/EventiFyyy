"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useSession, signIn, signOut } from "next-auth/react";

interface RecentMeeting {
  id: string;
  name: string;
  date: string;
}

export default function Home() {
  const { data: session, status } = useSession();
  const [joinCode, setJoinCode] = useState("");
  const [recentMeetings, setRecentMeetings] = useState<RecentMeeting[]>([]);
  const [copied, setCopied] = useState("");
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem("sma-recent-meetings");
    if (stored) {
      try { setRecentMeetings(JSON.parse(stored)); } catch {}
    }
  }, []);

  const saveMeeting = (id: string) => {
    const meeting: RecentMeeting = {
      id,
      name: `Meeting ${id.slice(0, 8)}`,
      date: new Date().toISOString(),
    };
    const updated = [meeting, ...recentMeetings.filter(m => m.id !== id)].slice(0, 10);
    setRecentMeetings(updated);
    localStorage.setItem("sma-recent-meetings", JSON.stringify(updated));
  };

  const createMeeting = () => {
    const id = crypto.randomUUID();
    saveMeeting(id);
    router.push(`/meeting/${id}`);
  };

  const joinMeeting = () => {
    const code = joinCode.trim();
    if (!code) return;
    saveMeeting(code);
    router.push(`/meeting/${code}`);
  };

  const copyMeetingLink = (id: string) => {
    const link = `${window.location.origin}/meeting/${id}`;
    navigator.clipboard.writeText(link);
    setCopied(id);
    setTimeout(() => setCopied(""), 2000);
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="min-h-screen gradient-bg relative overflow-hidden">
      {/* Floating decorative orbs */}
      <div className="absolute top-10 right-10 w-80 h-80 bg-blue-300/15 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-sky-300/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "3s" }} />
      <div className="absolute top-1/2 left-1/3 w-72 h-72 bg-indigo-200/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "5s" }} />

      {/* Header */}
      <header className="relative z-10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-sky-400 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-blue-500/20">
            SMA
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-800">Smart Meeting Assistant</h1>
            <p className="text-[11px] text-slate-400">AI-Powered Video Meetings</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {status === "loading" && (
            <div className="w-8 h-8 rounded-full bg-slate-200 animate-pulse" />
          )}
          {status === "authenticated" && session?.user && (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/70 backdrop-blur border border-slate-200/60">
                {session.user.image && (
                  <img src={session.user.image} alt="" className="w-7 h-7 rounded-full" />
                )}
                <span className="text-sm font-medium text-slate-700">{session.user.name}</span>
              </div>
              <button
                onClick={() => signOut()}
                className="text-sm text-slate-500 hover:text-red-500 transition-colors px-3 py-1.5 rounded-lg hover:bg-red-50 cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          )}
          {status === "unauthenticated" && (
            <button
              onClick={() => signIn()}
              className="btn-primary text-sm !py-2 !px-5"
            >
              Sign In
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-4xl mx-auto px-6 pt-12 pb-20">
        {/* Hero */}
        <div className="text-center mb-12 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-800 mb-4 leading-tight">
            Video Meetings,<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-500">Supercharged with AI</span>
          </h2>
          <p className="text-slate-500 text-lg max-w-xl mx-auto">
            Create or join secure video meetings instantly. Get real-time AI summaries, action items, and smart assistance.
          </p>
        </div>

        {status !== "authenticated" ? (
          /* Signed Out View */
          <div className="glass-card p-10 max-w-md mx-auto text-center animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-sky-400 flex items-center justify-center text-white text-3xl font-bold mx-auto mb-6 shadow-lg shadow-blue-500/20">
              🎥
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Get Started</h3>
            <p className="text-slate-500 text-sm mb-6">Sign in with Google or GitHub to create and join meetings</p>
            <button
              onClick={() => signIn()}
              className="btn-primary w-full text-base"
            >
              Sign In to Continue
            </button>
          </div>
        ) : (
          /* Signed In Dashboard */
          <div className="space-y-8">
            {/* Action Cards */}
            <div className="grid md:grid-cols-2 gap-6 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
              {/* Create Meeting */}
              <div className="glass-card glass-card-hover p-8 text-center">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-sky-400 flex items-center justify-center text-2xl mx-auto mb-4 shadow-md shadow-blue-500/15">
                  ➕
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">New Meeting</h3>
                <p className="text-sm text-slate-500 mb-5">Start an instant meeting with a unique secure link</p>
                <button
                  onClick={createMeeting}
                  className="btn-primary w-full"
                >
                  Create Meeting
                </button>
              </div>

              {/* Join Meeting */}
              <div className="glass-card glass-card-hover p-8 text-center">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-violet-500 to-purple-400 flex items-center justify-center text-2xl mx-auto mb-4 shadow-md shadow-violet-500/15">
                  🔗
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">Join Meeting</h3>
                <p className="text-sm text-slate-500 mb-5">Enter a meeting code to join an existing session</p>
                <div className="flex gap-2">
                  <input
                    placeholder="Paste meeting code..."
                    className="flex-1 px-4 py-3 rounded-xl bg-white border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                    value={joinCode}
                    onChange={e => setJoinCode(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && joinMeeting()}
                  />
                  <button onClick={joinMeeting} className="btn-primary !px-5">
                    Join
                  </button>
                </div>
              </div>
            </div>

            {/* Recent Meetings */}
            {recentMeetings.length > 0 && (
              <div className="glass-card p-6 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <span>🕐</span> Recent Meetings
                </h3>
                <div className="space-y-2">
                  {recentMeetings.map(m => (
                    <div key={m.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-blue-50/50 transition-colors group">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500 text-sm flex-shrink-0">📹</div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-slate-700 truncate">{m.name}</p>
                          <p className="text-xs text-slate-400">{formatDate(m.date)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => copyMeetingLink(m.id)}
                          className="text-xs px-3 py-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-all cursor-pointer"
                        >
                          {copied === m.id ? "✓ Copied!" : "Copy Link"}
                        </button>
                        <button
                          onClick={() => { saveMeeting(m.id); router.push(`/meeting/${m.id}`); }}
                          className="text-xs px-4 py-1.5 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors cursor-pointer"
                        >
                          Rejoin
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Features Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in-up" style={{ animationDelay: "0.6s" }}>
              {[
                { icon: "🤖", label: "AI Assistant", desc: "Smart meeting help" },
                { icon: "🔒", label: "Secure", desc: "End-to-end encrypted" },
                { icon: "🎙", label: "Voice AI", desc: "Live transcription" },
                { icon: "📋", label: "Action Items", desc: "Auto-generated" },
              ].map(f => (
                <div key={f.label} className="glass-card p-4 text-center">
                  <div className="text-2xl mb-2">{f.icon}</div>
                  <p className="text-sm font-semibold text-slate-700">{f.label}</p>
                  <p className="text-xs text-slate-400">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center py-6 border-t border-slate-200/40">
        <p className="text-xs text-slate-400">© 2026 SMA — Smart Meeting Assistant. Built with ❤️</p>
      </footer>
    </div>
  );
}
