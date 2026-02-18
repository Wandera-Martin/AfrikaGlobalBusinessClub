// Marketplace Module Types

export type SupplierTier = "Basic" | "Verified" | "Gold" | "Premium";
export type OrderStatus = "Pending" | "Confirmed" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
export type DisputeStatus = "Open" | "Under Review" | "Resolved" | "Closed";
export type EscrowStatus = "Pending" | "Held" | "Released" | "Refunded";

export interface MarketplaceProduct {
  id: string;
  supplierId: string;
  name: string;
  description: string;
  category: string;
  images: string[];
  minOrderQuantity: number;
  pricePerUnit: number;
  currency: string;
  pricingTiers: PricingTier[];
  certifications: string[];
  leadTime: string;
  availability: "In Stock" | "Pre-Order" | "Out of Stock";
  views: number;
  inquiries: number;
  createdAt: string;
}

export interface PricingTier {
  minQuantity: number;
  maxQuantity?: number;
  pricePerUnit: number;
}

export interface ProductVariant {
  id: string;
  productId: string;
  name: string;
  sku: string;
  specifications: Record<string, string>;
  priceModifier: number;
  stock: number;
}

export interface SupplierProfile {
  id: string;
  userId: string;
  companyName: string;
  tier: SupplierTier;
  description: string;
  logo: string;
  coverImage: string;
  country: string;
  yearsInBusiness: number;
  responseRate: number;
  responseTime: string;
  totalProducts: number;
  totalOrders: number;
  rating: number;
  reviews: number;
  verificationBadges: string[];
  mainCategories: string[];
  certifications: string[];
}

export interface RFQ {
  id: string;
  buyerId: string;
  title: string;
  description: string;
  category: string;
  targetQuantity: number;
  targetPrice?: number;
  deliveryLocation: string;
  deadline: string;
  attachments?: string[];
  responses: number;
  status: "Open" | "Closed";
  createdAt: string;
}

export interface RFQResponse {
  id: string;
  rfqId: string;
  supplierId: string;
  pricePerUnit: number;
  totalPrice: number;
  moq: number;
  leadTime: string;
  validUntil: string;
  notes: string;
  attachments?: string[];
  status: "Pending" | "Accepted" | "Rejected";
  createdAt: string;
}

export interface MarketplaceOrder {
  id: string;
  orderId: string;
  buyerId: string;
  supplierId: string;
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  totalAmount: number;
  currency: string;
  status: OrderStatus;
  paymentMethod: string;
  escrowId?: string;
  shippingAddress: ShippingAddress;
  trackingNumber?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  variantId?: string;
  quantity: number;
  pricePerUnit: number;
  totalPrice: number;
  specifications?: Record<string, string>;
}

export interface ShippingAddress {
  fullName: string;
  company: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  phone: string;
}

export interface EscrowTransaction {
  id: string;
  orderId: string;
  amount: number;
  currency: string;
  status: EscrowStatus;
  releaseConditions: string[];
  createdAt: string;
  releasedAt?: string;
}

export interface Review {
  id: string;
  productId?: string;
  supplierId: string;
  buyerId: string;
  rating: number;
  title: string;
  content: string;
  images?: string[];
  verified: boolean;
  helpful: number;
  createdAt: string;
}

export interface Dispute {
  id: string;
  orderId: string;
  raisedBy: string;
  against: string;
  reason: string;
  description: string;
  evidence: string[];
  status: DisputeStatus;
  resolution?: string;
  createdAt: string;
  resolvedAt?: string;
}

export interface MarketplaceCategory {
  id: string;
  name: string;
  slug: string;
  parentId?: string;
  icon: string;
  productCount: number;
}
