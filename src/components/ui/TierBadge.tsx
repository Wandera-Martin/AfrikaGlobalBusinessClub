import { MembershipTier } from "@/types";
import { Shield, Star, Crown, Zap } from "lucide-react";

interface TierBadgeProps {
  tier: MembershipTier;
  size?: "sm" | "md" | "lg";
}

const TierBadge = ({ tier, size = "md" }: TierBadgeProps) => {
  const configs = {
    Free: {
      icon: null,
      bg: "bg-gray-100",
      text: "text-gray-600",
      border: "border-gray-300",
    },
    Silver: {
      icon: Shield,
      bg: "bg-gray-50",
      text: "text-gray-500",
      border: "border-gray-400",
    },
    Gold: {
      icon: Star,
      bg: "bg-amber-50",
      text: "text-agbc-gold",
      border: "border-agbc-gold",
    },
    Platinum: {
      icon: Crown,
      bg: "bg-purple-50",
      text: "text-purple-600",
      border: "border-purple-500",
    },
  };

  const config = configs[tier];
  const Icon = config.icon;

  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-3 py-1",
    lg: "text-base px-4 py-1.5",
  };

  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border ${config.bg} ${config.text} ${config.border} ${sizeClasses[size]} font-medium`}
    >
      {Icon && <Icon className={iconSizes[size]} />}
      {tier}
    </span>
  );
};

export default TierBadge;
