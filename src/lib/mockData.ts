import {
  Post,
  Opportunity,
  Service,
  Event,
  Conversation,
  Product,
  Certification,
} from "@/types";

export const mockPosts: Post[] = [
  {
    id: "1",
    userId: "u1",
    author: {
      name: "Amara Okafor",
      company: "Okafor Agro Exports",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop",
      membershipTier: "Gold",
      isVerified: true,
    },
    content:
      "Excited to announce our new partnership with distributors in 5 West African countries! Our organic cashew nuts are now reaching more markets. AfCFTA is truly opening doors. 🌍✨",
    mediaUrl: "https://images.unsplash.com/photo-1599909533879-6bc6d6ce4932?w=800&h=500&fit=crop",
    sectorTag: "Agriculture",
    likes: 127,
    comments: 24,
    shares: 18,
    createdAt: "2024-02-15T10:30:00Z",
    isLiked: false,
  },
  {
    id: "2",
    userId: "u2",
    author: {
      name: "Kwame Mensah",
      company: "Adinkra Fashion House",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
      membershipTier: "Platinum",
      isVerified: true,
    },
    content:
      "Just returned from the Pan-African Fashion Week in Lagos. The connections made through AGBC have been invaluable. Looking for fabric suppliers in East Africa - DM me!",
    sectorTag: "Fashion",
    likes: 89,
    comments: 15,
    shares: 7,
    createdAt: "2024-02-14T15:20:00Z",
    isLiked: true,
  },
  {
    id: "3",
    userId: "u3",
    author: {
      name: "Zainab Hassan",
      company: "TechBridge Solutions",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop",
      membershipTier: "Silver",
      isVerified: false,
    },
    content:
      "Our fintech solution just secured ISO 27001 certification! Now ready to scale across SADC region. Thank you AGBC community for the compliance guidance. 🚀",
    mediaUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=500&fit=crop",
    sectorTag: "Technology",
    likes: 156,
    comments: 31,
    shares: 22,
    createdAt: "2024-02-13T09:15:00Z",
    isLiked: false,
  },
];

export const mockOpportunities: Opportunity[] = [
  {
    id: "op1",
    postedBy: "buyer1",
    buyerName: "East African Retail Chain",
    buyerCountry: "Kenya",
    title: "Seeking Organic Coffee Suppliers - 500 Tons/Year",
    description:
      "Established retail chain looking for certified organic coffee suppliers for long-term partnership. Must have export experience and quality certifications.",
    category: "Buyer Request",
    sector: "Agriculture",
    dealSize: "$500K - $1M",
    isVerified: true,
    premiumOnly: false,
    applicants: 12,
    deadline: "2024-03-15",
    createdAt: "2024-02-10T08:00:00Z",
    requirements: [
      "Organic certification required",
      "Export experience to East Africa",
      "Minimum 100 tons per shipment",
      "Quality control documentation",
    ],
  },
  {
    id: "op2",
    postedBy: "buyer2",
    buyerName: "Southern Cross Distributors",
    buyerCountry: "South Africa",
    title: "Distributor Wanted: Premium Beauty Products",
    description:
      "Looking for exclusive distributor for premium African beauty and cosmetics line across Southern Africa.",
    category: "Distributor Wanted",
    sector: "Fashion",
    dealSize: "$100K - $250K",
    isVerified: true,
    premiumOnly: true,
    applicants: 8,
    deadline: "2024-03-20",
    createdAt: "2024-02-12T11:30:00Z",
    requirements: [
      "Existing distribution network",
      "Beauty industry experience",
      "Marketing capabilities",
    ],
  },
  {
    id: "op3",
    postedBy: "gov1",
    buyerName: "Ministry of Infrastructure",
    buyerCountry: "Rwanda",
    title: "Solar Energy Installation - National Tender",
    description:
      "Government tender for solar panel installation across 50 rural health facilities. Technical and financial proposals due by April 2024.",
    category: "Tender Alert",
    sector: "Energy",
    dealSize: "$2M - $5M",
    isVerified: true,
    premiumOnly: false,
    applicants: 24,
    deadline: "2024-04-01",
    createdAt: "2024-02-08T14:00:00Z",
    requirements: [
      "Registered company in Rwanda or EAC",
      "Previous solar project experience",
      "Technical certification",
      "Financial capacity proof",
    ],
  },
  {
    id: "op4",
    postedBy: "org1",
    buyerName: "AfCFTA Secretariat",
    buyerCountry: "Ghana",
    title: "Trade Mission to North Africa - March 2024",
    description:
      "Join the official AfCFTA trade mission to Morocco and Egypt. Networking with 500+ buyers and government officials.",
    category: "Trade Mission",
    sector: "Manufacturing",
    dealSize: "N/A",
    isVerified: true,
    premiumOnly: false,
    applicants: 47,
    deadline: "2024-02-28",
    createdAt: "2024-02-05T09:00:00Z",
    requirements: [
      "Registered AGBC member",
      "Export-ready products",
      "Company profile complete",
    ],
  },
];

