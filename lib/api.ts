import {
  ApiResponse,
  PatientDTO,
  MedicalRecordDTO,
  MedicalStatusDTO,
  DisabilityType,
  MedicalConditionStatus,
  AccessibilityResponse,
} from "./types";

const BASE = "/api";

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.message || `Request failed: ${res.status}`);
  }

  const json: ApiResponse<T> = await res.json();
  if (!json.success) {
    throw new Error(json.message);
  }
  return json.data;
}

// ==================== Patients ====================

export const patientApi = {
  getAll: () => request<PatientDTO[]>(`${BASE}/patients`),

  getById: (id: number) => request<PatientDTO>(`${BASE}/patients/${id}`),

  create: (data: PatientDTO) =>
    request<PatientDTO>(`${BASE}/patients`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id: number, data: PatientDTO) =>
    request<PatientDTO>(`${BASE}/patients/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (id: number) =>
    request<void>(`${BASE}/patients/${id}`, { method: "DELETE" }),

  getByDisability: (type: DisabilityType) =>
    request<PatientDTO[]>(`${BASE}/patients/disability/${type}`),

  search: (name: string) =>
    request<PatientDTO[]>(`${BASE}/patients/search?name=${encodeURIComponent(name)}`),

  updateAccessibility: (id: number, data: Partial<PatientDTO>) =>
    request<PatientDTO>(`${BASE}/patients/${id}/accessibility`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
};

// ==================== Medical Records ====================

export const recordApi = {
  getByPatient: (patientId: number) =>
    request<MedicalRecordDTO[]>(`${BASE}/medical-records/patient/${patientId}`),

  getById: (id: number) =>
    request<MedicalRecordDTO>(`${BASE}/medical-records/${id}`),

  create: (data: MedicalRecordDTO) =>
    request<MedicalRecordDTO>(`${BASE}/medical-records`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id: number, data: MedicalRecordDTO) =>
    request<MedicalRecordDTO>(`${BASE}/medical-records/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (id: number) =>
    request<void>(`${BASE}/medical-records/${id}`, { method: "DELETE" }),

  getByType: (patientId: number, recordType: string) =>
    request<MedicalRecordDTO[]>(
      `${BASE}/medical-records/patient/${patientId}/type/${recordType}`
    ),

  getFollowUps: (patientId: number) =>
    request<MedicalRecordDTO[]>(
      `${BASE}/medical-records/patient/${patientId}/follow-ups`
    ),

  getLatest: (patientId: number) =>
    request<MedicalRecordDTO>(
      `${BASE}/medical-records/patient/${patientId}/latest`
    ),
};

// ==================== Medical Status ====================

export const statusApi = {
  getHistory: (patientId: number) =>
    request<MedicalStatusDTO[]>(
      `${BASE}/medical-status/patient/${patientId}/history`
    ),

  getLatest: (patientId: number) =>
    request<MedicalStatusDTO>(
      `${BASE}/medical-status/patient/${patientId}/latest`
    ),

  getById: (id: number) =>
    request<MedicalStatusDTO>(`${BASE}/medical-status/${id}`),

  create: (data: MedicalStatusDTO) =>
    request<MedicalStatusDTO>(`${BASE}/medical-status`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id: number, data: MedicalStatusDTO) =>
    request<MedicalStatusDTO>(`${BASE}/medical-status/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (id: number) =>
    request<void>(`${BASE}/medical-status/${id}`, { method: "DELETE" }),

  getByCondition: (patientId: number, status: MedicalConditionStatus) =>
    request<MedicalStatusDTO[]>(
      `${BASE}/medical-status/patient/${patientId}/condition/${status}`
    ),
};

// ==================== Accessibility ====================

export const accessibilityApi = {
  voiceRecords: (patientId: number) =>
    request<AccessibilityResponse<MedicalRecordDTO[]>>(
      `${BASE}/accessible/voice/patient/${patientId}/records`
    ),

  voiceStatus: (patientId: number) =>
    request<AccessibilityResponse<MedicalStatusDTO>>(
      `${BASE}/accessible/voice/patient/${patientId}/status`
    ),

  textRecords: (patientId: number) =>
    request<AccessibilityResponse<MedicalRecordDTO[]>>(
      `${BASE}/accessible/text/patient/${patientId}/records`
    ),

  textStatus: (patientId: number) =>
    request<AccessibilityResponse<MedicalStatusDTO>>(
      `${BASE}/accessible/text/patient/${patientId}/status`
    ),

  autoRecords: (patientId: number) =>
    request<AccessibilityResponse<MedicalRecordDTO[]>>(
      `${BASE}/accessible/auto/patient/${patientId}/records`
    ),

  autoStatus: (patientId: number) =>
    request<AccessibilityResponse<MedicalStatusDTO>>(
      `${BASE}/accessible/auto/patient/${patientId}/status`
    ),
};
