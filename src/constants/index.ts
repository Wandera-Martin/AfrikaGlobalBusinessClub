import { Sector, MembershipTier } from "@/types";

export const SECTORS: Sector[] = [
  "Agriculture",
  "Manufacturing",
  "Technology",
  "Fashion",
  "Healthcare",
  "Energy",
  "Construction",
  "Logistics",
  "Finance",
  "Tourism",
];

export const AFRICAN_COUNTRIES = [
  "Nigeria",
  "Kenya",
  "South Africa",
  "Ghana",
  "Egypt",
  "Ethiopia",
  "Tanzania",
  "Uganda",
  "Rwanda",
  "Senegal",
  "Côte d'Ivoire",
  "Morocco",
  "Tunisia",
  "Cameroon",
  "Zambia",
  "Zimbabwe",
  "Botswana",
  "Namibia",
  "Mauritius",
  "Mozambique",
];

export const MEMBERSHIP_TIERS: {
  tier: MembershipTier;
  price: string;
  features: string[];
  color: string;
}[] = [
  {
    tier: "Free",
    price: "$0/month",
    features: [
      "Basic profile",
      "Community feed access",
      "Limited opportunity visibility",
      "Basic messaging",
    ],
    color: "text-gray-600",
  },
  {
    tier: "Silver",
    price: "$29/month",
    features: [
      "Enhanced profile",
      "Priority feed placement",
      "Full opportunity access",
      "Unlimited messaging",
      "Service discounts (10%)",
    ],
    color: "text-gray-400",
  },
  {
    tier: "Gold",
    price: "$79/month",
    features: [
      "Premium profile with verification",
      "Featured placement",
      "Advanced analytics",
      "Priority support",
      "Service discounts (20%)",
      "Event access",
    ],
    color: "text-agbc-gold",
  },
  {
    tier: "Platinum",
    price: "$199/month",
    features: [
      "Elite profile with priority badge",
      "Dedicated account manager",
      "AI-powered matching",
      "Trade intelligence reports",
      "Service discounts (30%)",
      "VIP event access",
      "Custom integrations",
    ],
    color: "text-purple-600",
  },
];

export const TRADE_READINESS_CRITERIA = {
  profileCompletion: 25,
  certifications: 25,
  exportExperience: 25,
  documentation: 25,
};
