import { useState } from "react";
import UnifiedShell from "@/components/layout/UnifiedShell";
import { Button } from "@/components/ui/button";
import VerifiedBadge from "@/components/ui/VerifiedBadge";
import { mockOpportunities } from "@/lib/mockData";
import { SECTORS, AFRICAN_COUNTRIES } from "@/constants";
import { Sector } from "@/types";
import { Search, Filter, MapPin, Calendar, Briefcase, TrendingUp, Star } from "lucide-react";
import { toast } from "sonner";

const OpportunitiesPage = () => {
  const [opportunities] = useState(mockOpportunities);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSector, setSelectedSector] = useState<Sector | "All">("All");
  const [selectedCountry, setSelectedCountry] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", "Buyer Request", "Distributor Wanted", "Tender Alert", "Trade Mission"];

  const filteredOpportunities = opportunities.filter((opp) => {
    const matchesSearch = opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          opp.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSector = selectedSector === "All" || opp.sector === selectedSector;
    const matchesCountry = selectedCountry === "All" || opp.buyerCountry === selectedCountry;
    const matchesCategory = selectedCategory === "All" || opp.category === selectedCategory;
    
    return matchesSearch && matchesSector && matchesCountry && matchesCategory;
  });

  const handleApply = (oppId: string, premiumOnly: boolean) => {
    if (premiumOnly) {
      toast.error("This opportunity is available for Premium members only", {
        description: "Upgrade to access exclusive opportunities",
      });
      return;
    }
    toast.success("Application submitted successfully!", {
      description: "The buyer will review your application soon",
    });
  };

  const handleSave = (oppId: string) => {
    console.log("Saved opportunity:", oppId);
    toast.success("Opportunity saved");
  };

  return (
    <UnifiedShell>
      <div className="min-h-screen bg-gray-50">
      
      <div className="pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Opportunities</h1>
            <p className="text-gray-600">Discover cross-border trade opportunities across Africa</p>
          </div>

          <div className="grid lg:grid-cols-4 gap-6">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1 space-y-4">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Filter className="w-5 h-5 text-agbc-blue" />
                  <h3 className="font-semibold text-gray-900">Filters</h3>
                </div>

                {/* Category Filter */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-agbc-blue focus:border-transparent text-sm"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Sector Filter */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sector</label>
                  <select
                    value={selectedSector}
                    onChange={(e) => setSelectedSector(e.target.value as Sector | "All")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-agbc-blue focus:border-transparent text-sm"
                  >
                    <option value="All">All Sectors</option>
                    {SECTORS.map((sector) => (
                      <option key={sector} value={sector}>{sector}</option>
                    ))}
                  </select>
                </div>

                {/* Country Filter */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                  <select
                    value={selectedCountry}
                    onChange={(e) => setSelectedCountry(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-agbc-blue focus:border-transparent text-sm"
                  >
                    <option value="All">All Countries</option>
                    {AFRICAN_COUNTRIES.map((country) => (
                      <option key={country} value={country}>{country}</option>
                    ))}
                  </select>
                </div>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setSelectedSector("All");
                    setSelectedCountry("All");
                    setSelectedCategory("All");
                    setSearchQuery("");
                  }}
                >
                  Clear Filters
                </Button>
              </div>

              {/* Stats */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Your Activity</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Applied</span>
                    <span className="font-bold text-agbc-blue">5</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Saved</span>
                    <span className="font-bold text-agbc-blue">12</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Matches</span>
                    <span className="font-bold text-agbc-green">3</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Opportunities List */}
            <div className="lg:col-span-3 space-y-6">
              {/* Search */}
              <div className="bg-white rounded-xl shadow-sm p-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search opportunities..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-agbc-blue focus:border-transparent"
                  />
                </div>
              </div>

              {/* Results Count */}
              <div className="flex justify-between items-center">
                <p className="text-gray-600">
                  <span className="font-semibold text-gray-900">{filteredOpportunities.length}</span> opportunities found
                </p>
              </div>

              {/* Opportunities Cards */}
              {filteredOpportunities.map((opp) => (
                <div key={opp.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden">
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span
                            className={`text-xs font-semibold px-3 py-1 rounded-full ${
                              opp.category === "Buyer Request"
                                ? "bg-blue-50 text-blue-700"
                                : opp.category === "Distributor Wanted"
                                ? "bg-green-50 text-green-700"
                                : opp.category === "Tender Alert"
                                ? "bg-purple-50 text-purple-700"
                                : "bg-amber-50 text-amber-700"
                            }`}
                          >
                            {opp.category}
                          </span>
                          {opp.premiumOnly && (
                            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-agbc-gold/10 text-agbc-gold flex items-center gap-1">
                              <Star className="w-3 h-3" />
                              Premium
                            </span>
                          )}
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                          {opp.title}
                          {opp.isVerified && <VerifiedBadge size="sm" />}
                        </h3>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSave(opp.id)}
                      >
                        <Star className="w-5 h-5" />
                      </Button>
                    </div>

                    {/* Buyer Info */}
                    <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Briefcase className="w-4 h-4" />
                        <span className="font-medium">{opp.buyerName}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{opp.buyerCountry}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>Posted {new Date(opp.createdAt).toLocaleDateString()}</span>
                      </div>
                      {opp.dealSize && (
                        <div className="flex items-center gap-1">
                          <TrendingUp className="w-4 h-4" />
                          <span className="font-medium text-agbc-green">{opp.dealSize}</span>
                        </div>
                      )}
                    </div>

                    {/* Description */}
                    <p className="text-gray-700 leading-relaxed mb-4">{opp.description}</p>

                    {/* Requirements */}
                    {opp.requirements && opp.requirements.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold text-gray-900 mb-2">Requirements:</h4>
                        <ul className="space-y-1">
                          {opp.requirements.map((req, idx) => (
                            <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-agbc-blue mt-1.5 flex-shrink-0"></div>
                              <span>{req}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-agbc-blue"></span>
                          {opp.sector}
                        </span>
                        <span>{opp.applicants} applicants</span>
                        {opp.deadline && (
                          <span className="text-red-600 font-medium">
                            Deadline: {new Date(opp.deadline).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      <Button
                        onClick={() => handleApply(opp.id, opp.premiumOnly)}
                        className="bg-agbc-blue hover:bg-agbc-blue-dark"
                      >
                        Apply Now
                      </Button>
                    </div>
                  </div>
                </div>
              ))}

              {filteredOpportunities.length === 0 && (
                <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                  <Briefcase className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No opportunities found</h3>
                  <p className="text-gray-600 mb-4">Try adjusting your filters or search query</p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedSector("All");
                      setSelectedCountry("All");
                      setSelectedCategory("All");
                      setSearchQuery("");
                    }}
                  >
                    Clear All Filters
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

export default OpportunitiesPage;
