// Index Directory Module Types

export type ListingStatus = "Draft" | "Active" | "Suspended" | "Inactive";
export type RankingTier = "Standard" | "Featured" | "Premium" | "Elite";

export interface CompanyListing {
  id: string;
  userId: string;
  companyName: string;
  slug: string;
  logo: string;
  coverImage?: string;
  tagline: string;
  description: string;
  sector: string;
  industries: string[];
  country: string;
  city: string;
  website: string;
  email: string;
  phone: string;
  foundedYear: number;
  employeeCount: string;
  annualRevenue?: string;
  exportMarkets: string[];
  certifications: string[];
  products: string[];
  services: string[];
  keywords: string[];
  rankingScore: number;
  rankingTier: RankingTier;
  views: number;
  inquiries: number;
  verified: boolean;
  status: ListingStatus;
  seo: SEOMetadata;
  createdAt: string;
  updatedAt: string;
}

export interface SEOMetadata {
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string[];
  ogImage?: string;
}

export interface SectorClassification {
  id: string;
  name: string;
  slug: string;
  description: string;
  parentId?: string;
  icon: string;
  listingCount: number;
}

export interface RankingFactors {
  profileCompleteness: number;
  verificationStatus: number;
  engagement: number;
  exportReadiness: number;
  certifications: number;
  testimonials: number;
  activity: number;
}

export interface DirectorySearchFilters {
  query?: string;
  sector?: string;
  country?: string;
  city?: string;
  certifications?: string[];
  exportMarkets?: string[];
  employeeCount?: string;
  rankingTier?: RankingTier;
  verified?: boolean;
}
