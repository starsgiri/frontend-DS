"use client";

/**
 * Browser-side Text-to-Speech helper for blind users.
 * Wraps the Web Speech API.
 */

let synth: SpeechSynthesis | null = null;

function getSynth(): SpeechSynthesis | null {
  if (typeof window === "undefined") return null;
  if (!synth) synth = window.speechSynthesis;
  return synth;
}

export function speak(text: string, rate = 1.0, lang = "en-US") {
  const s = getSynth();
  if (!s) return;
  s.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = rate;
  utterance.lang = lang;
  utterance.pitch = 1;
  s.speak(utterance);
}

export function stopSpeaking() {
  getSynth()?.cancel();
}

export function isSpeaking(): boolean {
  return getSynth()?.speaking ?? false;
}
