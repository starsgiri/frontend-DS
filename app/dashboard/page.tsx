"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { patientApi } from "@/lib/api";
import { PatientDTO, DISABILITY_LABELS, DisabilityType } from "@/lib/types";

export default function DashboardPage() {
  const [patients, setPatients] = useState<PatientDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    patientApi
      .getAll()
      .then(setPatients)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const disabilityCounts = patients.reduce<Record<string, number>>((acc, p) => {
    acc[p.disabilityType] = (acc[p.disabilityType] || 0) + 1;
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64" role="status">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
        <span className="sr-only">Loading dashboard...</span>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-slate-500 mt-1">
          Overview of all registered patients and their accessibility needs
        </p>
      </div>

      {error && (
        <div className="p-4 mb-6 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm" role="alert">
          {error}
        </div>
      )}

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard icon="👥" label="Total Patients" value={patients.length} color="blue" />
        <StatCard
          icon="👁️"
          label="Blind (Voice Assist)"
          value={disabilityCounts["BLIND"] || 0}
          color="purple"
        />
        <StatCard
          icon="🤟"
          label="Deaf / Mute"
          value={
            (disabilityCounts["DEAF"] || 0) +
            (disabilityCounts["MUTE"] || 0) +
            (disabilityCounts["DEAF_MUTE"] || 0)
          }
          color="green"
        />
        <StatCard
          icon="🧬"
          label="Genetic Conditions"
          value={disabilityCounts["GENETIC_DISEASE"] || 0}
          color="orange"
        />
      </div>

      {/* Disability breakdown */}
      <div
        className="rounded-xl p-6 mb-8 border"
        style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--border)" }}
      >
        <h2 className="text-lg font-semibold mb-4">Patients by Disability Type</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {(Object.keys(DISABILITY_LABELS) as DisabilityType[]).map((type) => (
            <Link
              key={type}
              href={`/patients?filter=${type}`}
              className="p-4 rounded-lg border hover:shadow-md transition-shadow text-center"
              style={{ borderColor: "var(--border)" }}
            >
              <p className="text-2xl font-bold text-blue-600">
                {disabilityCounts[type] || 0}
              </p>
              <p className="text-xs text-slate-500 mt-1">{DISABILITY_LABELS[type]}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent patients table */}
      <div
        className="rounded-xl p-6 border"
        style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--border)" }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Recent Patients</h2>
          <Link href="/patients" className="text-sm text-blue-600 hover:underline font-medium">
            View All →
          </Link>
        </div>
        {patients.length === 0 ? (
          <p className="text-slate-500 text-sm py-8 text-center">
            No patients registered yet.{" "}
            <Link href="/patients/new" className="text-blue-600 hover:underline">
              Register a patient
            </Link>
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm" aria-label="Recent patients">
              <thead>
                <tr className="border-b" style={{ borderColor: "var(--border)" }}>
                  <th className="text-left py-3 px-2 font-medium text-slate-500">Name</th>
                  <th className="text-left py-3 px-2 font-medium text-slate-500">Disability</th>
                  <th className="text-left py-3 px-2 font-medium text-slate-500">Mode</th>
                  <th className="text-left py-3 px-2 font-medium text-slate-500">City</th>
                  <th className="text-right py-3 px-2 font-medium text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {patients.slice(0, 5).map((p) => (
                  <tr
                    key={p.id}
                    className="border-b hover:bg-slate-50 transition-colors"
                    style={{ borderColor: "var(--border)" }}
                  >
                    <td className="py-3 px-2 font-medium">
                      {p.firstName} {p.lastName}
                    </td>
                    <td className="py-3 px-2">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                        {DISABILITY_LABELS[p.disabilityType]}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-xs">
                      {p.accessibilityMode === "VOICE_ASSISTANCE" && "🔊 Voice"}
                      {p.accessibilityMode === "TEXT_NAVIGATION" && "📝 Text Nav"}
                      {p.accessibilityMode === "STANDARD" && "Standard"}
                    </td>
                    <td className="py-3 px-2 text-slate-500">{p.city || "—"}</td>
                    <td className="py-3 px-2 text-right">
                      <Link
                        href={`/patients/${p.id}`}
                        className="text-blue-600 hover:underline text-xs font-medium"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  icon, label, value, color,
}: {
  icon: string; label: string; value: number; color: string;
}) {
  const bg: Record<string, string> = {
    blue: "bg-blue-50 border-blue-200",
    purple: "bg-purple-50 border-purple-200",
    green: "bg-green-50 border-green-200",
    orange: "bg-orange-50 border-orange-200",
  };
  const text: Record<string, string> = {
    blue: "text-blue-600",
    purple: "text-purple-600",
    green: "text-green-600",
    orange: "text-orange-600",
  };

  return (
    <div className={`rounded-xl p-5 border ${bg[color]}`}>
      <div className="flex items-center justify-between">
        <span className="text-2xl" aria-hidden="true">{icon}</span>
        <span className={`text-3xl font-bold ${text[color]}`}>{value}</span>
      </div>
      <p className="text-sm text-slate-600 mt-2 font-medium">{label}</p>
    </div>
  );
}
