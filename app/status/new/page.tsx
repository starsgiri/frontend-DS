"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { statusApi, patientApi } from "@/lib/api";
import {
  MedicalStatusDTO,
  PatientDTO,
  MedicalConditionStatus,
  CONDITION_LABELS,
} from "@/lib/types";

export default function NewStatusPageWrapper() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-40"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" /></div>}>
      <NewStatusPage />
    </Suspense>
  );
}

function NewStatusPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const presetPatient = searchParams.get("patientId");

  const [patients, setPatients] = useState<PatientDTO[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState<MedicalStatusDTO>({
    patientId: presetPatient ? Number(presetPatient) : 0,
    conditionStatus: "STABLE",
    conditionSummary: "",
    statusDate: new Date().toISOString().split("T")[0],
    bloodPressure: "",
    heartRate: undefined,
    temperature: undefined,
    weight: undefined,
    painLevel: undefined,
    mobilityScore: undefined,
    caregiverNotes: "",
  });

  useEffect(() => {
    patientApi.getAll().then(setPatients).catch(() => {});
  }, []);

  function set(field: keyof MedicalStatusDTO, value: unknown) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.patientId) {
      setError("Please select a patient");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const created = await statusApi.create(form);
      router.push(`/status/${created.id}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to create status entry");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <Link href="/status" className="text-sm text-blue-600 hover:underline">← Back to Status Tracking</Link>
      <h1 className="text-3xl font-bold mt-2 mb-6">New Status Entry</h1>

      {error && (
        <div className="p-4 mb-6 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Patient & Condition */}
        <fieldset className="rounded-xl p-6 border" style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--border)" }}>
          <legend className="text-lg font-semibold px-2">Condition</legend>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Patient *</span>
              <select
                value={form.patientId || ""}
                onChange={(e) => set("patientId", Number(e.target.value))}
                required
                className="mt-1 block w-full px-3 py-2 border rounded-lg text-sm"
                style={{ borderColor: "var(--border)" }}
              >
                <option value="">Select patient...</option>
                {patients.map((p) => (
                  <option key={p.id} value={p.id!}>
                    {p.firstName} {p.lastName}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Condition Status *</span>
              <select
                value={form.conditionStatus}
                onChange={(e) => set("conditionStatus", e.target.value as MedicalConditionStatus)}
                required
                className="mt-1 block w-full px-3 py-2 border rounded-lg text-sm"
                style={{ borderColor: "var(--border)" }}
              >
                {(Object.keys(CONDITION_LABELS) as MedicalConditionStatus[]).map((s) => (
                  <option key={s} value={s}>{CONDITION_LABELS[s]}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Status Date *</span>
              <input
                type="date"
                value={form.statusDate}
                onChange={(e) => set("statusDate", e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border rounded-lg text-sm"
                style={{ borderColor: "var(--border)" }}
              />
            </label>
          </div>
          <label className="block mt-4">
            <span className="text-sm font-medium text-slate-700">Condition Summary</span>
            <textarea
              value={form.conditionSummary || ""}
              onChange={(e) => set("conditionSummary", e.target.value)}
              rows={3}
              className="mt-1 block w-full px-3 py-2 border rounded-lg text-sm resize-y"
              style={{ borderColor: "var(--border)" }}
            />
          </label>
        </fieldset>

        {/* Vitals */}
        <fieldset className="rounded-xl p-6 border" style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--border)" }}>
          <legend className="text-lg font-semibold px-2">Vitals</legend>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Blood Pressure</span>
              <input
                type="text"
                placeholder="120/80"
                value={form.bloodPressure || ""}
                onChange={(e) => set("bloodPressure", e.target.value)}
                className="mt-1 block w-full px-3 py-2 border rounded-lg text-sm"
                style={{ borderColor: "var(--border)" }}
              />
            </label>
            <NumField label="Heart Rate (bpm)" value={form.heartRate} onChange={(v) => set("heartRate", v)} />
            <NumField label="Temperature (°C)" value={form.temperature} onChange={(v) => set("temperature", v)} />
            <NumField label="Weight (kg)" value={form.weight} onChange={(v) => set("weight", v)} />
            <NumField label="Pain Level (0-10)" value={form.painLevel} onChange={(v) => set("painLevel", v)} />
            <NumField label="Mobility Score (0-10)" value={form.mobilityScore} onChange={(v) => set("mobilityScore", v)} />
          </div>
        </fieldset>

        {/* Notes */}
        <fieldset className="rounded-xl p-6 border" style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--border)" }}>
          <legend className="text-lg font-semibold px-2">Notes</legend>
          <label className="block mt-4">
            <textarea
              value={form.caregiverNotes || ""}
              onChange={(e) => set("caregiverNotes", e.target.value)}
              rows={4}
              placeholder="Additional observations..."
              className="block w-full px-3 py-2 border rounded-lg text-sm resize-y"
              style={{ borderColor: "var(--border)" }}
            />
          </label>
        </fieldset>

        <div className="flex justify-end gap-3">
          <Link href="/status" className="px-6 py-2.5 border rounded-lg text-sm hover:bg-slate-50" style={{ borderColor: "var(--border)" }}>
            Cancel
          </Link>
          <button type="submit" disabled={saving}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50">
            {saving ? "Creating..." : "Create Status Entry"}
          </button>
        </div>
      </form>
    </div>
  );
}

function NumField({ label, value, onChange }: {
  label: string; value?: number; onChange: (v: number | undefined) => void;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <input
        type="number"
        step="any"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value ? Number(e.target.value) : undefined)}
        className="mt-1 block w-full px-3 py-2 border rounded-lg text-sm"
        style={{ borderColor: "var(--border)" }}
      />
    </label>
  );
}
