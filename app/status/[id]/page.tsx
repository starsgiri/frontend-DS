"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { statusApi, accessibilityApi } from "@/lib/api";
import { MedicalStatusDTO, AccessibilityResponse, CONDITION_LABELS } from "@/lib/types";
import StatusBadge from "@/components/StatusBadge";
import VoiceBanner from "@/components/VoiceBanner";
import TextNavigation from "@/components/TextNavigation";

export default function StatusDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [status, setStatus] = useState<MedicalStatusDTO | null>(null);
  const [accessible, setAccessible] = useState<AccessibilityResponse<MedicalStatusDTO> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    statusApi
      .getById(Number(id))
      .then((s) => {
        setStatus(s);
        if (s.patientId) {
          accessibilityApi.voiceStatus(s.patientId).then(setAccessible).catch(() => {});
        }
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (error || !status) {
    return (
      <div className="text-center py-16 text-red-600">
        {error || "Status entry not found"}
        <br />
        <Link href="/status" className="text-blue-600 hover:underline mt-4 inline-block">← Back</Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {accessible?.voiceNarration && <VoiceBanner narration={accessible.voiceNarration} />}
      {accessible?.navigationSteps && accessible.navigationSteps.length > 0 && (
        <TextNavigation steps={accessible.navigationSteps} />
      )}

      <Link href="/status" className="text-sm text-blue-600 hover:underline">← Back to Status Tracking</Link>
      <div className="flex items-center gap-3 mt-2 mb-6">
        <StatusBadge status={status.conditionStatus} />
        <span className="text-sm text-slate-500">{status.statusDate}</span>
      </div>

      {status.conditionSummary && (
        <div className="rounded-xl p-6 border mb-6" style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--border)" }}>
          <h2 className="text-lg font-semibold mb-3">Condition Summary</h2>
          <p className="text-sm">{status.conditionSummary}</p>
          <p className="text-xs text-slate-400 mt-2">Status: {CONDITION_LABELS[status.conditionStatus]}</p>
        </div>
      )}

      {/* Vitals Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <VitalCard label="Blood Pressure" value={status.bloodPressure} unit="" />
        <VitalCard label="Heart Rate" value={status.heartRate?.toString()} unit="bpm" />
        <VitalCard label="Temperature" value={status.temperature?.toString()} unit="°C" />
        <VitalCard label="Weight" value={status.weight?.toString()} unit="kg" />
        <VitalCard label="Pain Level" value={status.painLevel?.toString()} unit="/10" />
        <VitalCard label="Mobility Score" value={status.mobilityScore?.toString()} unit="/10" />
      </div>

      {/* Voice & Text Nav from entity */}
      {status.voiceSummary && (
        <div className="rounded-xl p-6 border mb-6" style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--border)" }}>
          <h2 className="text-lg font-semibold mb-3">🔊 Voice Summary</h2>
          <VoiceBanner narration={status.voiceSummary} />
        </div>
      )}

      {status.textNavigationInstructions && (
        <div className="rounded-xl p-6 border mb-6" style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--border)" }}>
          <h2 className="text-lg font-semibold mb-3">📝 Text Navigation</h2>
          <p className="text-sm whitespace-pre-wrap">{status.textNavigationInstructions}</p>
        </div>
      )}

      {status.caregiverNotes && (
        <div className="rounded-xl p-6 border" style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--border)" }}>
          <h2 className="text-lg font-semibold mb-3">Caregiver Notes</h2>
          <p className="text-sm whitespace-pre-wrap">{status.caregiverNotes}</p>
        </div>
      )}
    </div>
  );
}

function VitalCard({ label, value, unit }: { label: string; value?: string | null; unit: string }) {
  return (
    <div className="rounded-xl p-4 border text-center" style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--border)" }}>
      <p className="text-xs text-slate-500 mb-1">{label}</p>
      <p className="text-xl font-bold">
        {value || "—"} <span className="text-xs font-normal text-slate-400">{value ? unit : ""}</span>
      </p>
    </div>
  );
}
