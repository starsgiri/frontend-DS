"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { speak, stopSpeaking } from "@/lib/voice";

/* ── Types ── */
interface Message {
  role: "user" | "assistant";
  content: string;
}

interface Props {
  disabilityKey: string;
  disabilityLabel: string;
  disabilityColor: string;
  disabilityGlow: string;
  disabilityIcon: string;
  onClose: () => void;
}

/* ── Intro messages per mode ── */
const INTROS: Record<string, string> = {
  blind:
    "Hello! I'm AccessiCare's voice assistant. I can read your medical records, explain prescriptions, manage appointments, and answer health questions. Tap the microphone or just start speaking!",
  deaf: "",
  mute: "",
  physical:
    "Hi there! I'm AccessiCare's assistant. I can help you track mobility, manage medications, and access emergency contacts. Speak or type below.",
};

/* ── Quick actions for mute users ── */
const QUICK_ACTIONS = [
  "I have a headache",
  "Show my medications",
  "Next appointment?",
  "Help with prescription",
  "Explain my diagnosis",
  "Contact my doctor",
];

export default function VoiceAssistant({
  disabilityKey,
  disabilityLabel,
  disabilityColor,
  disabilityGlow,
  disabilityIcon,
  onClose,
}: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<
    "idle" | "listening" | "processing" | "speaking"
  >("idle");
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState("");

  const chatEndRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);
  const transcriptRef = useRef("");
  const messagesRef = useRef<Message[]>([]);

  const isBlind = disabilityKey === "blind";
  const isDeaf = disabilityKey === "deaf";
  const isMute = disabilityKey === "mute";
  const isPhysical = disabilityKey === "physical";

  /* keep ref in sync with state */
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  /* auto-scroll */
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, transcript]);

  /* ESC to close */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        stopSpeaking();
        onClose();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  /* Auto-speak intro for voice modes */
  useEffect(() => {
    const intro = INTROS[disabilityKey];
    if (!intro) return;

    speak(intro, 0.9);
    setStatus("speaking");

    const check = setInterval(() => {
      if (!window.speechSynthesis.speaking) {
        setStatus("idle");
        clearInterval(check);
      }
    }, 300);

    return () => {
      clearInterval(check);
      stopSpeaking();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── Send message to LLM ── */
  async function sendMessage(text: string) {
    if (!text.trim()) return;

    const userMsg: Message = { role: "user", content: text.trim() };
    const updated = [...messagesRef.current, userMsg];
    setMessages(updated);
    messagesRef.current = updated;
    setInput("");
    setTranscript("");
    setStatus("processing");
    setError("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          disabilityKey,
          messages: updated.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Request failed (${res.status})`);
      }

      const data = await res.json();
      const reply: Message = { role: "assistant", content: data.message };
      setMessages((prev) => {
        const n = [...prev, reply];
        messagesRef.current = n;
        return n;
      });

      /* Speak aloud for blind / physical */
      if (isBlind || isPhysical) {
        speak(data.message, 0.9);
        setStatus("speaking");
        const check = setInterval(() => {
          if (!window.speechSynthesis.speaking) {
            setStatus("idle");
            clearInterval(check);
          }
        }, 300);
      } else {
        setStatus("idle");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setStatus("idle");
    }
  }

  /* ── Speech recognition ── */
  function startListening() {
    if (isDeaf) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SR =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (!SR) {
      setError("Speech recognition not supported. Please use Chrome.");
      return;
    }

    stopSpeaking();
    const rec = new SR();
    rec.continuous = false;
    rec.interimResults = true;
    rec.lang = "en-US";

    rec.onstart = () => {
      setStatus("listening");
      setTranscript("");
      transcriptRef.current = "";
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rec.onresult = (e: any) => {
      let text = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        text += e.results[i][0].transcript;
      }
      transcriptRef.current = text;
      setTranscript(text);
    };

    rec.onend = () => {
      const t = transcriptRef.current.trim();
      if (t) sendMessage(t);
      else setStatus("idle");
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rec.onerror = (e: any) => {
      if (e.error !== "no-speech") setError(`Speech error: ${e.error}`);
      setStatus("idle");
    };

    recognitionRef.current = rec;
    rec.start();
  }

  function stopListening() {
    recognitionRef.current?.stop();
  }

  /* ── Status colours ── */
  const statusDot =
    status === "idle"
      ? "bg-green-400"
      : status === "listening"
        ? "bg-red-400 animate-pulse"
        : status === "processing"
          ? "bg-yellow-400 animate-pulse"
          : "bg-blue-400 animate-pulse";

  /* ── Render ── */
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      style={{
        background: "rgba(0,0,0,0.85)",
        backdropFilter: "blur(12px)",
      }}
    >
      <motion.div
        initial={{ scale: 0.9, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 30 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="relative w-full max-w-2xl max-h-[85vh] flex flex-col rounded-3xl border overflow-hidden"
        style={{
          background:
            "linear-gradient(160deg, rgba(30,41,59,0.98) 0%, rgba(15,23,42,0.99) 100%)",
          borderColor: `${disabilityColor}30`,
          boxShadow: `0 0 60px ${disabilityGlow}, 0 25px 50px rgba(0,0,0,0.5)`,
        }}
      >
        {/* Top accent */}
        <div
          className="h-1 w-full"
          style={{
            background: `linear-gradient(90deg, transparent, ${disabilityColor}, transparent)`,
          }}
        />

        {/* Header */}
        <div
          className="flex items-center gap-3 px-6 py-4 border-b"
          style={{ borderColor: `${disabilityColor}20` }}
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
            style={{ background: `${disabilityColor}20` }}
          >
            {disabilityIcon}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-bold text-lg">
              {disabilityLabel} Assistant
            </h3>
            <p className="text-slate-400 text-xs">
              {isBlind
                ? "Voice-powered AI · Speak or type"
                : isDeaf
                  ? "Visual text assistant · Type below"
                  : isMute
                    ? "Text communication · Type or tap"
                    : "Simplified AI · Speak or type"}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className={`w-2 h-2 rounded-full ${statusDot}`} />
            <span className="text-[10px] text-slate-500 capitalize">
              {status}
            </span>
          </div>
          <button
            onClick={() => {
              stopSpeaking();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition-colors text-sm"
          >
            ✕
          </button>
        </div>

        {/* Chat messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[200px]">
          {messages.length === 0 && (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">{disabilityIcon}</div>
              <p className="text-slate-500 text-sm">
                {isBlind
                  ? "🎙️ Tap the microphone to start speaking"
                  : isDeaf
                    ? "⌨️ Type your question below"
                    : isMute
                      ? "💬 Choose a quick action or type below"
                      : "🗣️ Speak or type your question"}
              </p>
            </div>
          )}

          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.role === "user"
                    ? "bg-white/10 text-white rounded-br-sm"
                    : "rounded-bl-sm text-slate-200"
                }`}
                style={
                  msg.role === "assistant"
                    ? {
                        background: `${disabilityColor}12`,
                        borderLeft: `3px solid ${disabilityColor}`,
                      }
                    : undefined
                }
              >
                {msg.content}
              </div>
            </motion.div>
          ))}

          {/* Live transcript */}
          {status === "listening" && transcript && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-end"
            >
              <div className="max-w-[80%] px-4 py-3 rounded-2xl rounded-br-sm text-sm bg-white/5 text-white/40 italic border border-dashed border-white/10">
                {transcript}…
              </div>
            </motion.div>
          )}

          {/* Processing dots */}
          {status === "processing" && (
            <div className="flex justify-start">
              <div
                className="px-4 py-3 rounded-2xl flex gap-1.5"
                style={{ background: `${disabilityColor}10` }}
              >
                <span
                  className="w-2 h-2 rounded-full animate-bounce"
                  style={{
                    background: disabilityColor,
                    animationDelay: "0ms",
                  }}
                />
                <span
                  className="w-2 h-2 rounded-full animate-bounce"
                  style={{
                    background: disabilityColor,
                    animationDelay: "150ms",
                  }}
                />
                <span
                  className="w-2 h-2 rounded-full animate-bounce"
                  style={{
                    background: disabilityColor,
                    animationDelay: "300ms",
                  }}
                />
              </div>
            </div>
          )}

          {error && (
            <div className="text-center text-red-400 text-xs py-2 px-4 bg-red-400/10 rounded-xl">
              {error}
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Quick actions for mute mode */}
        {isMute && messages.length === 0 && (
          <div className="px-4 pb-2">
            <p className="text-[10px] text-slate-600 mb-2 uppercase tracking-wider">
              Quick actions
            </p>
            <div className="flex flex-wrap gap-1.5">
              {QUICK_ACTIONS.map((a, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(a)}
                  className="px-3 py-1.5 rounded-full text-[11px] border transition-all hover:scale-105"
                  style={{
                    borderColor: `${disabilityColor}30`,
                    color: disabilityColor,
                    background: `${disabilityColor}08`,
                  }}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input area */}
        <div
          className="px-4 pb-4 pt-3 border-t"
          style={{ borderColor: `${disabilityColor}10` }}
        >
          <div className="flex items-center gap-2">
            {/* Mic button (hidden for deaf users) */}
            {!isDeaf && (
              <button
                onClick={
                  status === "listening" ? stopListening : startListening
                }
                disabled={status === "processing" || status === "speaking"}
                className="relative shrink-0 w-11 h-11 rounded-full flex items-center justify-center text-lg transition-all disabled:opacity-30"
                style={{
                  background:
                    status === "listening"
                      ? disabilityColor
                      : `${disabilityColor}18`,
                  color: status === "listening" ? "#fff" : disabilityColor,
                  boxShadow:
                    status === "listening"
                      ? `0 0 24px ${disabilityGlow}`
                      : "none",
                }}
              >
                {status === "listening" && (
                  <span
                    className="absolute inset-0 rounded-full animate-ping opacity-25"
                    style={{ background: disabilityColor }}
                  />
                )}
                <span className="relative">
                  {status === "listening" ? "⏹" : "🎙️"}
                </span>
              </button>
            )}

            {/* Text input */}
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage(input);
                }
              }}
              placeholder={
                isBlind ? "Or type here…" : "Type your message…"
              }
              disabled={status === "processing" || status === "speaking"}
              className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border text-white text-sm placeholder-slate-600 focus:outline-none transition-colors"
              style={{ borderColor: `${disabilityColor}20` }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = `${disabilityColor}50`;
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = `${disabilityColor}20`;
              }}
            />

            {/* Send */}
            <button
              onClick={() => sendMessage(input)}
              disabled={
                !input.trim() ||
                status === "processing" ||
                status === "speaking"
              }
              className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm transition-all hover:scale-105 disabled:opacity-25"
              style={{ background: disabilityColor }}
            >
              ➤
            </button>
          </div>

          {/* Hint for blind users */}
          {isBlind && (
            <p className="text-[10px] text-slate-600 mt-2 text-center">
              Press Enter to send · Click 🎙️ to speak · ESC to close
            </p>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
