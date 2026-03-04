"use client";

import { useEffect, useState } from "react";
import { patientApi, accessibilityApi } from "@/lib/api";
import { PatientDTO, AccessibilityResponse, DISABILITY_LABELS } from "@/lib/types";
import VoiceBanner from "@/components/VoiceBanner";
import TextNavigation from "@/components/TextNavigation";

type AccessibleProfile = {
  data: unknown;
  voiceNarration?: string;
  navigationSteps?: string[];
  audioCue?: string;
  screenReaderHint?: string;
};

export default function AccessibilityPage() {
  const [patients, setPatients] = useState<PatientDTO[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<number | "">("");
  const [patientProfile, setPatientProfile] = useState<AccessibleProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    patientApi.getAll().then(setPatients).catch(() => {});
  }, []);

  async function loadAccessibleProfile(patientId: number) {
    setLoading(true);
    setError("");
    setPatientProfile(null);
    try {
      const data = await accessibilityApi.autoRecords(patientId);
      // Adapt the AccessibilityResponse<MedicalRecordDTO[]> to show patient-level info
      setPatientProfile({
        data: null,
        voiceNarration: data.voiceNarration,
        navigationSteps: data.navigationSteps,
        audioCue: data.audioCue,
        screenReaderHint: data.screenReaderHint,
      });
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load accessible profile");
    } finally {
      setLoading(false);
    }
  }

  function handlePatientChange(id: number | "") {
    setSelectedPatient(id);
    if (id) loadAccessibleProfile(Number(id));
    else setPatientProfile(null);
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Accessibility Center</h1>
      <p className="text-slate-500 mb-8">
        Test and experience the accessibility features designed for physically challenged users.
        Select a patient to see their profile rendered in their preferred accessible format.
      </p>

      {/* Feature Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <FeatureCard
          icon="🔊"
          title="Voice Assistance"
          description="Automatically reads out patient information, medical records, and status updates using text-to-speech. Designed for blind and visually impaired users."
          forWhom="Blind Users"
        />
        <FeatureCard
          icon="📝"
          title="Text Navigation"
          description="Provides clear, step-by-step text instructions for navigating through medical information. Designed for deaf and mute users."
          forWhom="Deaf / Mute Users"
        />
        <FeatureCard
          icon="♿"
          title="Auto-Detection"
          description="The system automatically detects the patient's disability type and selects the appropriate accessibility mode. Can be overridden manually."
          forWhom="All Users"
        />
      </div>

      {/* Live Demo */}
      <div className="rounded-xl p-6 border mb-8" style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--border)" }}>
        <h2 className="text-xl font-semibold mb-4">Live Demo — Select a Patient</h2>
        <select
          value={selectedPatient}
          onChange={(e) => handlePatientChange(e.target.value ? Number(e.target.value) : "")}
          className="px-3 py-2 border rounded-lg text-sm w-full max-w-md"
          style={{ borderColor: "var(--border)" }}
          aria-label="Select a patient to view accessible profile"
        >
          <option value="">Choose a patient...</option>
          {patients.map((p) => (
            <option key={p.id} value={p.id!}>
              {p.firstName} {p.lastName} — {DISABILITY_LABELS[p.disabilityType]}
            </option>
          ))}
        </select>

        {loading && (
          <div className="flex items-center justify-center h-32 mt-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
          </div>
        )}

        {error && (
          <div className="p-4 mt-6 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>
        )}

        {patientProfile && !loading && (
          <div className="mt-6 space-y-6">
            {/* Audio Cue */}
            {patientProfile.audioCue && (
              <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 text-sm">
                🔔 Audio Cue: {patientProfile.audioCue}
              </div>
            )}

            {/* Screen Reader Hint */}
            {patientProfile.screenReaderHint && (
              <div className="p-3 rounded-lg bg-purple-50 border border-purple-200 text-purple-700 text-sm">
                🖥️ Screen Reader: {patientProfile.screenReaderHint}
              </div>
            )}

            {/* Voice Narration */}
            {patientProfile.voiceNarration && (
              <div>
                <h3 className="text-lg font-semibold mb-2">🔊 Voice Narration</h3>
                <VoiceBanner narration={patientProfile.voiceNarration} />
              </div>
            )}

            {/* Text Navigation Steps */}
            {patientProfile.navigationSteps && patientProfile.navigationSteps.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-2">📝 Text Navigation Steps</h3>
                <TextNavigation steps={patientProfile.navigationSteps} />
              </div>
            )}

            {/* Patient Data */}
            {patientProfile.data != null && (
              <div className="rounded-lg p-4 border" style={{ borderColor: "var(--border)" }}>
                <h3 className="text-lg font-semibold mb-3">Patient Data</h3>
                <pre className="text-xs whitespace-pre-wrap bg-slate-50 p-4 rounded-lg overflow-auto max-h-64">
                  {JSON.stringify(patientProfile.data, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>

      {/* API Endpoints Reference */}
      <div className="rounded-xl p-6 border" style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--border)" }}>
        <h2 className="text-xl font-semibold mb-4">Accessibility API Endpoints</h2>
        <div className="space-y-3 text-sm">
          <Endpoint method="GET" path="/api/accessible/voice/patient/{id}" desc="Voice narration for patient profile" />
          <Endpoint method="GET" path="/api/accessible/voice/record/{id}" desc="Voice narration for medical record" />
          <Endpoint method="GET" path="/api/accessible/voice/status/{id}" desc="Voice narration for status entry" />
          <Endpoint method="GET" path="/api/accessible/text/patient/{id}" desc="Text navigation for patient profile" />
          <Endpoint method="GET" path="/api/accessible/text/record/{id}" desc="Text navigation for medical record" />
          <Endpoint method="GET" path="/api/accessible/text/status/{id}" desc="Text navigation for status entry" />
          <Endpoint method="GET" path="/api/accessible/auto/patient/{id}" desc="Auto-detect mode for patient" />
          <Endpoint method="GET" path="/api/accessible/auto/record/{id}" desc="Auto-detect mode for record" />
          <Endpoint method="GET" path="/api/accessible/auto/status/{id}" desc="Auto-detect mode for status" />
        </div>
      </div>
    </div>
  );
}

function FeatureCard({
  icon, title, description, forWhom,
}: {
  icon: string; title: string; description: string; forWhom: string;
}) {
  return (
    <div className="rounded-xl p-6 border" style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--border)" }}>
      <div className="text-3xl mb-3">{icon}</div>
      <h3 className="text-lg font-semibold mb-1">{title}</h3>
      <p className="text-sm text-slate-500 mb-3">{description}</p>
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
        {forWhom}
      </span>
    </div>
  );
}

function Endpoint({ method, path, desc }: { method: string; path: string; desc: string }) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50">
      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-green-100 text-green-800">
        {method}
      </span>
      <div>
        <code className="text-xs font-mono">{path}</code>
        <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
      </div>
    </div>
  );
}
