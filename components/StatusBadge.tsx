import { CONDITION_COLORS, CONDITION_LABELS, MedicalConditionStatus } from "@/lib/types";

interface StatusBadgeProps {
  status: MedicalConditionStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${CONDITION_COLORS[status]}`}
    >
      {CONDITION_LABELS[status]}
    </span>
  );
}
