"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { patientApi } from "@/lib/api";
import {
  PatientDTO,
  DisabilityType,
  AccessibilityMode,
  DISABILITY_LABELS,
} from "@/lib/types";

export default function EditPatientPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [form, setForm] = useState<PatientDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    patientApi
      .getById(Number(id))
      .then(setForm)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  function set(field: keyof PatientDTO, value: unknown) {
    setForm((prev) => (prev ? { ...prev, [field]: value } : prev));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form) return;
    setSaving(true);
    setError("");
    try {
      await patientApi.update(Number(id), form);
      router.push(`/patients/${id}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64" role="status">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!form) {
    return (
      <div className="text-center py-16 text-red-600">
        {error || "Patient not found"}
        <br />
        <Link href="/patients" className="text-blue-600 hover:underline mt-4 inline-block">← Back</Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <Link href={`/patients/${id}`} className="text-sm text-blue-600 hover:underline">
        ← Back to Patient
      </Link>
      <h1 className="text-3xl font-bold mt-2 mb-6">
        Edit — {form.firstName} {form.lastName}
      </h1>

      {error && (
        <div className="p-4 mb-6 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm" role="alert">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <fieldset className="rounded-xl p-6 border" style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--border)" }}>
          <legend className="text-lg font-semibold px-2">Personal Information</legend>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <Field label="First Name *" value={form.firstName} onChange={(v) => set("firstName", v)} required />
            <Field label="Last Name *" value={form.lastName} onChange={(v) => set("lastName", v)} required />
            <Field label="Date of Birth *" type="date" value={form.dateOfBirth} onChange={(v) => set("dateOfBirth", v)} required />
            <SelectField label="Gender *" value={form.gender} onChange={(v) => set("gender", v)}
              options={[{ value: "Male", label: "Male" }, { value: "Female", label: "Female" }, { value: "Other", label: "Other" }]} required />
            <Field label="Email *" type="email" value={form.email} onChange={(v) => set("email", v)} required />
            <Field label="Phone" value={form.phoneNumber || ""} onChange={(v) => set("phoneNumber", v)} />
            <Field label="Address" value={form.address || ""} onChange={(v) => set("address", v)} />
            <Field label="City" value={form.city || ""} onChange={(v) => set("city", v)} />
            <Field label="State" value={form.state || ""} onChange={(v) => set("state", v)} />
            <Field label="PIN Code" value={form.pinCode || ""} onChange={(v) => set("pinCode", v)} />
          </div>
        </fieldset>

        <fieldset className="rounded-xl p-6 border" style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--border)" }}>
          <legend className="text-lg font-semibold px-2">Disability Information</legend>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <SelectField label="Disability Type *" value={form.disabilityType}
              onChange={(v) => set("disabilityType", v as DisabilityType)}
              options={(Object.keys(DISABILITY_LABELS) as DisabilityType[]).map((t) => ({ value: t, label: DISABILITY_LABELS[t] }))}
              required />
            <Field label="Disability %" type="number"
              value={form.disabilityPercentage?.toString() || ""}
              onChange={(v) => set("disabilityPercentage", v ? Number(v) : undefined)} />
            <Field label="Details" value={form.disabilityDetails || ""} onChange={(v) => set("disabilityDetails", v)} />
            <Field label="Certificate Number" value={form.disabilityCertificateNumber || ""} onChange={(v) => set("disabilityCertificateNumber", v)} />
          </div>
        </fieldset>

        <fieldset className="rounded-xl p-6 border" style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--border)" }}>
          <legend className="text-lg font-semibold px-2">Accessibility Preferences</legend>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <SelectField label="Mode" value={form.accessibilityMode || "STANDARD"}
              onChange={(v) => set("accessibilityMode", v as AccessibilityMode)}
              options={[
                { value: "STANDARD", label: "Standard" },
                { value: "VOICE_ASSISTANCE", label: "🔊 Voice Assistance" },
                { value: "TEXT_NAVIGATION", label: "📝 Text Navigation" },
              ]} />
            <Field label="Voice Speed" type="number" value={form.voiceSpeechRate?.toString() || "1.0"}
              onChange={(v) => set("voiceSpeechRate", Number(v))} />
          </div>
        </fieldset>

        <div className="flex justify-end gap-3">
          <Link href={`/patients/${id}`} className="px-6 py-2.5 border rounded-lg text-sm hover:bg-slate-50" style={{ borderColor: "var(--border)" }}>
            Cancel
          </Link>
          <button type="submit" disabled={saving}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50">
            {saving ? "Saving..." : "Save Changes"}
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

function SelectField({ label, value, onChange, options, required }: {
  label: string; value: string; onChange: (v: string) => void;
  options: { value: string; label: string }[]; required?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} required={required}
        className="mt-1 block w-full px-3 py-2 border rounded-lg text-sm" style={{ borderColor: "var(--border)" }}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </label>
  );
}
