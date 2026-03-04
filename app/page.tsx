"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import BlurText from "@/components/BlurText";

const DomeGallery = dynamic(() => import("@/components/DomeGallery"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center text-white/40 text-sm">
      Loading gallery…
    </div>
  ),
});

const VoiceAssistant = dynamic(() => import("@/components/VoiceAssistant"), {
  ssr: false,
});

/* ── Disability data for the 4 corners ── */
interface DisabilityInfo {
  key: string;
  icon: string;
  label: string;
  color: string;
  glow: string;
  description: string;
  features: { icon: string; text: string }[];
}

const DISABILITIES: DisabilityInfo[] = [
  {
    key: "blind",
    icon: "👁️",
    label: "Blind",
    color: "#818cf8",
    glow: "rgba(129,140,248,0.35)",
    description:
      "Full voice-guided access to medical records, prescriptions, and health data — no screen needed.",
    features: [
      { icon: "🔊", text: "Text-to-speech reads every medical record & prescription aloud" },
      { icon: "🎙️", text: "Voice narration auto-plays on page load with adjustable speed" },
      { icon: "🔔", text: "Audio cues & alerts for appointment reminders and critical updates" },
      { icon: "🖥️", text: "Screen reader-optimized with ARIA labels on every element" },
    ],
  },
  {
    key: "deaf",
    icon: "🦻",
    label: "Deaf",
    color: "#38bdf8",
    glow: "rgba(56,189,248,0.35)",
    description:
      "Visual-first experience with rich text navigation so nothing is lost without sound.",
    features: [
      { icon: "📝", text: "Step-by-step text navigation replaces all audio-based guidance" },
      { icon: "💡", text: "Flashing visual indicators instead of sound-based notifications" },
      { icon: "📋", text: "Detailed written summaries for every diagnosis & treatment plan" },
      { icon: "🔤", text: "High-contrast mode and adjustable font sizes for clarity" },
    ],
  },
  {
    key: "mute",
    icon: "🤐",
    label: "Mute",
    color: "#f472b6",
    glow: "rgba(244,114,182,0.35)",
    description:
      "Seamless interaction without spoken input — communicate through text and visual interfaces.",
    features: [
      { icon: "⌨️", text: "Text-only interaction for consultations — no voice input required" },
      { icon: "📄", text: "One-click sharing of medical history with doctors via records API" },
      { icon: "🔔", text: "Visual notification system for prescriptions and follow-ups" },
      { icon: "🏷️", text: "Pre-built symptom cards for quick communication during visits" },
    ],
  },
  {
    key: "physical",
    icon: "♿",
    label: "Physically Challenged",
    color: "#34d399",
    glow: "rgba(52,211,153,0.35)",
    description:
      "Simplified navigation, mobility tracking, and health monitoring for limited motor ability.",
    features: [
      { icon: "📊", text: "Mobility score & pain-level tracking with visual trend graphs" },
      { icon: "💊", text: "Centralized medication, treatment, and prescription history" },
      { icon: "🏥", text: "Disability certificate & percentage records stored securely" },
      { icon: "🚨", text: "Emergency contact info always one click away" },
    ],
  },
];

