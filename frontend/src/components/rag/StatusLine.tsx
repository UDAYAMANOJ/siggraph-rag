"use client";

interface StatusLineProps {
  message: string;
  isActive: boolean;
  currentStage?: string;
}

export function StatusLine({
  message,
  isActive,
  currentStage = "",
}: StatusLineProps) {
  // Get icon based on stage
  const getStageIcon = (stage: string): string => {
    const iconMap: Record<string, string> = {
      connecting: "🔌",
      refining: "🔧",
      refined: "✨",
      semantic_search: "🔍",
      semantic_done: "✅",
      bm25_search: "📝",
      bm25_done: "✅",
      fusion: "🔀",
      reranking: "📊",
      found: "📚",
      generating: "🤖",
      writing: "✍️",
      complete: "✅",
      error: "❌",
    };
    return iconMap[stage] || "⏳";
  };

  const icon = getStageIcon(currentStage);
  // Use the actual message from backend which contains detailed info
  const displayMessage = message || "Processing...";

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm px-3 py-2">
      <div className="flex items-center gap-2">
        {/* Status Text */}
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {isActive && (
            <svg
              className="w-3.5 h-3.5 text-blue-600 animate-spin flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          )}
          <span className="flex-shrink-0">{icon}</span>
          <p
            className={`text-xs md:text-sm font-medium truncate ${isActive ? "text-gray-900" : "text-gray-600"}`}
          >
            {displayMessage}
          </p>
        </div>
      </div>
    </div>
  );
}