export const mockServices: Service[] = [
  {
    id: "s1",
    title: "Professional Product Catalog Design",
    description:
      "Get a premium digital catalog showcasing your products to international buyers. Includes professional photography setup guidance and multilingual support.",
    price: "$299",
    deliverables: [
      "20-page digital catalog",
      "PDF and web versions",
      "Brand alignment",
      "2 rounds of revisions",
    ],
    tierAccess: ["Silver", "Gold", "Platinum"],
    category: "Marketing",
    provider: "AGBC Design Studio",
  },
  {
    id: "s2",
    title: "Export Compliance & Documentation",
    description:
      "Navigate export regulations with expert guidance. We help you prepare all necessary documentation for AfCFTA trade.",
    price: "$499",
    deliverables: [
      "Compliance audit",
      "Document templates",
      "Country-specific guidance",
      "Certificate of Origin assistance",
    ],
    tierAccess: ["Gold", "Platinum"],
    category: "Compliance",
    provider: "Trade Afrika Advisory",
  },
  {
    id: "s3",
    title: "Premium Website Development",
    description:
      "Professional e-commerce website with payment integration, SEO optimization, and mobile responsiveness.",
    price: "$1,499",
    deliverables: [
      "Custom website design",
      "E-commerce functionality",
      "SEO optimization",
      "3 months support",
    ],
    tierAccess: ["Platinum"],
    category: "Technology",
    provider: "Digital Bridge Ltd",
  },
  {
    id: "s4",
    title: "Trade Readiness Assessment",
    description:
      "Comprehensive evaluation of your export readiness with actionable recommendations and personalized roadmap.",
    price: "$199",
    deliverables: [
      "Detailed assessment report",
      "Gap analysis",
      "Action plan",
      "Follow-up consultation",
    ],
    tierAccess: ["Free", "Silver", "Gold", "Platinum"],
    category: "Consulting",
    provider: "AGBC Advisory",
  },
];

