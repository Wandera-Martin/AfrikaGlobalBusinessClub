// Re-export all type modules
export * from "./marketplace";
export * from "./index-directory";

// Keep existing core types
export type UserRole = "SME" | "Buyer" | "Admin";

export type MembershipTier = "Free" | "Silver" | "Gold" | "Platinum";

export type Sector =
  | "Agriculture"
  | "Manufacturing"
  | "Technology"
  | "Fashion"
  | "Healthcare"
  | "Energy"
  | "Construction"
  | "Logistics"
  | "Finance"
  | "Tourism";

export interface User {
  id: string;
  email: string;
  role: UserRole;
  membershipTier: MembershipTier;
  isVerified: boolean;
  createdAt: string;
}

export interface Company {
  id: string;
  userId: string;
  companyName: string;
  sector: Sector;
  country: string;
  description: string;
  logoUrl?: string;
  tradeReadinessScore: number;
  profileCompletion: number;
  website?: string;
  exportMarkets?: string[];
  yearEstablished?: number;
}

export interface Product {
  id: string;
  companyId: string;
  name: string;
  description: string;
  imageUrl?: string;
  certificationStatus: boolean;
  category?: string;
}

export interface Certification {
  id: string;
  companyId: string;
  certificateName: string;
  issuingOrganization: string;
  fileUrl: string;
  verifiedStatus: boolean;
  issueDate: string;
}

export interface Post {
  id: string;
  userId: string;
  author: {
    name: string;
    company: string;
    avatar?: string;
    membershipTier: MembershipTier;
    isVerified: boolean;
  };
  content: string;
  mediaUrl?: string;
  sectorTag?: Sector;
  likes: number;
  comments: number;
  shares: number;
  createdAt: string;
  isLiked?: boolean;
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  author: {
    name: string;
    avatar?: string;
  };
  content: string;
  createdAt: string;
}

export interface Opportunity {
  id: string;
  postedBy: string;
  buyerName: string;
  buyerCountry: string;
  title: string;
  description: string;
  category: "Buyer Request" | "Distributor Wanted" | "Tender Alert" | "Trade Mission";
  sector: Sector;
  dealSize?: string;
  isVerified: boolean;
  premiumOnly: boolean;
  applicants: number;
  deadline?: string;
  createdAt: string;
  requirements?: string[];
}

export interface Application {
  id: string;
  opportunityId: string;
  companyId: string;
  status: "Pending" | "Reviewed" | "Accepted" | "Rejected";
  appliedAt: string;
  message?: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  fileUrl?: string;
  isRead: boolean;
  createdAt: string;
}

export interface Conversation {
  id: string;
  participant: {
    id: string;
    name: string;
    company: string;
    avatar?: string;
  };
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  price: string;
  deliverables: string[];
  tierAccess: MembershipTier[];
  category: string;
  provider?: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  eventDate: string;
  duration: string;
  type: "Webinar" | "Workshop" | "Trade Mission" | "Networking";
  registrations: number;
  maxParticipants?: number;
  liveLink?: string;
  replayUrl?: string;
  isPast: boolean;
}
