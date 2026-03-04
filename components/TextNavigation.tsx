interface TextNavigationProps {
  steps: string[];
}

export default function TextNavigation({ steps }: TextNavigationProps) {
  return (
    <div
      className="p-4 rounded-lg mb-6 border"
      style={{ backgroundColor: "#f0fdf4", borderColor: "#bbf7d0" }}
      role="region"
      aria-label="Step-by-step navigation instructions"
    >
      <div className="flex items-center gap-2 mb-3">
        <span className="text-2xl" aria-hidden="true">📝</span>
        <p className="text-sm font-semibold text-green-900">
          Text Navigation — Follow These Steps
        </p>
      </div>
      <ol className="space-y-2">
        {steps.map((step, idx) => (
          <li
            key={idx}
            className="flex items-start gap-3 p-2 rounded-md hover:bg-green-100 transition-colors"
          >
            <span className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-full bg-green-600 text-white text-xs font-bold">
              {idx + 1}
            </span>
            <span className="text-sm text-green-800 pt-0.5">{step}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
