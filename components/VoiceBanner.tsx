"use client";

import { speak, stopSpeaking } from "@/lib/voice";

interface VoiceBannerProps {
  narration: string;
  rate?: number;
}

export default function VoiceBanner({ narration, rate = 1.0 }: VoiceBannerProps) {
  return (
    <div
      className="flex items-center gap-3 p-4 rounded-lg mb-6 border"
      style={{ backgroundColor: "#eff6ff", borderColor: "#bfdbfe" }}
      role="alert"
      aria-live="polite"
    >
      <span className="text-2xl" aria-hidden="true">🔊</span>
      <div className="flex-1">
        <p className="text-sm font-semibold text-blue-900">Voice Assistance Active</p>
        <p className="text-xs text-blue-700 mt-1 line-clamp-2">{narration}</p>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => speak(narration, rate)}
          className="px-3 py-1.5 text-xs font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          aria-label="Play voice narration"
        >
          ▶ Play
        </button>
        <button
          onClick={stopSpeaking}
          className="px-3 py-1.5 text-xs font-medium bg-slate-200 text-slate-700 rounded-md hover:bg-slate-300 transition-colors"
          aria-label="Stop voice narration"
        >
          ⏹ Stop
        </button>
      </div>
    </div>
  );
}
