interface TradeReadinessMeterProps {
  score: number;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
}

const TradeReadinessMeter = ({ score, showLabel = true, size = "md" }: TradeReadinessMeterProps) => {
  const getColor = (score: number) => {
    if (score >= 80) return "bg-agbc-green";
    if (score >= 60) return "bg-agbc-gold";
    return "bg-red-500";
  };

  const getLabel = (score: number) => {
    if (score >= 80) return "Export Ready";
    if (score >= 60) return "Good Progress";
    if (score >= 40) return "Developing";
    return "Getting Started";
  };

  const heights = {
    sm: "h-2",
    md: "h-3",
    lg: "h-4",
  };

  return (
    <div className="space-y-2">
      {showLabel && (
        <div className="flex justify-between items-center text-sm">
          <span className="font-medium text-gray-700">Trade Readiness</span>
          <span className="font-bold text-agbc-blue">{score}%</span>
        </div>
      )}
      <div className={`w-full bg-gray-200 rounded-full ${heights[size]} overflow-hidden`}>
        <div
          className={`${getColor(score)} ${heights[size]} rounded-full transition-all duration-500`}
          style={{ width: `${score}%` }}
        />
      </div>
      {showLabel && (
        <p className="text-xs text-gray-500 text-right">{getLabel(score)}</p>
      )}
    </div>
  );
};

export default TradeReadinessMeter;
