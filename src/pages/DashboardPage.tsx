import { useState } from "react";
import UnifiedShell from "@/components/layout/UnifiedShell";
import { Button } from "@/components/ui/button";
import TierBadge from "@/components/ui/TierBadge";
import VerifiedBadge from "@/components/ui/VerifiedBadge";
import TradeReadinessMeter from "@/components/ui/TradeReadinessMeter";
import { getCurrentUser, getCurrentCompany } from "@/lib/auth";
import { mockPosts, mockOpportunities, mockEvents } from "@/lib/mockData";
import { Link } from "react-router-dom";
import { Heart, MessageCircle, Share2, Send, Image, FileText, TrendingUp, Briefcase, Calendar, Users } from "lucide-react";
import { toast } from "sonner";

const DashboardPage = () => {
  const user = getCurrentUser();
  const company = getCurrentCompany();
  const [posts] = useState(mockPosts);
  const [postContent, setPostContent] = useState("");

  const handleCreatePost = () => {
    if (!postContent.trim()) {
      toast.error("Please write something");
      return;
    }
    toast.success("Post created successfully!");
    setPostContent("");
  };

  const handleLike = (postId: string) => {
    console.log("Liked post:", postId);
    toast.success("Post liked!");
  };

  return (
    <UnifiedShell>
      <div className="min-h-screen bg-gray-50">
      
      <div className="pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-6">
            {/* Left Sidebar */}
            <div className="lg:col-span-3 space-y-4">
              {/* Profile Card */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-agbc-blue to-agbc-green rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                    {company?.companyName?.charAt(0) || "C"}
                  </div>
                  <h3 className="font-bold text-lg mb-1">{company?.companyName || "Your Company"}</h3>
                  <p className="text-sm text-gray-600 mb-3">{company?.sector}</p>
                  <div className="flex justify-center gap-2 mb-4">
                    <TierBadge tier={user?.membershipTier || "Free"} size="sm" />
                    {user?.isVerified && <VerifiedBadge size="sm" />}
                  </div>
                  <Link to="/profile">
                    <Button variant="outline" size="sm" className="w-full">
                      View Profile
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Trade Readiness */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <TradeReadinessMeter score={company?.tradeReadinessScore || 25} />
                <Button variant="link" className="w-full mt-3 text-agbc-blue p-0">
                  Improve Score →
                </Button>
              </div>

              {/* Quick Stats */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h4 className="font-semibold mb-4">Your Impact</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Profile Views</span>
                    <span className="font-bold text-agbc-blue">124</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Connections</span>
                    <span className="font-bold text-agbc-blue">38</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Opportunities Applied</span>
                    <span className="font-bold text-agbc-blue">5</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Feed */}
            <div className="lg:col-span-6 space-y-6">
              {/* Create Post */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-agbc-blue to-agbc-green rounded-full flex items-center justify-center text-white font-semibold">
                    {user?.email.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <textarea
                      placeholder="Share an update with the AGBC community..."
                      value={postContent}
                      onChange={(e) => setPostContent(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-agbc-blue focus:border-transparent resize-none"
                      rows={3}
                    />
                    <div className="flex justify-between items-center mt-3">
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Image className="w-5 h-5 mr-1" />
                          Photo
                        </Button>
                        <Button variant="ghost" size="sm">
                          <FileText className="w-5 h-5 mr-1" />
                          Document
                        </Button>
                      </div>
                      <Button onClick={handleCreatePost} className="bg-agbc-blue hover:bg-agbc-blue-dark">
                        <Send className="w-4 h-4 mr-2" />
                        Post
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Posts Feed */}
              {posts.map((post) => (
                <div key={post.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                  {/* Post Header */}
                  <div className="p-6 pb-4">
                    <div className="flex items-start gap-3">
                      <img
                        src={post.author.avatar}
                        alt={post.author.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold">{post.author.name}</h4>
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
                  </div>

                  {/* Post Content */}
                  <div className="px-6 pb-4">
                    <p className="text-gray-800 leading-relaxed">{post.content}</p>
                    {post.sectorTag && (
                      <Link to={`/sector/${post.sectorTag}`}>
                        <span className="inline-block mt-2 text-sm text-agbc-blue hover:underline">
                          #{post.sectorTag}
                        </span>
                      </Link>
                    )}
                  </div>

                  {/* Post Image */}
                  {post.mediaUrl && (
                    <img
                      src={post.mediaUrl}
                      alt="Post content"
                      className="w-full max-h-96 object-cover"
                    />
                  )}

                  {/* Post Actions */}
                  <div className="px-6 py-4 border-t border-gray-100">
                    <div className="flex justify-between items-center text-sm text-gray-600 mb-3">
                      <span>{post.likes} likes</span>
                      <span>{post.comments} comments · {post.shares} shares</span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleLike(post.id)}
                      >
                        <Heart className={`w-5 h-5 mr-2 ${post.isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                        Like
                      </Button>
                      <Button variant="ghost" size="sm" className="flex-1">
                        <MessageCircle className="w-5 h-5 mr-2" />
                        Comment
                      </Button>
                      <Button variant="ghost" size="sm" className="flex-1">
                        <Share2 className="w-5 h-5 mr-2" />
                        Share
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Sidebar */}
            <div className="lg:col-span-3 space-y-4">
              {/* Profile Completion */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h4 className="font-semibold mb-4">Complete Your Profile</h4>
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-bold text-agbc-blue">{company?.profileCompletion || 40}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-agbc-blue h-2 rounded-full transition-all"
                      style={{ width: `${company?.profileCompletion || 40}%` }}
                    />
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                    Upload company logo
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                    Add product listings
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                    Upload certifications
                  </div>
                </div>
              </div>

              {/* Top Opportunities */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-semibold">New Opportunities</h4>
                  <Link to="/opportunities" className="text-sm text-agbc-blue hover:underline">
                    View all
                  </Link>
                </div>
                <div className="space-y-3">
                  {mockOpportunities.slice(0, 3).map((opp) => (
                    <div key={opp.id} className="pb-3 border-b border-gray-100 last:border-0">
                      <div className="flex items-start gap-2 mb-1">
                        <Briefcase className="w-4 h-4 text-agbc-blue mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <h5 className="text-sm font-semibold text-gray-900 truncate">{opp.title}</h5>
                          <p className="text-xs text-gray-600">{opp.buyerCountry}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Upcoming Events */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-semibold">Upcoming Events</h4>
                  <Link to="/events" className="text-sm text-agbc-blue hover:underline">
                    View all
                  </Link>
                </div>
                <div className="space-y-3">
                  {mockEvents.filter(e => !e.isPast).slice(0, 2).map((event) => (
                    <div key={event.id} className="pb-3 border-b border-gray-100 last:border-0">
                      <div className="flex items-start gap-2 mb-1">
                        <Calendar className="w-4 h-4 text-agbc-green mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <h5 className="text-sm font-semibold text-gray-900 line-clamp-2">{event.title}</h5>
                          <p className="text-xs text-gray-600">
                            {new Date(event.eventDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Suggested Connections */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h4 className="font-semibold mb-4">Suggested Connections</h4>
                <div className="space-y-3">
                  {[
                    {
                      name: "Sarah Mwangi",
                      company: "Kenya Coffee Exports",
                      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
                    },
                    {
                      name: "David Osei",
                      company: "Ghana Logistics Hub",
                      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop",
                    },
                  ].map((person, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <img src={person.avatar} alt={person.name} className="w-10 h-10 rounded-full object-cover" />
                      <div className="flex-1 min-w-0">
                        <h5 className="text-sm font-semibold truncate">{person.name}</h5>
                        <p className="text-xs text-gray-600 truncate">{person.company}</p>
                      </div>
                      <Button size="sm" variant="outline" className="text-xs">
                        Connect
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </UnifiedShell>
  );
};

export default DashboardPage;
