import { CheckCircle } from "lucide-react";

interface VerifiedBadgeProps {
  size?: "sm" | "md" | "lg";
}

const VerifiedBadge = ({ size = "md" }: VerifiedBadgeProps) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  return (
    <CheckCircle className={`${sizeClasses[size]} text-agbc-green fill-current`} title="Verified Business" />
  );
};

export default VerifiedBadge;
