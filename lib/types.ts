// ---- Enums ----

export type DisabilityType =
  | "BLIND"
  | "HANDICAP"
  | "GENETIC_DISEASE"
  | "DEAF"
  | "MUTE"
  | "DEAF_MUTE"
  | "OTHER";

export type AccessibilityMode =
  | "VOICE_ASSISTANCE"
  | "TEXT_NAVIGATION"
  | "STANDARD";

export type MedicalConditionStatus =
  | "STABLE"
  | "IMPROVING"
  | "DETERIORATING"
  | "CRITICAL"
  | "UNDER_TREATMENT"
  | "RECOVERED"
  | "MONITORING";

export type RecordType =
  | "DIAGNOSIS"
  | "PRESCRIPTION"
  | "LAB_REPORT"
  | "SURGERY"
  | "THERAPY"
  | "FOLLOW_UP";

// ---- DTOs ----

export interface PatientDTO {
  id?: number;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  email: string;
  phoneNumber?: string;
  address?: string;
  city?: string;
  state?: string;
  pinCode?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  disabilityType: DisabilityType;
  disabilityDetails?: string;
  disabilityPercentage?: number;
  disabilityCertificateNumber?: string;
  accessibilityMode?: AccessibilityMode;
  preferredLanguage?: string;
  voiceSpeechRate?: number;
  vibrationFeedbackEnabled?: boolean;
  visualAlertsEnabled?: boolean;
  highContrastMode?: boolean;
  fontSizeMultiplier?: number;
}

export interface MedicalRecordDTO {
  id?: number;
  patientId: number;
  title: string;
  recordDate: string;
  recordType: string;
  hospitalName?: string;
  doctorName?: string;
  doctorSpecialization?: string;
  diagnosis?: string;
  prescriptions?: string;
  treatmentPlan?: string;
  labResults?: string;
  notes?: string;
  nextFollowUpDate?: string;
  attachmentUrl?: string;
  voiceSummary?: string;
  textNavigationInstructions?: string;
}

export interface MedicalStatusDTO {
  id?: number;
  patientId: number;
  statusDate: string;
  conditionStatus: MedicalConditionStatus;
  conditionSummary?: string;
  currentMedications?: string;
  bloodPressure?: string;
  heartRate?: number;
  temperature?: number;
  weight?: number;
  painLevel?: number;
  mobilityScore?: number;
  caregiverNotes?: string;
  recordedBy?: string;
  voiceSummary?: string;
  textNavigationInstructions?: string;
}

export interface AccessibilityResponse<T> {
  data: T;
  mode: AccessibilityMode;
  voiceNarration?: string;
  navigationSteps?: string[];
  audioCue?: string;
  screenReaderHint?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

// ---- Display helpers ----

export const DISABILITY_LABELS: Record<DisabilityType, string> = {
  BLIND: "Visual Impairment",
  HANDICAP: "Physical Handicap",
  GENETIC_DISEASE: "Genetic Disorder",
  DEAF: "Hearing Impairment",
  MUTE: "Speech Impairment",
  DEAF_MUTE: "Hearing & Speech Impairment",
  OTHER: "Other",
};

export const CONDITION_LABELS: Record<MedicalConditionStatus, string> = {
  STABLE: "Stable",
  IMPROVING: "Improving",
  DETERIORATING: "Deteriorating",
  CRITICAL: "Critical",
  UNDER_TREATMENT: "Under Treatment",
  RECOVERED: "Recovered",
  MONITORING: "Monitoring",
};

export const CONDITION_COLORS: Record<MedicalConditionStatus, string> = {
  STABLE: "bg-green-100 text-green-800",
  IMPROVING: "bg-blue-100 text-blue-800",
  DETERIORATING: "bg-orange-100 text-orange-800",
  CRITICAL: "bg-red-100 text-red-800",
  UNDER_TREATMENT: "bg-purple-100 text-purple-800",
  RECOVERED: "bg-emerald-100 text-emerald-800",
  MONITORING: "bg-yellow-100 text-yellow-800",
};
