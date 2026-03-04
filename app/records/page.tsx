"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { recordApi, patientApi } from "@/lib/api";
import { MedicalRecordDTO, PatientDTO } from "@/lib/types";

export default function RecordsListPage() {
  const [records, setRecords] = useState<MedicalRecordDTO[]>([]);
  const [patients, setPatients] = useState<PatientDTO[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<number | "">("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    patientApi.getAll().then(setPatients).catch(() => {});
  }, []);

  useEffect(() => {
    if (!selectedPatient) {
      setRecords([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    recordApi
      .getByPatient(Number(selectedPatient))
      .then(setRecords)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [selectedPatient]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Medical Records</h1>
          <p className="text-slate-500 mt-1">Browse and manage medical records</p>
        </div>
        <Link
          href="/records/new"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
        >
          + Add Record
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
          aria-label="Filter records by patient"
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
          <p className="text-lg">Select a patient to view their medical records</p>
        </div>
      ) : loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
        </div>
      ) : records.length === 0 ? (
        <div className="text-center py-16 text-slate-500">
          <p className="text-lg">No records found for this patient</p>
        </div>
      ) : (
        <div className="space-y-3">
          {records.map((r) => (
            <Link
              key={r.id}
              href={`/records/${r.id}`}
              className="flex items-center justify-between p-5 rounded-xl border hover:shadow-sm transition-shadow"
              style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--border)" }}
            >
              <div className="flex-1">
                <p className="font-semibold">{r.title}</p>
                <p className="text-sm text-slate-500 mt-1">
                  {r.recordType} · {r.recordDate}
                  {r.doctorName && ` · Dr. ${r.doctorName}`}
                  {r.hospitalName && ` · ${r.hospitalName}`}
                </p>
                {r.diagnosis && (
                  <p className="text-xs text-slate-400 mt-2 line-clamp-2">{r.diagnosis}</p>
                )}
              </div>
              <span className="text-slate-400 ml-4">→</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
