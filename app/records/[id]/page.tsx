"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { recordApi, accessibilityApi } from "@/lib/api";
import { MedicalRecordDTO, AccessibilityResponse } from "@/lib/types";
import VoiceBanner from "@/components/VoiceBanner";
import TextNavigation from "@/components/TextNavigation";

export default function RecordDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [record, setRecord] = useState<MedicalRecordDTO | null>(null);
  const [accessible, setAccessible] = useState<AccessibilityResponse<MedicalRecordDTO[]> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    recordApi
      .getById(Number(id))
      .then((r) => {
        setRecord(r);
        // If record has a patient, load voice accessibility
        if (r.patientId) {
          accessibilityApi.voiceRecords(r.patientId).then(setAccessible).catch(() => {});
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

  if (error || !record) {
    return (
      <div className="text-center py-16 text-red-600">
        {error || "Record not found"}
        <br />
        <Link href="/records" className="text-blue-600 hover:underline mt-4 inline-block">← Back to Records</Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Accessible content */}
      {accessible?.voiceNarration && (
        <VoiceBanner narration={accessible.voiceNarration} />
      )}
      {accessible?.navigationSteps && accessible.navigationSteps.length > 0 && (
        <TextNavigation steps={accessible.navigationSteps} />
      )}

      <Link href="/records" className="text-sm text-blue-600 hover:underline">← Back to Records</Link>
      <h1 className="text-3xl font-bold mt-2 mb-1">{record.title}</h1>
      <p className="text-sm text-slate-500 mb-6">
        {record.recordType} · {record.recordDate}
        {record.doctorName && ` · Dr. ${record.doctorName}`}
        {record.hospitalName && ` · ${record.hospitalName}`}
      </p>

      <div className="space-y-6">
        {/* Diagnosis & Treatment Plan */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {record.diagnosis && <Card title="Diagnosis"><p className="text-sm">{record.diagnosis}</p></Card>}
          {record.treatmentPlan && <Card title="Treatment Plan"><p className="text-sm">{record.treatmentPlan}</p></Card>}
        </div>

        {/* Prescriptions & Lab Results */}
        {record.prescriptions && <Card title="Prescriptions"><p className="text-sm">{record.prescriptions}</p></Card>}
        {record.labResults && <Card title="Lab Results"><p className="text-sm">{record.labResults}</p></Card>}

        {/* Notes */}
        {record.notes && <Card title="Notes"><p className="text-sm whitespace-pre-wrap">{record.notes}</p></Card>}

        {/* Voice Summary (from entity) */}
        {record.voiceSummary && (
          <Card title="🔊 Voice Summary">
            <VoiceBanner narration={record.voiceSummary} />
          </Card>
        )}

        {/* Text Navigation Instructions (from entity) */}
        {record.textNavigationInstructions && (
          <Card title="📝 Text Navigation Instructions">
            <p className="text-sm whitespace-pre-wrap">{record.textNavigationInstructions}</p>
          </Card>
        )}
      </div>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl p-6 border" style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--border)" }}>
      <h2 className="text-lg font-semibold mb-3">{title}</h2>
      {children}
    </div>
  );
}
