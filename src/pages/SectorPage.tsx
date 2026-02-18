import { useParams } from "react-router-dom";
import UnifiedShell from "@/components/layout/UnifiedShell";
import { Button } from "@/components/ui/button";
import TierBadge from "@/components/ui/TierBadge";
import VerifiedBadge from "@/components/ui/VerifiedBadge";
import { mockPosts } from "@/lib/mockData";
import { Sector } from "@/types";
import { Users, TrendingUp, FileText, Briefcase } from "lucide-react";

const SectorPage = () => {
  const { sectorName } = useParams<{ sectorName: string }>();
  const sector = sectorName as Sector;

  const sectorPosts = mockPosts.filter((post) => post.sectorTag === sector);

  const sectorInfo = {
    Agriculture: {
      description: "Connect with agribusiness leaders, exporters, and agricultural technology innovators across Africa.",
      icon: "🌾",
      color: "from-green-500 to-emerald-600",
    },
    Technology: {
      description: "Join the fastest-growing sector in African business. Connect with tech innovators and digital entrepreneurs.",
      icon: "💻",
      color: "from-blue-500 to-cyan-600",
    },
    Fashion: {
      description: "Showcase African fashion and textiles. Connect with designers, manufacturers, and international buyers.",
      icon: "👗",
      color: "from-pink-500 to-purple-600",
    },
    Manufacturing: {
      description: "Industrial manufacturing, production, and supply chain excellence in Africa.",
      icon: "🏭",
      color: "from-gray-600 to-slate-700",
    },
    Healthcare: {
      description: "Medical supplies, pharmaceuticals, and healthcare services across the continent.",
      icon: "🏥",
      color: "from-red-500 to-rose-600",
    },
    Energy: {
      description: "Renewable energy, power generation, and sustainable energy solutions.",
      icon: "⚡",
      color: "from-yellow-500 to-amber-600",
    },
    Construction: {
      description: "Building materials, construction services, and infrastructure development.",
      icon: "🏗️",
      color: "from-orange-500 to-orange-700",
    },
    Logistics: {
      description: "Transport, warehousing, and supply chain management across Africa.",
      icon: "🚚",
      color: "from-indigo-500 to-blue-700",
    },
    Finance: {
      description: "Financial services, fintech, and trade finance solutions.",
      icon: "💰",
      color: "from-emerald-500 to-teal-600",
    },
    Tourism: {
      description: "Travel, hospitality, and tourism services showcasing African destinations.",
      icon: "✈️",
      color: "from-sky-500 to-blue-600",
    },
  };

  const info = sectorInfo[sector as keyof typeof sectorInfo] || {
    description: "Connect with professionals in this sector",
    icon: "📊",
    color: "from-gray-500 to-gray-600",
  };

  return (
    <UnifiedShell>
      <div className="min-h-screen bg-gray-50">
      
      <div className="pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Sector Header */}
          <div className={`bg-gradient-to-r ${info.color} rounded-xl p-8 mb-8 text-white`}>
            <div className="flex items-center gap-4 mb-4">
              <div className="text-6xl">{info.icon}</div>
              <div className="flex-1">
                <h1 className="text-4xl font-bold mb-2">{sector}</h1>
                <p className="text-blue-100 text-lg">{info.description}</p>
              </div>
              <Button className="bg-white text-agbc-blue hover:bg-gray-100">
                Join Community
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-6 mt-8 pt-6 border-t border-white/20">
              <div>
                <div className="text-3xl font-bold mb-1">342</div>
                <div className="text-sm text-blue-100">Members</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-1">128</div>
                <div className="text-sm text-blue-100">Active Companies</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-1">45</div>
                <div className="text-sm text-blue-100">Opportunities</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-1">18</div>
                <div className="text-sm text-blue-100">Countries</div>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-3 space-y-4">
              {/* Top Contributors */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Users className="w-5 h-5 text-agbc-blue" />
                  <h3 className="font-semibold text-gray-900">Top Contributors</h3>
                </div>
                <div className="space-y-3">
                  {sectorPosts.slice(0, 3).map((post) => (
                    <div key={post.id} className="flex items-center gap-3">
                      <img
                        src={post.author.avatar}
                        alt={post.author.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1">
                          <h4 className="text-sm font-semibold text-gray-900 truncate">
                            {post.author.name}
                          </h4>
                          {post.author.isVerified && <VerifiedBadge size="sm" />}
                        </div>
                        <p className="text-xs text-gray-600 truncate">{post.author.company}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Resources */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="w-5 h-5 text-agbc-green" />
                  <h3 className="font-semibold text-gray-900">Resources</h3>
                </div>
                <div className="space-y-2">
                  <Button variant="link" className="w-full justify-start p-0 h-auto text-sm text-agbc-blue">
                    → Export Guide for {sector}
                  </Button>
                  <Button variant="link" className="w-full justify-start p-0 h-auto text-sm text-agbc-blue">
                    → Certification Requirements
                  </Button>
                  <Button variant="link" className="w-full justify-start p-0 h-auto text-sm text-agbc-blue">
                    → Market Insights Report
                  </Button>
                </div>
              </div>

              {/* Sector Opportunities */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Briefcase className="w-5 h-5 text-agbc-gold" />
                  <h3 className="font-semibold text-gray-900">Active Opportunities</h3>
                </div>
                <div className="text-center py-4">
                  <div className="text-4xl font-bold text-agbc-blue mb-2">12</div>
                  <p className="text-sm text-gray-600 mb-3">opportunities available</p>
                  <Button variant="outline" size="sm" className="w-full">
                    View All
                  </Button>
                </div>
              </div>
            </div>

            {/* Feed */}
            <div className="lg:col-span-9 space-y-6">
              {/* Activity Feed Header */}
              <div className="bg-white rounded-xl shadow-sm p-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">Sector Activity</h2>
                  <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-agbc-blue focus:border-transparent">
                    <option>Recent</option>
                    <option>Most Popular</option>
                    <option>Most Engaged</option>
                  </select>
                </div>
              </div>

              {/* Posts */}
              {sectorPosts.map((post) => (
                <div key={post.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-start gap-3 mb-4">
                      <img
                        src={post.author.avatar}
                        alt={post.author.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-bold text-gray-900">{post.author.name}</h4>
                          {post.author.isVerified && <VerifiedBadge size="sm" />}
                        </div>
                        <p className="text-sm text-gray-600">{post.author.company}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <TierBadge tier={post.author.membershipTier} size="sm" />
                          <span className="text-xs text-gray-500">
                            {new Date(post.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-800 leading-relaxed mb-4">{post.content}</p>

                    {post.mediaUrl && (
                      <img
                        src={post.mediaUrl}
                        alt="Post content"
                        className="w-full rounded-lg mb-4"
                      />
                    )}

                    <div className="flex items-center gap-6 text-sm text-gray-600">
                      <span>{post.likes} likes</span>
                      <span>{post.comments} comments</span>
                      <span>{post.shares} shares</span>
                    </div>
                  </div>
                </div>
              ))}

              {sectorPosts.length === 0 && (
                <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                  <TrendingUp className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No posts yet in {sector}
                  </h3>
                  <p className="text-gray-600 mb-4">Be the first to share something!</p>
                  <Button className="bg-agbc-blue hover:bg-agbc-blue-dark">
                    Create Post
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
    </UnifiedShell>
  );
};

export default SectorPage;
