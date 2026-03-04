"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { patientApi } from "@/lib/api";
import {
  PatientDTO,
  DisabilityType,
  AccessibilityMode,
  DISABILITY_LABELS,
} from "@/lib/types";

const EMPTY_PATIENT: PatientDTO = {
  firstName: "",
  lastName: "",
  dateOfBirth: "",
  gender: "",
  email: "",
  phoneNumber: "",
  address: "",
  city: "",
  state: "",
  pinCode: "",
  emergencyContactName: "",
  emergencyContactPhone: "",
  disabilityType: "BLIND",
  disabilityDetails: "",
  disabilityPercentage: undefined,
  disabilityCertificateNumber: "",
  accessibilityMode: "STANDARD",
  preferredLanguage: "en",
  voiceSpeechRate: 1.0,
  vibrationFeedbackEnabled: false,
  visualAlertsEnabled: false,
  highContrastMode: false,
  fontSizeMultiplier: 1.0,
};

export default function NewPatientPage() {
  const router = useRouter();
  const [form, setForm] = useState<PatientDTO>(EMPTY_PATIENT);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function set(field: keyof PatientDTO, value: unknown) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const created = await patientApi.create(form);
      router.push(`/patients/${created.id}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to register patient");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <Link href="/patients" className="text-sm text-blue-600 hover:underline">
        ← Back to Patients
      </Link>
      <h1 className="text-3xl font-bold mt-2 mb-6">Register New Patient</h1>

      {error && (
        <div className="p-4 mb-6 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm" role="alert">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Personal Information */}
        <fieldset
          className="rounded-xl p-6 border"
          style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--border)" }}
        >
          <legend className="text-lg font-semibold px-2">Personal Information</legend>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <Field label="First Name *" value={form.firstName} onChange={(v) => set("firstName", v)} required />
            <Field label="Last Name *" value={form.lastName} onChange={(v) => set("lastName", v)} required />
            <Field label="Date of Birth *" type="date" value={form.dateOfBirth} onChange={(v) => set("dateOfBirth", v)} required />
            <SelectField
              label="Gender *"
              value={form.gender}
              onChange={(v) => set("gender", v)}
              options={[
                { value: "", label: "Select..." },
                { value: "Male", label: "Male" },
                { value: "Female", label: "Female" },
                { value: "Other", label: "Other" },
              ]}
              required
            />
            <Field label="Email *" type="email" value={form.email} onChange={(v) => set("email", v)} required />
            <Field label="Phone" value={form.phoneNumber || ""} onChange={(v) => set("phoneNumber", v)} />
            <Field label="Address" value={form.address || ""} onChange={(v) => set("address", v)} fullWidth />
            <Field label="City" value={form.city || ""} onChange={(v) => set("city", v)} />
            <Field label="State" value={form.state || ""} onChange={(v) => set("state", v)} />
            <Field label="PIN Code" value={form.pinCode || ""} onChange={(v) => set("pinCode", v)} />
          </div>
        </fieldset>

        {/* Emergency Contact */}
        <fieldset
          className="rounded-xl p-6 border"
          style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--border)" }}
        >
          <legend className="text-lg font-semibold px-2">Emergency Contact</legend>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <Field label="Contact Name" value={form.emergencyContactName || ""} onChange={(v) => set("emergencyContactName", v)} />
            <Field label="Contact Phone" value={form.emergencyContactPhone || ""} onChange={(v) => set("emergencyContactPhone", v)} />
          </div>
        </fieldset>

        {/* Disability Information */}
        <fieldset
          className="rounded-xl p-6 border"
          style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--border)" }}
        >
          <legend className="text-lg font-semibold px-2">Disability Information</legend>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <SelectField
              label="Disability Type *"
              value={form.disabilityType}
              onChange={(v) => set("disabilityType", v as DisabilityType)}
              options={(Object.keys(DISABILITY_LABELS) as DisabilityType[]).map((t) => ({
                value: t,
                label: DISABILITY_LABELS[t],
              }))}
              required
            />
            <Field
              label="Disability %"
              type="number"
              value={form.disabilityPercentage?.toString() || ""}
              onChange={(v) => set("disabilityPercentage", v ? Number(v) : undefined)}
            />
            <Field
              label="Details"
              value={form.disabilityDetails || ""}
              onChange={(v) => set("disabilityDetails", v)}
              fullWidth
            />
            <Field
              label="Certificate Number"
              value={form.disabilityCertificateNumber || ""}
              onChange={(v) => set("disabilityCertificateNumber", v)}
            />
          </div>
        </fieldset>

        {/* Accessibility Preferences */}
        <fieldset
          className="rounded-xl p-6 border"
          style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--border)" }}
        >
          <legend className="text-lg font-semibold px-2">Accessibility Preferences</legend>
          <p className="text-xs text-slate-500 mt-1 mb-4">
            These are auto-set based on disability type but you can override them.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SelectField
              label="Accessibility Mode"
              value={form.accessibilityMode || "STANDARD"}
              onChange={(v) => set("accessibilityMode", v as AccessibilityMode)}
              options={[
                { value: "STANDARD", label: "Standard" },
                { value: "VOICE_ASSISTANCE", label: "🔊 Voice Assistance (Blind)" },
                { value: "TEXT_NAVIGATION", label: "📝 Text Navigation (Deaf/Mute)" },
              ]}
            />
            <Field
              label="Voice Speed"
              type="number"
              value={form.voiceSpeechRate?.toString() || "1.0"}
              onChange={(v) => set("voiceSpeechRate", Number(v))}
            />
          </div>
        </fieldset>

        {/* Submit */}
        <div className="flex justify-end gap-3">
          <Link
            href="/patients"
            className="px-6 py-2.5 border rounded-lg text-sm hover:bg-slate-50"
            style={{ borderColor: "var(--border)" }}
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? "Registering..." : "Register Patient"}
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({
  label, type = "text", value, onChange, required, fullWidth,
}: {
  label: string; type?: string; value: string; onChange: (v: string) => void; required?: boolean; fullWidth?: boolean;
}) {
  return (
    <label className={`block ${fullWidth ? "md:col-span-2" : ""}`}>
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="mt-1 block w-full px-3 py-2 border rounded-lg text-sm"
        style={{ borderColor: "var(--border)" }}
      />
    </label>
  );
}

function SelectField({
  label, value, onChange, options, required,
}: {
  label: string; value: string; onChange: (v: string) => void;
  options: { value: string; label: string }[]; required?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="mt-1 block w-full px-3 py-2 border rounded-lg text-sm"
        style={{ borderColor: "var(--border)" }}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