export const mockEvents: Event[] = [
  {
    id: "e1",
    title: "Mastering AfCFTA: Export Opportunities Webinar",
    description:
      "Learn how to leverage AfCFTA for cross-border trade. Expert speakers from the AfCFTA Secretariat and successful exporters share insights.",
    eventDate: "2024-02-25T14:00:00Z",
    duration: "2 hours",
    type: "Webinar",
    registrations: 234,
    maxParticipants: 500,
    liveLink: "/events/e1/join",
    isPast: false,
  },
  {
    id: "e2",
    title: "Digital Marketing for African Exporters",
    description:
      "Hands-on workshop on using digital channels to reach international buyers. Includes social media, SEO, and content marketing strategies.",
    eventDate: "2024-03-05T10:00:00Z",
    duration: "4 hours",
    type: "Workshop",
    registrations: 89,
    maxParticipants: 100,
    isPast: false,
  },
  {
    id: "e3",
    title: "West Africa Networking Mixer - Lagos",
    description:
      "In-person networking event bringing together 200+ SMEs, buyers, and investors from across West Africa.",
    eventDate: "2024-03-15T17:00:00Z",
    duration: "3 hours",
    type: "Networking",
    registrations: 156,
    maxParticipants: 200,
    isPast: false,
  },
  {
    id: "e4",
    title: "Successfully Navigating Export Finance",
    description:
      "Past event recording now available. Learn about financing options for African exporters including trade credit and export insurance.",
    eventDate: "2024-02-01T13:00:00Z",
    duration: "90 minutes",
    type: "Webinar",
    registrations: 312,
    replayUrl: "/events/e4/replay",
    isPast: true,
  },
];

export const mockConversations: Conversation[] = [
  {
    id: "c1",
    participant: {
      id: "u5",
      name: "Ahmed El-Sayed",
      company: "Nile Valley Imports",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop",
    },
    lastMessage: "I'm interested in your organic products. Can we schedule a call?",
    lastMessageAt: "2024-02-16T11:20:00Z",
    unreadCount: 2,
  },
  {
    id: "c2",
    participant: {
      id: "u6",
      name: "Grace Mwangi",
      company: "Kenya Export Partners",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
    },
    lastMessage: "Thanks for the catalog! Our team is reviewing it.",
    lastMessageAt: "2024-02-15T16:45:00Z",
    unreadCount: 0,
  },
  {
    id: "c3",
    participant: {
      id: "u7",
      name: "Chidi Okonkwo",
      company: "PanAfrican Logistics",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop",
    },
    lastMessage: "What are your shipping terms to West Africa?",
    lastMessageAt: "2024-02-14T09:30:00Z",
    unreadCount: 1,
  },
];

export const mockProducts: Product[] = [
  {
    id: "p1",
    companyId: "c1",
    name: "Premium Cashew Nuts",
    description: "Grade A organic cashews, sourced from certified farms",
    imageUrl: "https://images.unsplash.com/photo-1599909533879-6bc6d6ce4932?w=400&h=300&fit=crop",
    certificationStatus: true,
    category: "Agriculture",
  },
  {
    id: "p2",
    companyId: "c1",
    name: "Dried Mango Slices",
    description: "100% natural, no preservatives, export quality",
    imageUrl: "https://images.unsplash.com/photo-1553279906-f3c0a87ecce1?w=400&h=300&fit=crop",
    certificationStatus: true,
    category: "Agriculture",
  },
  {
    id: "p3",
    companyId: "c1",
    name: "Organic Moringa Powder",
    description: "Superfood powder from sustainably harvested moringa leaves",
    imageUrl: "https://images.unsplash.com/photo-1505576391880-b3f9d713dc4f?w=400&h=300&fit=crop",
    certificationStatus: false,
    category: "Agriculture",
  },
];

export const mockCertifications: Certification[] = [
  {
    id: "cert1",
    companyId: "c1",
    certificateName: "Organic Certification",
    issuingOrganization: "African Organic Agriculture Network",
    fileUrl: "/certifications/organic-cert.pdf",
    verifiedStatus: true,
    issueDate: "2023-06-15",
  },
  {
    id: "cert2",
    companyId: "c1",
    certificateName: "HACCP Certification",
    issuingOrganization: "International Food Safety Authority",
    fileUrl: "/certifications/haccp-cert.pdf",
    verifiedStatus: true,
    issueDate: "2023-08-20",
  },
  {
    id: "cert3",
    companyId: "c1",
    certificateName: "Fair Trade Certification",
    issuingOrganization: "Fairtrade Africa",
    fileUrl: "/certifications/fairtrade-cert.pdf",
    verifiedStatus: false,
    issueDate: "2024-01-10",
  },
];
