"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { patientApi, recordApi, statusApi } from "@/lib/api";
import {
  PatientDTO,
  MedicalRecordDTO,
  MedicalStatusDTO,
  DISABILITY_LABELS,
} from "@/lib/types";
import VoiceBanner from "@/components/VoiceBanner";
import TextNavigation from "@/components/TextNavigation";
import StatusBadge from "@/components/StatusBadge";

export default function PatientDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [patient, setPatient] = useState<PatientDTO | null>(null);
  const [records, setRecords] = useState<MedicalRecordDTO[]>([]);
  const [statuses, setStatuses] = useState<MedicalStatusDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    const pid = Number(id);
    Promise.all([
      patientApi.getById(pid),
      recordApi.getByPatient(pid).catch(() => []),
      statusApi.getHistory(pid).catch(() => []),
    ])
      .then(([p, r, s]) => {
        setPatient(p);
        setRecords(r);
        setStatuses(s);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64" role="status">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (error || !patient) {
    return (
      <div className="text-center py-16">
        <p className="text-red-600 text-lg">{error || "Patient not found"}</p>
        <Link href="/patients" className="text-blue-600 hover:underline mt-4 inline-block">
          ← Back to Patients
        </Link>
      </div>
    );
  }

  const latestStatus = statuses[0];

  return (
    <div>
      {/* Accessibility banners */}
      {patient.accessibilityMode === "VOICE_ASSISTANCE" && (
        <VoiceBanner
          narration={`You are viewing the profile of ${patient.firstName} ${patient.lastName}. Disability type: ${DISABILITY_LABELS[patient.disabilityType]}. ${records.length} medical records on file. ${latestStatus ? `Latest status: ${latestStatus.conditionStatus}.` : "No status updates yet."}`}
          rate={patient.voiceSpeechRate || 1.0}
        />
      )}
      {patient.accessibilityMode === "TEXT_NAVIGATION" && (
        <TextNavigation
          steps={[
            `This page shows the full profile of ${patient.firstName} ${patient.lastName}.`,
            `Their disability type is ${DISABILITY_LABELS[patient.disabilityType]}.`,
            `Scroll down to see their medical records and health status history.`,
            `Use the 'Edit' button to modify patient details.`,
            `Use the tabs at the bottom to switch between Records and Status.`,
          ]}
        />
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <Link href="/patients" className="text-sm text-blue-600 hover:underline">
            ← Back to Patients
          </Link>
          <h1 className="text-3xl font-bold mt-2">
            {patient.firstName} {patient.lastName}
          </h1>
          <div className="flex items-center gap-3 mt-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
              {DISABILITY_LABELS[patient.disabilityType]}
            </span>
            <span className="text-xs text-slate-500">
              {patient.accessibilityMode === "VOICE_ASSISTANCE" && "🔊 Voice Assistance"}
              {patient.accessibilityMode === "TEXT_NAVIGATION" && "📝 Text Navigation"}
              {patient.accessibilityMode === "STANDARD" && "Standard Mode"}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <Link
            href={`/patients/${id}/edit`}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
          >
            Edit
          </Link>
          <button
            onClick={async () => {
              if (confirm("Delete this patient?")) {
                await patientApi.delete(Number(id));
                router.push("/patients");
              }
            }}
            className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>

      {/* Patient Info Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Personal Info */}
        <div className="rounded-xl p-6 border" style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--border)" }}>
          <h2 className="text-lg font-semibold mb-4">Personal Information</h2>
          <dl className="space-y-3 text-sm">
            <InfoRow label="Date of Birth" value={patient.dateOfBirth} />
            <InfoRow label="Gender" value={patient.gender} />
            <InfoRow label="Email" value={patient.email} />
            <InfoRow label="Phone" value={patient.phoneNumber} />
            <InfoRow label="Address" value={[patient.address, patient.city, patient.state, patient.pinCode].filter(Boolean).join(", ")} />
          </dl>
        </div>

        {/* Disability & Emergency */}
        <div className="rounded-xl p-6 border" style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--border)" }}>
          <h2 className="text-lg font-semibold mb-4">Disability & Emergency</h2>
          <dl className="space-y-3 text-sm">
            <InfoRow label="Disability" value={DISABILITY_LABELS[patient.disabilityType]} />
            <InfoRow label="Details" value={patient.disabilityDetails} />
            <InfoRow label="Percentage" value={patient.disabilityPercentage ? `${patient.disabilityPercentage}%` : undefined} />
            <InfoRow label="Certificate #" value={patient.disabilityCertificateNumber} />
            <InfoRow label="Emergency Contact" value={patient.emergencyContactName} />
            <InfoRow label="Emergency Phone" value={patient.emergencyContactPhone} />
          </dl>
        </div>
      </div>

      {/* Medical Records */}
      <div className="rounded-xl p-6 border mb-6" style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--border)" }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Medical Records ({records.length})</h2>
          <Link
            href={`/records/new?patientId=${id}`}
            className="text-sm text-blue-600 hover:underline font-medium"
          >
            + Add Record
          </Link>
        </div>
        {records.length === 0 ? (
          <p className="text-slate-500 text-sm text-center py-6">No medical records yet.</p>
        ) : (
          <div className="space-y-3">
            {records.slice(0, 5).map((r) => (
              <Link
                key={r.id}
                href={`/records/${r.id}`}
                className="flex items-center justify-between p-4 rounded-lg border hover:shadow-sm transition-shadow"
                style={{ borderColor: "var(--border)" }}
              >
                <div>
                  <p className="font-medium text-sm">{r.title}</p>
                  <p className="text-xs text-slate-500 mt-1">
                    {r.recordType} · {r.recordDate} {r.doctorName && `· Dr. ${r.doctorName}`}
                  </p>
                </div>
                <span className="text-xs text-slate-400">→</span>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Medical Status History */}
      <div className="rounded-xl p-6 border" style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--border)" }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Status History ({statuses.length})</h2>
          <Link
            href={`/status/new?patientId=${id}`}
            className="text-sm text-blue-600 hover:underline font-medium"
          >
            + Add Status
          </Link>
        </div>
        {statuses.length === 0 ? (
          <p className="text-slate-500 text-sm text-center py-6">No status entries yet.</p>
        ) : (
          <div className="space-y-3">
            {statuses.slice(0, 5).map((s) => (
              <Link
                key={s.id}
                href={`/status/${s.id}`}
                className="flex items-center justify-between p-4 rounded-lg border hover:shadow-sm transition-shadow"
                style={{ borderColor: "var(--border)" }}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={s.conditionStatus} />
                    <span className="text-xs text-slate-500">{s.statusDate}</span>
                  </div>
                  {s.conditionSummary && (
                    <p className="text-xs text-slate-600 mt-1 line-clamp-1">{s.conditionSummary}</p>
                  )}
                </div>
                <span className="text-xs text-slate-400">→</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="flex justify-between">
      <dt className="text-slate-500">{label}</dt>
      <dd className="font-medium text-right">{value || "—"}</dd>
    </div>
  );
}
