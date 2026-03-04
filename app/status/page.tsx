"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { statusApi, patientApi } from "@/lib/api";
import { MedicalStatusDTO, PatientDTO } from "@/lib/types";
import StatusBadge from "@/components/StatusBadge";

export default function StatusListPage() {
  const [statuses, setStatuses] = useState<MedicalStatusDTO[]>([]);
  const [patients, setPatients] = useState<PatientDTO[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<number | "">("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    patientApi.getAll().then(setPatients).catch(() => {});
  }, []);

  useEffect(() => {
    if (!selectedPatient) {
      setStatuses([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    statusApi
      .getHistory(Number(selectedPatient))
      .then(setStatuses)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [selectedPatient]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Status Tracking</h1>
          <p className="text-slate-500 mt-1">Monitor patient health status over time</p>
        </div>
        <Link
          href="/status/new"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
        >
          + Add Status Entry
        </Link>
      </div>

      {/* Filter */}
      <div className="mb-6 p-4 rounded-xl border" style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--border)" }}>
        <label className="text-sm font-medium text-slate-600 mr-3">Filter by Patient:</label>
        <select
          value={selectedPatient}
          onChange={(e) => setSelectedPatient(e.target.value ? Number(e.target.value) : "")}
          className="px-3 py-2 border rounded-lg text-sm"
          style={{ borderColor: "var(--border)" }}
          aria-label="Filter status by patient"
        >
          <option value="">All Patients</option>
          {patients.map((p) => (
            <option key={p.id} value={p.id!}>
              {p.firstName} {p.lastName}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div className="p-4 mb-6 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>
      )}

      {!selectedPatient ? (
        <div className="text-center py-16 text-slate-500">
          <p className="text-lg">Select a patient to view their status history</p>
        </div>
      ) : loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
        </div>
      ) : statuses.length === 0 ? (
        <div className="text-center py-16 text-slate-500">
          <p className="text-lg">No status entries found for this patient</p>
        </div>
      ) : (
        <div className="space-y-3">
          {statuses.map((s) => (
            <Link
              key={s.id}
              href={`/status/${s.id}`}
              className="flex items-center justify-between p-5 rounded-xl border hover:shadow-sm transition-shadow"
              style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--border)" }}
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <StatusBadge status={s.conditionStatus} />
                  <span className="text-xs text-slate-500">{s.statusDate}</span>
                </div>
                {s.conditionSummary && (
                  <p className="text-sm text-slate-600 line-clamp-1">{s.conditionSummary}</p>
                )}
                <div className="flex gap-4 mt-2 text-xs text-slate-400">
                  {s.bloodPressure && <span>BP: {s.bloodPressure}</span>}
                  {s.heartRate && <span>HR: {s.heartRate} bpm</span>}
                  {s.temperature && <span>Temp: {s.temperature}°</span>}
                  {s.painLevel != null && <span>Pain: {s.painLevel}/10</span>}
                  {s.mobilityScore != null && <span>Mobility: {s.mobilityScore}/10</span>}
                </div>
              </div>
              <span className="text-slate-400 ml-4">→</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
