"use client";
import {
  CallControls,
  SpeakerLayout,
  StreamCall,
  StreamTheme,
  useStreamVideoClient,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import { useEffect, useRef, useState, useCallback } from "react";

const AI_API_URL = "/api/chat";
const REACTIONS = ["👍", "👏", "🎉", "❤️", "😂", "🤔"];

// ─── MeetingRoom ──────────────────────────────────────────────────────────────
export default function MeetingRoom({ callId, onLeave, userId, userName, userImage }) {
  const client = useStreamVideoClient();
  const [call, setCall] = useState(null);
  const [error, setError] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [showReactions, setShowReactions] = useState(false);
  const [activeReaction, setActiveReaction] = useState(null);
  const [linkCopied, setLinkCopied] = useState(false);

  const joinedRef = useRef(false);
  const leavingRef = useRef(false);
  const timerRef = useRef(null);
  const callType = "default";

  // Sidebar resize
  const [sidebarWidth, setSidebarWidth] = useState(400);
  const [isResizing, setIsResizing] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Elapsed time timer
  useEffect(() => {
    if (call) {
      timerRef.current = setInterval(() => setElapsedTime(t => t + 1), 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [call]);

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return h > 0
      ? `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
      : `${m}:${String(s).padStart(2, "0")}`;
  };

  const startResizing = (e) => { e.preventDefault(); setIsResizing(true); };

  useEffect(() => {
    if (!isResizing) return;
    const handleMouseMove = (e) => {
      const container = document.getElementById("meeting-layout-container");
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const newWidth = rect.right - e.clientX - 24;
      if (newWidth >= 300 && newWidth <= 700) setSidebarWidth(newWidth);
    };
    const handleMouseUp = () => setIsResizing(false);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing]);

  useEffect(() => {
    if (!client || joinedRef.current) return;
    joinedRef.current = true;
    let activeCall = null;

    const init = async () => {
      try {
        const myCall = client.call(callType, callId);
        activeCall = myCall;
        await myCall.getOrCreate({
          data: {
            created_by_id: userId,
            members: [{ user_id: userId, role: "call_member" }],
          },
        });
        await myCall.join();
        myCall.on("call.session_ended", () => onLeave?.());
        setCall(myCall);
      } catch (err) {
        setError(err.message);
      }
    };
    init();

    return () => {
      if (activeCall && !leavingRef.current) {
        leavingRef.current = true;
        activeCall.leave().catch(() => {});
      }
    };
  }, [client, callId, userId, onLeave]);

  const handleLeaveClick = async () => {
    if (leavingRef.current) { onLeave?.(); return; }
    leavingRef.current = true;
    try { if (call) await call.leave().catch(() => {}); }
    catch (err) { console.error(err); }
    finally { clearInterval(timerRef.current); onLeave?.(); }
  };

  const copyMeetingLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/meeting/${callId}`);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const sendReaction = (emoji) => {
    setActiveReaction(emoji);
    setTimeout(() => setActiveReaction(null), 2000);
  };

  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen gradient-bg">
        <div className="glass-card p-8 max-w-md text-center">
          <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center text-2xl mx-auto mb-4">⚠️</div>
          <h3 className="text-lg font-bold text-slate-800 mb-2">Connection Error</h3>
          <p className="text-sm text-slate-500 mb-4">{error}</p>
          <button onClick={onLeave} className="btn-primary">Back to Home</button>
        </div>
      </div>
    );

  if (!call)
    return (
      <div className="flex items-center justify-center min-h-screen gradient-bg">
        <div className="text-center space-y-4">
          <div className="relative w-16 h-16 mx-auto">
            <div className="absolute inset-0 rounded-full border-4 border-blue-100" />
            <div className="absolute inset-0 rounded-full border-4 border-t-blue-500 animate-spin" />
          </div>
          <p className="text-sm text-slate-500 font-medium">Joining meeting...</p>
        </div>
      </div>
    );

  return (
    <StreamTheme>
      <StreamCall call={call}>
        <div className="min-h-screen gradient-bg flex flex-col overflow-hidden">
          <div className="flex-1 container mx-auto px-4 py-4 flex flex-col min-h-0">
            {/* Top Bar */}
            <div className="flex justify-between items-center mb-4 glass-card !rounded-xl px-5 py-3 flex-shrink-0">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse-soft" />
                  <span className="text-sm font-semibold text-slate-700">Live</span>
                </div>
                <span className="text-xs text-slate-400 font-mono bg-slate-100 px-3 py-1 rounded-lg">
                  {callId.length > 12 ? callId.slice(0, 12) + "..." : callId}
                </span>
                <span className="text-xs text-slate-500 font-mono">{formatTime(elapsedTime)}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={copyMeetingLink}
                  className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 transition-all cursor-pointer"
                >
                  {linkCopied ? "✓ Copied!" : "📋 Copy Link"}
                </button>
                <div className="relative">
                  <button
                    onClick={() => setShowReactions(!showReactions)}
                    className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:border-blue-300 hover:bg-blue-50 transition-all cursor-pointer"
                  >
                    😊 React
                  </button>
                  {showReactions && (
                    <div className="absolute top-full right-0 mt-2 glass-card !rounded-xl p-2 flex gap-1 animate-fade-in-up z-50">
                      {REACTIONS.map(r => (
                        <button
                          key={r}
                          onClick={() => { sendReaction(r); setShowReactions(false); }}
                          className="w-9 h-9 rounded-lg hover:bg-blue-50 flex items-center justify-center text-lg transition-all hover:scale-110 cursor-pointer"
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Active Reaction Overlay */}
            {activeReaction && (
              <div className="fixed bottom-32 left-1/2 -translate-x-1/2 text-6xl animate-fade-in-up z-50 pointer-events-none">
                {activeReaction}
              </div>
            )}

            {/* Layout container */}
            <div id="meeting-layout-container" className="flex-1 flex flex-col lg:flex-row gap-4 min-h-0">
              {/* Main Video */}
              <div className="flex-1 flex flex-col gap-3 min-h-0 min-w-0">
                <div className="flex-1 rounded-2xl bg-white border border-slate-200/80 overflow-hidden shadow-lg">
                  <SpeakerLayout />
                </div>
                <div className="flex justify-center pb-1 flex-shrink-0">
                  <div className="glass-card !rounded-2xl px-6 py-2 flex items-center justify-center">
                    <CallControls onLeave={handleLeaveClick} />
                  </div>
                </div>
              </div>

              {/* Resize Handle */}
              {!isMobile && (
                <div
                  onMouseDown={startResizing}
                  className="w-1 hover:w-1.5 self-stretch cursor-col-resize transition-all rounded-full flex-shrink-0 hidden lg:block"
                  style={{
                    background: isResizing ? "rgba(59,130,246,0.5)" : "rgba(148,196,255,0.3)",
                  }}
                />
              )}

              {/* Sidebar */}
              <div
                className="glass-card overflow-hidden flex flex-col flex-shrink-0 max-h-[85vh] lg:max-h-none"
                style={{
                  width: isMobile ? "100%" : `${sidebarWidth}px`,
                  minWidth: isMobile ? "100%" : "300px",
                  maxWidth: isMobile ? "100%" : "700px",
                }}
              >
                <AgentPanel />
              </div>
            </div>
          </div>
        </div>
      </StreamCall>
    </StreamTheme>
  );
}

// ─── AgentPanel ───────────────────────────────────────────────────────────────
function AgentPanel() {
  const [tab, setTab] = useState("ai");

  return (
    <div className="flex flex-col h-full bg-white/50">
      <div className="flex border-b border-slate-200/80">
        {[
          { key: "ai", label: "✨ AI Chat" },
          { key: "voice", label: "🎙 Voice" },
          { key: "video", label: "📹 Video" },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex-1 py-3 text-xs font-semibold transition-all relative cursor-pointer ${
              tab === key
                ? "text-blue-600 bg-blue-50/50"
                : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
            }`}
          >
            {label}
            {tab === key && (
              <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-blue-500 to-sky-400 rounded-full" />
            )}
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-hidden min-h-0">
        {tab === "ai" && <AIAssistant />}
        {tab === "voice" && <VoiceAgent />}
        {tab === "video" && <VideoAgent />}
      </div>
    </div>
  );
}

// ─── AIAssistant ──────────────────────────────────────────────────────────────
function AIAssistant() {
  const [messages, setMessages] = useState([
    { role: "ai", text: "Hi! 👋 I'm your AI meeting assistant. Ask me to summarize discussions, list action items, or help with anything!" },
  ]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [streamText, setStreamText] = useState("");
  const boxRef = useRef(null);

  useEffect(() => {
    if (boxRef.current) boxRef.current.scrollTop = boxRef.current.scrollHeight;
  }, [messages, streamText]);

  const send = async () => {
    const text = input.trim();
    if (!text || streaming) return;
    setInput("");

    const userMsg = { role: "user", text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setStreamText("");
    setStreaming(true);

    try {
      const formattedHistory = newMessages.map(m => ({
        role: m.role === "user" ? "user" : "assistant",
        content: m.text,
      }));

      const resp = await fetch(AI_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stream: true,
          messages: formattedHistory,
        }),
      });

      if (!resp.ok) {
        const errData = await resp.json().catch(() => ({}));
        throw new Error(errData.error || `Request failed (${resp.status})`);
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let full = "";
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (!jsonStr || jsonStr === "[DONE]") continue;
          try {
            const json = JSON.parse(jsonStr);
            if (json.type === "content_block_delta" && json.delta?.text) {
              full += json.delta.text;
              setStreamText(full);
            }
          } catch {}
        }
      }

      setMessages(p => [...p, { role: "ai", text: full || "I didn't get a response. Please try again." }]);
    } catch (err) {
      console.error("AI Error:", err);
      setMessages(p => [...p, { role: "ai", text: `Sorry, something went wrong: ${err.message}` }]);
    } finally {
      setStreamText("");
      setStreaming(false);
    }
  };

  return (
    <div className="flex flex-col h-full p-4 gap-3 min-h-0">
      {/* Header */}
      <div className="flex items-center gap-2 pb-3 border-b border-slate-100 flex-shrink-0">
        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse-soft" />
        <span className="text-sm font-semibold text-slate-700">AI Assistant</span>
        <span className="ml-auto text-[10px] text-blue-400 font-medium animate-pulse-soft">● Online</span>
      </div>

      {/* Chat */}
      <div ref={boxRef} className="flex-1 overflow-y-auto space-y-3 min-h-0 pr-1">
        {messages.map((m, i) => (
          <div key={i} className={`flex gap-2.5 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 ${
              m.role === "user"
                ? "bg-blue-100 text-blue-600"
                : "bg-gradient-to-br from-violet-100 to-purple-100 text-purple-600"
            }`}>
              {m.role === "user" ? "You" : "AI"}
            </div>
            <div className={`rounded-xl px-3.5 py-2.5 text-sm leading-relaxed max-w-[82%] whitespace-pre-wrap ${
              m.role === "user"
                ? "bg-blue-500 text-white rounded-br-sm"
                : "bg-slate-100 text-slate-700 rounded-bl-sm"
            }`}>
              {m.text}
            </div>
          </div>
        ))}
        {streaming && (
          <div className="flex gap-2.5">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 bg-gradient-to-br from-violet-100 to-purple-100 text-purple-600">
              AI
            </div>
            <div className="rounded-xl px-3.5 py-2.5 text-sm leading-relaxed max-w-[82%] bg-slate-100 text-slate-700 rounded-bl-sm whitespace-pre-wrap">
              {streamText}
              <span className="inline-block w-0.5 h-4 bg-blue-500 animate-pulse ml-0.5 align-middle" />
            </div>
          </div>
        )}
      </div>

      {/* Quick Prompts */}
      <div className="flex flex-wrap gap-1.5 flex-shrink-0">
        {["Summarize meeting", "List action items", "Key decisions", "Follow-ups"].map(p => (
          <button
            key={p}
            onClick={() => setInput(p)}
            className="text-xs px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors cursor-pointer border border-blue-100"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="flex gap-2 flex-shrink-0">
        <input
          className="flex-1 text-sm bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-800 placeholder-slate-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
          placeholder="Ask the AI assistant..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && send()}
          disabled={streaming}
        />
        <button
          onClick={send}
          disabled={streaming}
          className="px-5 py-3 bg-gradient-to-r from-blue-500 to-sky-500 rounded-xl text-white font-semibold hover:shadow-lg hover:shadow-blue-200 transition-all disabled:opacity-50 cursor-pointer text-sm"
        >
          Send
        </button>
      </div>
    </div>
  );
}

// ─── VoiceAgent ───────────────────────────────────────────────────────────────
function VoiceAgent() {
  const [on, setOn] = useState(false);
  const [lines, setLines] = useState([]);
  const [interim, setInterim] = useState("");
  const [volPct, setVolPct] = useState(0);

  const recRef = useRef(null);
  const ctxRef = useRef(null);
  const analyserRef = useRef(null);
  const rafRef = useRef(null);
  const boxRef = useRef(null);

  const stopAll = () => {
    if (recRef.current) { try { recRef.current.stop(); } catch {} recRef.current = null; }
    if (ctxRef.current) { ctxRef.current.close(); ctxRef.current = null; analyserRef.current = null; }
    cancelAnimationFrame(rafRef.current);
    setVolPct(0);
  };

  useEffect(() => () => stopAll(), []);
  useEffect(() => {
    if (boxRef.current) boxRef.current.scrollTop = boxRef.current.scrollHeight;
  }, [lines, interim]);

  const toggle = async () => {
    if (on) { stopAll(); setOn(false); setInterim(""); return; }

    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      setLines(p => [...p, { speaker: "System", text: "Speech recognition not supported. Please use Chrome." }]);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const analyser = ctx.createAnalyser();
      ctx.createMediaStreamSource(stream).connect(analyser);
      ctxRef.current = ctx;
      analyserRef.current = analyser;

      const data = new Uint8Array(analyser.frequencyBinCount);
      const tick = () => {
        analyser.getByteFrequencyData(data);
        setVolPct(Math.min(100, (data.reduce((a, b) => a + b, 0) / data.length) * 1.5));
        rafRef.current = requestAnimationFrame(tick);
      };
      tick();

      const rec = new SR();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = "en-US";
      rec.onresult = (e) => {
        let fin = "", int = "";
        for (let i = e.resultIndex; i < e.results.length; i++) {
          if (e.results[i].isFinal) fin += e.results[i][0].transcript;
          else int += e.results[i][0].transcript;
        }
        if (fin) { setLines(p => [...p, { speaker: "You", text: fin.trim() }]); setInterim(""); }
        else setInterim(int);
      };
      rec.onerror = () => {};
      rec.onend = () => { if (recRef.current) rec.start(); };
      rec.start();
      recRef.current = rec;
      setOn(true);
    } catch {
      setLines(p => [...p, { speaker: "System", text: "Microphone access denied." }]);
    }
  };

  return (
    <div className="flex flex-col h-full p-4 gap-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 flex-shrink-0">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${on ? "bg-green-400 animate-pulse-soft" : "bg-slate-300"}`} />
          <span className="text-sm font-semibold text-slate-700">Voice Transcription</span>
        </div>
        <button
          onClick={toggle}
          className={`text-xs font-semibold px-4 py-1.5 rounded-lg border transition-all cursor-pointer ${
            on
              ? "border-green-200 bg-green-50 text-green-600 hover:bg-green-100"
              : "border-slate-200 bg-white text-slate-500 hover:border-blue-300 hover:text-blue-600"
          }`}
        >
          {on ? "● Stop" : "Start"}
        </button>
      </div>

      {/* Volume bar */}
      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden flex-shrink-0">
        <div
          className="h-full rounded-full transition-all duration-75"
          style={{ width: `${volPct}%`, background: "linear-gradient(90deg, #3b82f6, #0ea5e9)" }}
        />
      </div>

      {/* Transcript */}
      <div ref={boxRef} className="flex-1 overflow-y-auto space-y-3 bg-slate-50 rounded-xl p-3">
        {lines.length === 0 && !interim ? (
          <div className="h-full flex items-center justify-center">
            <p className="text-slate-400 text-sm text-center">Press Start to begin voice transcription</p>
          </div>
        ) : (
          <div className="space-y-2">
            {lines.map((l, i) => (
              <div key={i} className="border-b border-slate-100 pb-2">
                <span className="text-xs font-semibold text-blue-500 block mb-0.5">{l.speaker}</span>
                <span className="text-sm text-slate-700">{l.text}</span>
              </div>
            ))}
            {interim && <p className="text-blue-400/70 italic text-sm">{interim}▌</p>}
          </div>
        )}
      </div>

      {lines.length > 0 && (
        <button
          onClick={() => setLines([])}
          className="text-xs text-slate-400 hover:text-red-500 transition-colors self-end cursor-pointer"
        >
          Clear
        </button>
      )}
    </div>
  );
}

// ─── VideoAgent ───────────────────────────────────────────────────────────────
const EMOTIONS = ["Focused", "Engaged", "Neutral", "Thinking"];

function VideoAgent() {
  const [on, setOn] = useState(false);
  const [emotion, setEmotion] = useState(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const timerRef = useRef(null);

  const stopAll = () => {
    if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
    streamRef.current = null;
    clearTimeout(timerRef.current);
    setEmotion(null);
  };

  useEffect(() => () => stopAll(), []);

  useEffect(() => {
    if (!on) return;
    const cycleEmotion = () => {
      setEmotion(EMOTIONS[Math.floor(Math.random() * EMOTIONS.length)]);
      timerRef.current = setTimeout(cycleEmotion, 2000 + Math.random() * 1500);
    };
    cycleEmotion();
    return () => clearTimeout(timerRef.current);
  }, [on]);

  const toggle = async () => {
    if (on) { stopAll(); if (videoRef.current) videoRef.current.srcObject = null; setOn(false); return; }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setOn(true);
    } catch {
      alert("Camera access denied.");
    }
  };

  return (
    <div className="flex flex-col h-full p-4 gap-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 flex-shrink-0">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${on ? "bg-violet-500 animate-pulse-soft" : "bg-slate-300"}`} />
          <span className="text-sm font-semibold text-slate-700">Video Analysis</span>
        </div>
        <button
          onClick={toggle}
          className={`text-xs font-semibold px-4 py-1.5 rounded-lg border transition-all cursor-pointer ${
            on
              ? "border-violet-200 bg-violet-50 text-violet-600 hover:bg-violet-100"
              : "border-slate-200 bg-white text-slate-500 hover:border-blue-300 hover:text-blue-600"
          }`}
        >
          {on ? "● Stop" : "Start"}
        </button>
      </div>

      {/* Video */}
      <div className="relative w-full aspect-video bg-slate-50 rounded-xl overflow-hidden border border-slate-200 flex-shrink-0">
        <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover" style={{ display: on ? "block" : "none" }} />
        {!on && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 gap-2">
            <svg className="w-8 h-8 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M4 8h8a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4a2 2 0 012-2z" />
            </svg>
            <span className="text-xs">Camera Off</span>
          </div>
        )}
        {on && (
          <div className="absolute top-2 right-2 text-xs bg-violet-500 text-white px-2.5 py-1 rounded-full animate-pulse-soft">
            👁 Analyzing
          </div>
        )}
      </div>

      {/* Emotions */}
      <div className="flex-1 flex flex-col justify-center">
        <p className="text-xs text-slate-400 font-medium mb-3">Sentiment Analysis</p>
        <div className="grid grid-cols-2 gap-2">
          {EMOTIONS.map(e => (
            <div
              key={e}
              className={`text-xs py-2.5 rounded-xl text-center border transition-all duration-300 flex items-center justify-center gap-1.5 ${
                emotion === e
                  ? "bg-violet-50 border-violet-200 text-violet-600 font-semibold"
                  : "bg-slate-50 border-slate-100 text-slate-400"
              }`}
            >
              {emotion === e && <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-ping" />}
              {e}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-slate-50 rounded-xl p-3 text-xs text-slate-500 flex-shrink-0">
        <span className="text-violet-500 font-semibold">Note:</span> Video analysis detects facial expressions and emotional cues during the meeting.
      </div>
    </div>
  );
}