export default function LandingPage() {
  const router = useRouter();
  const [animationDone, setAnimationDone] = useState(false);
  const [selectedDisability, setSelectedDisability] = useState<DisabilityInfo | null>(null);
  const [testingDisability, setTestingDisability] = useState<DisabilityInfo | null>(null);

  const handleAnimationComplete = () => {
    setAnimationDone(true);
  };

  return (
    <div className="min-h-screen flex flex-col"
      style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e293b 40%, #1e40af 100%)" }}>

      {/* Hero Section */}
      <section className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      
      {/* Animated background circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute w-96 h-96 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #3b82f6, transparent)", top: "-10%", right: "-5%" }}
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute w-72 h-72 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #8b5cf6, transparent)", bottom: "-5%", left: "-5%" }}
          animate={{ scale: [1.2, 1, 1.2], rotate: [0, -90, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute w-64 h-64 rounded-full opacity-5"
          style={{ background: "radial-gradient(circle, #06b6d4, transparent)", top: "40%", left: "30%" }}
          animate={{ scale: [1, 1.4, 1] }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        {/* Icon */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <span className="text-7xl">♿</span>
        </motion.div>

        {/* Animated Title */}
        <div className="mb-6">
          <BlurText
            text="Let Us Uprise The Challenged People"
            delay={200}
            animateBy="words"
            direction="top"
            onAnimationComplete={handleAnimationComplete}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight justify-center"
          />
        </div>

        {/* Subtitle - appears after title animation */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: animationDone ? 1 : 0 }}
          transition={{ duration: 0.8 }}
          className="text-lg md:text-xl text-slate-300 mb-12 max-w-2xl mx-auto"
        >
          Accessible medical records management with voice assistance for the blind
          and text navigation for the deaf &amp; mute.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: animationDone ? 1 : 0, y: animationDone ? 0 : 20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <button
            onClick={() => router.push("/dashboard")}
            className="px-8 py-4 bg-blue-600 text-white rounded-xl text-lg font-semibold hover:bg-blue-500 transition-all hover:scale-105 shadow-lg shadow-blue-600/30"
          >
            Enter Dashboard
          </button>
          <button
            onClick={() => router.push("/patients/new")}
            className="px-8 py-4 border-2 border-white/30 text-white rounded-xl text-lg font-semibold hover:bg-white/10 transition-all hover:scale-105"
          >
            Register Patient
          </button>
        </motion.div>

        {/* Feature pills */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: animationDone ? 1 : 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex flex-wrap gap-3 justify-center mt-16"
        >
          <FeaturePill icon="🔊" label="Voice Assistance" />
          <FeaturePill icon="📝" label="Text Navigation" />
          <FeaturePill icon="🏥" label="Medical Records" />
          <FeaturePill icon="📊" label="Health Tracking" />
          <FeaturePill icon="♿" label="Auto Accessibility" />
        </motion.div>
      </div>

      {/* Footer hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: animationDone ? 0.5 : 0 }}
        transition={{ duration: 1, delay: 0.8 }}
        className="absolute bottom-6 text-slate-400 text-sm"
      >
        AccessiCare — Empowering healthcare for everyone
      </motion.div>
      </section>

      {/* Dome Gallery Section — 4 Corners with Disabilities */}
      <section className="relative flex flex-col items-center overflow-hidden"
        style={{ background: "linear-gradient(180deg, #1e40af 0%, #0f172a 100%)" }}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center pt-16 pb-4 px-6 z-10"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Experience Accessible Technology
          </h2>
          <p className="text-slate-300 max-w-xl mx-auto">
            Drag to explore &amp; click any image to discover how AccessiCare helps.
          </p>
        </motion.div>

        {/* Corner Labels — overlaid on the gallery */}
        <div className="relative w-full" style={{ height: "600px" }}>
          {/* Corner labels */}
          <div className="absolute inset-0 z-10 pointer-events-none">
            <div className="relative w-full max-w-3xl mx-auto h-full px-6">
              <CornerLabel
                disability={DISABILITIES[0]}
                position="top-left"
                onTest={() => setTestingDisability(DISABILITIES[0])}
                onRegister={() => router.push("/patients/new")}
              />
              <CornerLabel
                disability={DISABILITIES[1]}
                position="top-right"
                onTest={() => setTestingDisability(DISABILITIES[1])}
                onRegister={() => router.push("/patients/new")}
              />
              <CornerLabel
                disability={DISABILITIES[2]}
                position="bottom-left"
                onTest={() => setTestingDisability(DISABILITIES[2])}
                onRegister={() => router.push("/patients/new")}
              />
              <CornerLabel
                disability={DISABILITIES[3]}
                position="bottom-right"
                onTest={() => setTestingDisability(DISABILITIES[3])}
                onRegister={() => router.push("/patients/new")}
              />
            </div>
          </div>

          {/* Dome Gallery */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="absolute inset-0"
          >
            <DomeGallery
              fit={0.8}
              minRadius={600}
              maxVerticalRotationDeg={0}
              segments={34}
              dragDampening={2}
              grayscale={false}
              overlayBlurColor="#0f172a"
              autoRotate
              autoRotateSpeed={0.15}
            />
          </motion.div>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.5 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-slate-400 text-xs py-4"
        >
          Drag to rotate &bull; Click any image to enlarge &bull; Click a corner to learn more
        </motion.p>
      </section>

      {/* ── Voice Assistant Overlay ── */}
      <AnimatePresence>
        {testingDisability && (
          <VoiceAssistant
            disabilityKey={testingDisability.key}
            disabilityLabel={testingDisability.label}
            disabilityColor={testingDisability.color}
            disabilityGlow={testingDisability.glow}
            disabilityIcon={testingDisability.icon}
            onClose={() => setTestingDisability(null)}
          />
        )}
      </AnimatePresence>

      {/* ── Popup Modal ── */}
      <AnimatePresence>
        {selectedDisability && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6"
            style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)" }}
            onClick={() => setSelectedDisability(null)}
          >
            <motion.div
              key="modal"
              initial={{ opacity: 0, scale: 0.85, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 30 }}
              transition={{ type: "spring", stiffness: 350, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-lg rounded-3xl border border-white/15 overflow-hidden"
              style={{
                background: "linear-gradient(160deg, rgba(30,41,59,0.95) 0%, rgba(15,23,42,0.98) 100%)",
                boxShadow: `0 0 80px ${selectedDisability.glow}, 0 25px 50px rgba(0,0,0,0.5)`,
              }}
            >
              {/* Glow accent */}
              <div
                className="absolute top-0 left-0 w-full h-1"
                style={{ background: selectedDisability.color }}
              />

              {/* Close button */}
              <button
                onClick={() => setSelectedDisability(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition-colors text-lg"
              >
                &times;
              </button>

              <div className="p-8">
                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl shrink-0"
                    style={{ background: `${selectedDisability.color}22` }}
                  >
                    {selectedDisability.icon}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">
                      {selectedDisability.label}
                    </h3>
                    <p className="text-slate-400 text-sm mt-1">
                      How AccessiCare helps
                    </p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-slate-300 leading-relaxed mb-6">
                  {selectedDisability.description}
                </p>

                {/* Feature list */}
                <ul className="space-y-4">
                  {selectedDisability.features.map((f, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -15 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 + i * 0.08 }}
                      className="flex items-start gap-3 p-3 rounded-xl"
                      style={{ background: "rgba(255,255,255,0.04)" }}
                    >
                      <span className="text-xl mt-0.5 shrink-0">{f.icon}</span>
                      <span className="text-slate-200 text-sm leading-relaxed">{f.text}</span>
                    </motion.li>
                  ))}
                </ul>

                {/* CTA */}
                <button
                  onClick={() => {
                    setSelectedDisability(null);
                    router.push("/patients/new");
                  }}
                  className="mt-8 w-full py-3 rounded-xl text-white font-semibold transition-all hover:brightness-110"
                  style={{ background: selectedDisability.color }}
                >
                  Register a Patient &rarr;
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FeaturePill({ icon, label }: { icon: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white/80 text-sm border border-white/10">
      <span>{icon}</span>
      {label}
    </span>
  );
}

/* ── Corner Label positioned at a corner of the cube grid ── */
function CornerLabel({
  disability,
  position,
  onTest,
  onRegister,
}: {
  disability: DisabilityInfo;
  position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  onTest: () => void;
  onRegister: () => void;
}) {
  const posClasses: Record<string, string> = {
    "top-left": "top-4 left-2",
    "top-right": "top-4 right-2",
    "bottom-left": "bottom-4 left-2",
    "bottom-right": "bottom-4 right-2",
  };

  const delayMap: Record<string, number> = {
    "top-left": 0.1,
    "top-right": 0.2,
    "bottom-left": 0.3,
    "bottom-right": 0.4,
  };

  /* Short 1-line tag per disability */
  const taglines: Record<string, string> = {
    blind: "Voice-guided medical access",
    deaf: "Visual-first navigation",
    mute: "Text-only communication",
    physical: "Simplified health tracking",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: position.startsWith("top") ? -30 : 30, scale: 0.6 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ type: "spring", stiffness: 180, damping: 16, delay: delayMap[position] }}
      whileHover={{ scale: 1.06, y: -3 }}
      className={`absolute ${posClasses[position]} z-10 pointer-events-auto group`}
    >
      {/* Glassmorphism card */}
      <div
        className="relative flex flex-col items-center gap-1.5 px-4 py-3.5 rounded-2xl border transition-all duration-500"
        style={{
          background: `linear-gradient(135deg, ${disability.color}14 0%, ${disability.color}06 100%)`,
          backdropFilter: "blur(18px) saturate(1.4)",
          WebkitBackdropFilter: "blur(18px) saturate(1.4)",
          borderColor: `${disability.color}30`,
          boxShadow: `0 0 0px transparent, inset 0 1px 0 ${disability.color}15`,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = `${disability.color}70`;
          e.currentTarget.style.boxShadow = `0 0 28px ${disability.glow}, 0 8px 24px ${disability.color}18, inset 0 1px 0 ${disability.color}25`;
          e.currentTarget.style.background = `linear-gradient(135deg, ${disability.color}22 0%, ${disability.color}0c 100%)`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = `${disability.color}30`;
          e.currentTarget.style.boxShadow = `0 0 0px transparent, inset 0 1px 0 ${disability.color}15`;
          e.currentTarget.style.background = `linear-gradient(135deg, ${disability.color}14 0%, ${disability.color}06 100%)`;
        }}
      >
        {/* Pulse ring + icon */}
        <div className="relative">
          <span
            className="absolute inset-0 rounded-full animate-ping opacity-20"
            style={{ background: disability.color }}
          />
          <span
            className="relative z-10 flex items-center justify-center w-11 h-11 rounded-full text-xl border transition-all duration-300 group-hover:rotate-6 group-hover:scale-110"
            style={{
              background: `${disability.color}20`,
              borderColor: `${disability.color}40`,
              boxShadow: `0 0 10px ${disability.glow}`,
            }}
          >
            {disability.icon}
          </span>
        </div>

        {/* Label */}
        <span
          className="text-[11px] font-bold uppercase tracking-widest text-center leading-tight"
          style={{ color: disability.color }}
        >
          {disability.label}
        </span>

        {/* Accent line */}
        <span
          className="block w-6 h-[2px] rounded-full opacity-40 group-hover:w-9 group-hover:opacity-80 transition-all duration-500"
          style={{ background: disability.color }}
        />

        {/* Tagline */}
        <p className="text-[9px] text-slate-400 text-center leading-tight max-w-[130px]">
          {taglines[disability.key] ?? disability.description}
        </p>

        {/* Buttons */}
        <div className="flex gap-1.5 mt-1">
          <button
            onClick={(e) => { e.stopPropagation(); onRegister(); }}
            className="px-2.5 py-1 text-[9px] font-semibold rounded-lg border cursor-pointer transition-all hover:scale-105 hover:brightness-125"
            style={{
              borderColor: `${disability.color}40`,
              color: disability.color,
              background: `${disability.color}10`,
            }}
          >
            Register
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onTest(); }}
            className="px-2.5 py-1 text-[9px] font-semibold rounded-lg text-white cursor-pointer transition-all hover:scale-105 hover:brightness-110"
            style={{
              background: disability.color,
              boxShadow: `0 2px 10px ${disability.glow}`,
            }}
          >
            Test ▶
          </button>
        </div>
      </div>
    </motion.div>
  );
}
