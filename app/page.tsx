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

      {/* Dome Gallery Section */}
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

        {/* Dome Gallery */}
        <div className="relative w-full" style={{ height: "600px" }}>
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
          Drag to rotate &bull; Click any image to enlarge
        </motion.p>
      </section>

      {/* Disability Cards Section — Below the Globe */}
      <section
        className="relative py-20 px-6"
        style={{ background: "linear-gradient(180deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)" }}
      >
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Choose Your Accessibility Mode
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Each mode is tailored to provide the best healthcare experience. Register a patient or test the features live.
          </p>
        </motion.div>

        {/* 4 Disability Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {DISABILITIES.map((d, i) => (
            <DisabilityCard
              key={d.key}
              disability={d}
              index={i}
              onTest={() => setTestingDisability(d)}
              onRegister={() => router.push("/patients/new")}
              onLearnMore={() => setSelectedDisability(d)}
            />
          ))}
        </div>
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

/* ── Disability Card — displayed below the globe ── */
function DisabilityCard({
  disability,
  index,
  onTest,
  onRegister,
  onLearnMore,
}: {
  disability: DisabilityInfo;
  index: number;
  onTest: () => void;
  onRegister: () => void;
  onLearnMore: () => void;
}) {
  const taglines: Record<string, string> = {
    blind: "Voice-guided medical access",
    deaf: "Visual-first navigation",
    mute: "Text-only communication",
    physical: "Simplified health tracking",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ type: "spring", stiffness: 180, damping: 20, delay: index * 0.12 }}
      whileHover={{ scale: 1.04, y: -8 }}
      className="group cursor-pointer"
      onClick={onLearnMore}
    >
      <div
        className="relative flex flex-col items-center gap-4 px-6 py-8 rounded-3xl border transition-all duration-500 h-full"
        style={{
          background: `linear-gradient(160deg, ${disability.color}18 0%, rgba(15,23,42,0.9) 60%)`,
          backdropFilter: "blur(20px) saturate(1.5)",
          WebkitBackdropFilter: "blur(20px) saturate(1.5)",
          borderColor: `${disability.color}35`,
          boxShadow: `0 4px 30px ${disability.color}10, inset 0 1px 0 ${disability.color}15`,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = `${disability.color}80`;
          e.currentTarget.style.boxShadow = `0 0 50px ${disability.glow}, 0 12px 40px ${disability.color}25, inset 0 1px 0 ${disability.color}30`;
          e.currentTarget.style.background = `linear-gradient(160deg, ${disability.color}28 0%, rgba(15,23,42,0.85) 60%)`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = `${disability.color}35`;
          e.currentTarget.style.boxShadow = `0 4px 30px ${disability.color}10, inset 0 1px 0 ${disability.color}15`;
          e.currentTarget.style.background = `linear-gradient(160deg, ${disability.color}18 0%, rgba(15,23,42,0.9) 60%)`;
        }}
      >
        {/* Top glow accent line */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 h-[3px] rounded-full transition-all duration-500 group-hover:w-3/4 w-1/3"
          style={{ background: `linear-gradient(90deg, transparent, ${disability.color}, transparent)` }}
        />

        {/* Animated icon with pulse */}
        <div className="relative mt-2">
          <span
            className="absolute inset-0 rounded-full animate-ping opacity-20"
            style={{ background: disability.color }}
          />
          <span
            className="relative z-10 flex items-center justify-center w-16 h-16 rounded-2xl text-3xl border transition-all duration-300 group-hover:rotate-6 group-hover:scale-110"
            style={{
              background: `${disability.color}20`,
              borderColor: `${disability.color}45`,
              boxShadow: `0 0 20px ${disability.glow}`,
            }}
          >
            {disability.icon}
          </span>
        </div>

        {/* Label */}
        <h3
          className="text-sm font-bold uppercase tracking-widest text-center leading-tight"
          style={{ color: disability.color }}
        >
          {disability.label}
        </h3>

        {/* Accent divider */}
        <span
          className="block w-10 h-[2px] rounded-full opacity-50 group-hover:w-16 group-hover:opacity-90 transition-all duration-500"
          style={{ background: disability.color }}
        />

        {/* Tagline */}
        <p className="text-xs text-slate-400 text-center leading-relaxed max-w-[180px]">
          {taglines[disability.key] ?? disability.description}
        </p>

        {/* Feature highlights (first 2) */}
        <div className="space-y-2 w-full mt-1">
          {disability.features.slice(0, 2).map((f, i) => (
            <div
              key={i}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-[11px] text-slate-300"
              style={{ background: `${disability.color}0a` }}
            >
              <span className="text-sm shrink-0">{f.icon}</span>
              <span className="leading-tight">{f.text}</span>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-auto pt-3 w-full">
          <button
            onClick={(e) => { e.stopPropagation(); onRegister(); }}
            className="flex-1 px-3 py-2.5 text-xs font-semibold rounded-xl border cursor-pointer transition-all hover:scale-105 hover:brightness-125"
            style={{
              borderColor: `${disability.color}50`,
              color: disability.color,
              background: `${disability.color}12`,
            }}
          >
            Register
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onTest(); }}
            className="flex-1 px-3 py-2.5 text-xs font-semibold rounded-xl text-white cursor-pointer transition-all hover:scale-105 hover:brightness-110"
            style={{
              background: `linear-gradient(135deg, ${disability.color}, ${disability.color}cc)`,
              boxShadow: `0 4px 16px ${disability.glow}`,
            }}
          >
            Test ▶
          </button>
        </div>

        {/* Learn more hint */}
        <p className="text-[10px] text-slate-500 group-hover:text-slate-300 transition-colors">
          Click to learn more &rarr;
        </p>
      </div>
    </motion.div>
  );
}
