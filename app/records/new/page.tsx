"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { recordApi, patientApi } from "@/lib/api";
import { MedicalRecordDTO, PatientDTO } from "@/lib/types";

export default function NewRecordPageWrapper() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-40"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" /></div>}>
      <NewRecordPage />
    </Suspense>
  );
}

function NewRecordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const presetPatient = searchParams.get("patientId");

  const [patients, setPatients] = useState<PatientDTO[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState<MedicalRecordDTO>({
    patientId: presetPatient ? Number(presetPatient) : 0,
    title: "",
    recordType: "CONSULTATION",
    recordDate: new Date().toISOString().split("T")[0],
    doctorName: "",
    hospitalName: "",
    diagnosis: "",
    prescriptions: "",
    treatmentPlan: "",
    labResults: "",
    notes: "",
  });

  useEffect(() => {
    patientApi.getAll().then(setPatients).catch(() => {});
  }, []);

  function set(field: keyof MedicalRecordDTO, value: unknown) {
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
      const created = await recordApi.create(form);
      router.push(`/records/${created.id}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to create record");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <Link href="/records" className="text-sm text-blue-600 hover:underline">← Back to Records</Link>
      <h1 className="text-3xl font-bold mt-2 mb-6">New Medical Record</h1>

      {error && (
        <div className="p-4 mb-6 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <fieldset className="rounded-xl p-6 border" style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--border)" }}>
          <legend className="text-lg font-semibold px-2">Record Details</legend>
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
              <span className="text-sm font-medium text-slate-700">Record Type *</span>
              <select
                value={form.recordType}
                onChange={(e) => set("recordType", e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border rounded-lg text-sm"
                style={{ borderColor: "var(--border)" }}
              >
                {["CONSULTATION", "LAB_RESULT", "PRESCRIPTION", "SURGERY", "IMAGING", "THERAPY", "VACCINATION", "FOLLOW_UP", "EMERGENCY", "OTHER"].map(
                  (t) => <option key={t} value={t}>{t.replace(/_/g, " ")}</option>
                )}
              </select>
            </label>
            <Field label="Title *" value={form.title} onChange={(v) => set("title", v)} required />
            <Field label="Record Date *" type="date" value={form.recordDate} onChange={(v) => set("recordDate", v)} required />
            <Field label="Doctor Name" value={form.doctorName || ""} onChange={(v) => set("doctorName", v)} />
            <Field label="Hospital" value={form.hospitalName || ""} onChange={(v) => set("hospitalName", v)} />
          </div>
        </fieldset>

        <fieldset className="rounded-xl p-6 border" style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--border)" }}>
          <legend className="text-lg font-semibold px-2">Medical Details</legend>
          <div className="grid grid-cols-1 gap-4 mt-4">
            <TextArea label="Diagnosis" value={form.diagnosis || ""} onChange={(v) => set("diagnosis", v)} />
            <TextArea label="Treatment Plan" value={form.treatmentPlan || ""} onChange={(v) => set("treatmentPlan", v)} />
            <TextArea label="Prescriptions" value={form.prescriptions || ""} onChange={(v) => set("prescriptions", v)} />
            <TextArea label="Lab Results" value={form.labResults || ""} onChange={(v) => set("labResults", v)} />
            <TextArea label="Notes" value={form.notes || ""} onChange={(v) => set("notes", v)} />
          </div>
        </fieldset>

        <div className="flex justify-end gap-3">
          <Link href="/records" className="px-6 py-2.5 border rounded-lg text-sm hover:bg-slate-50" style={{ borderColor: "var(--border)" }}>
            Cancel
          </Link>
          <button type="submit" disabled={saving}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50">
            {saving ? "Creating..." : "Create Record"}
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, type = "text", value, onChange, required }: {
  label: string; type?: string; value: string; onChange: (v: string) => void; required?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} required={required}
        className="mt-1 block w-full px-3 py-2 border rounded-lg text-sm" style={{ borderColor: "var(--border)" }} />
    </label>
  );
}

function TextArea({ label, value, onChange }: {
  label: string; value: string; onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3}
        className="mt-1 block w-full px-3 py-2 border rounded-lg text-sm resize-y" style={{ borderColor: "var(--border)" }} />
    </label>
  );
}
