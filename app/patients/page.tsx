"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { patientApi } from "@/lib/api";
import {
  PatientDTO,
  DISABILITY_LABELS,
  DisabilityType,
} from "@/lib/types";

export default function PatientsPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-40"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" /></div>}>
      <PatientsListContent />
    </Suspense>
  );
}

function PatientsListContent() {
  const searchParams = useSearchParams();
  const filterParam = searchParams.get("filter") as DisabilityType | null;

  const [patients, setPatients] = useState<PatientDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<DisabilityType | "">(filterParam || "");

  useEffect(() => {
    loadPatients();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  async function loadPatients() {
    setLoading(true);
    setError("");
    try {
      let data: PatientDTO[];
      if (filter) {
        data = await patientApi.getByDisability(filter);
      } else {
        data = await patientApi.getAll();
      }
      setPatients(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load patients");
    } finally {
      setLoading(false);
    }
  }

  async function handleSearch() {
    if (!search.trim()) {
      loadPatients();
      return;
    }
    setLoading(true);
    try {
      const data = await patientApi.search(search);
      setPatients(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Search failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Are you sure you want to delete this patient?")) return;
    try {
      await patientApi.delete(id);
      setPatients((prev) => prev.filter((p) => p.id !== id));
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Delete failed");
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Patients</h1>
          <p className="text-slate-500 mt-1">Manage registered patients</p>
        </div>
        <Link
          href="/patients/new"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          + Register Patient
        </Link>
      </div>

      {/* Search & Filter bar */}
      <div
        className="flex flex-col md:flex-row gap-3 mb-6 p-4 rounded-xl border"
        style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--border)" }}
      >
        <div className="flex flex-1 gap-2">
          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="flex-1 px-3 py-2 border rounded-lg text-sm"
            style={{ borderColor: "var(--border)" }}
            aria-label="Search patients by name"
          />
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm hover:bg-slate-700"
          >
            Search
          </button>
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as DisabilityType | "")}
          className="px-3 py-2 border rounded-lg text-sm"
          style={{ borderColor: "var(--border)" }}
          aria-label="Filter by disability type"
        >
          <option value="">All Disabilities</option>
          {(Object.keys(DISABILITY_LABELS) as DisabilityType[]).map((type) => (
            <option key={type} value={type}>
              {DISABILITY_LABELS[type]}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div className="p-4 mb-6 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm" role="alert">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-40" role="status">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
        </div>
      ) : patients.length === 0 ? (
        <div className="text-center py-16 text-slate-500">
          <p className="text-lg">No patients found</p>
          <Link href="/patients/new" className="text-blue-600 hover:underline text-sm mt-2 inline-block">
            Register the first patient →
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border" style={{ borderColor: "var(--border)" }}>
          <table className="w-full text-sm" aria-label="Patients list">
            <thead style={{ backgroundColor: "var(--card-bg)" }}>
              <tr className="border-b" style={{ borderColor: "var(--border)" }}>
                <th className="text-left py-3 px-4 font-medium text-slate-500">ID</th>
                <th className="text-left py-3 px-4 font-medium text-slate-500">Name</th>
                <th className="text-left py-3 px-4 font-medium text-slate-500">Disability</th>
                <th className="text-left py-3 px-4 font-medium text-slate-500">Mode</th>
                <th className="text-left py-3 px-4 font-medium text-slate-500">Email</th>
                <th className="text-left py-3 px-4 font-medium text-slate-500">City</th>
                <th className="text-right py-3 px-4 font-medium text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((p) => (
                <tr
                  key={p.id}
                  className="border-b hover:bg-slate-50 transition-colors"
                  style={{ borderColor: "var(--border)" }}
                >
                  <td className="py-3 px-4 text-slate-400">#{p.id}</td>
                  <td className="py-3 px-4 font-medium">
                    {p.firstName} {p.lastName}
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                      {DISABILITY_LABELS[p.disabilityType]}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-xs">
                    {p.accessibilityMode === "VOICE_ASSISTANCE" && "🔊 Voice"}
                    {p.accessibilityMode === "TEXT_NAVIGATION" && "📝 Text Nav"}
                    {p.accessibilityMode === "STANDARD" && "Standard"}
                  </td>
                  <td className="py-3 px-4 text-slate-500">{p.email}</td>
                  <td className="py-3 px-4 text-slate-500">{p.city || "—"}</td>
                  <td className="py-3 px-4 text-right space-x-3">
                    <Link href={`/patients/${p.id}`} className="text-blue-600 hover:underline text-xs">
                      View
                    </Link>
                    <Link href={`/patients/${p.id}/edit`} className="text-green-600 hover:underline text-xs">
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(p.id!)}
                      className="text-red-600 hover:underline text-xs"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
