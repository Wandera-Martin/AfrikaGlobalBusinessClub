import { useState } from "react";
import UnifiedShell from "@/components/layout/UnifiedShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { mockCompanyListings, mockSectorClassifications } from "@/lib/indexMockData";
import { Search, MapPin, Globe, Phone, Mail, Star, TrendingUp, Award, ExternalLink, Filter } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const IndexPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSector, setSelectedSector] = useState("all");
  const [selectedCountry, setSelectedCountry] = useState("all");
  const [selectedTier, setSelectedTier] = useState("all");

  const countries = ["all", ...new Set(mockCompanyListings.map(c => c.country))];

  const filteredListings = mockCompanyListings.filter(listing => {
    const matchesSearch = searchQuery === "" || 
      listing.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.keywords.some(k => k.includes(searchQuery.toLowerCase()));
    
    const matchesSector = selectedSector === "all" || listing.sector === selectedSector;
    const matchesCountry = selectedCountry === "all" || listing.country === selectedCountry;
    const matchesTier = selectedTier === "all" || listing.rankingTier === selectedTier;

    return matchesSearch && matchesSector && matchesCountry && matchesTier;
  });

  return (
    <UnifiedShell>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Banner */}
        <div className="bg-gradient-to-r from-agbc-green via-agbc-green-dark to-agbc-blue text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-4xl font-bold mb-3">Afrindex Directory</h1>
            <p className="text-xl text-green-100 mb-6">Africa's Verified Business Index - Discover Export-Ready Companies</p>
            
            {/* Search Bar */}
            <div className="max-w-3xl">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search companies, products, or services..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 py-6 text-lg bg-white"
                />
                <Button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-agbc-blue hover:bg-agbc-blue-dark">
                  Search
                </Button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-4 gap-6 mt-8">
              <div className="bg-white/10 backdrop-blur rounded-lg p-4 text-center">
                <div className="text-3xl font-bold">{mockCompanyListings.length}</div>
                <div className="text-sm text-green-100">Listed Companies</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-lg p-4 text-center">
                <div className="text-3xl font-bold">{mockSectorClassifications.length}</div>
                <div className="text-sm text-green-100">Sectors</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-lg p-4 text-center">
                <div className="text-3xl font-bold">{countries.length - 1}</div>
                <div className="text-sm text-green-100">Countries</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-lg p-4 text-center">
                <div className="text-3xl font-bold">92%</div>
                <div className="text-sm text-green-100">Verified Rate</div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid lg:grid-cols-4 gap-6">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm p-6 sticky top-20">
                <div className="flex items-center gap-2 mb-6">
                  <Filter className="w-5 h-5 text-agbc-green" />
                  <h3 className="font-bold text-gray-900">Refine Search</h3>
                </div>

                {/* Sector Filter */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Sector</label>
                  <select
                    value={selectedSector}
                    onChange={(e) => setSelectedSector(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-agbc-green"
                  >
                    <option value="all">All Sectors</option>
                    {mockSectorClassifications.map(sector => (
                      <option key={sector.id} value={sector.name}>
                        {sector.icon} {sector.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Country Filter */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Country</label>
                  <select
                    value={selectedCountry}
                    onChange={(e) => setSelectedCountry(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-agbc-green"
                  >
                    {countries.map(country => (
                      <option key={country} value={country}>
                        {country === "all" ? "All Countries" : country}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Ranking Tier Filter */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Ranking</label>
                  <select
                    value={selectedTier}
                    onChange={(e) => setSelectedTier(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-agbc-green"
                  >
                    <option value="all">All Tiers</option>
                    <option value="Elite">Elite (90+)</option>
                    <option value="Premium">Premium (80-89)</option>
                    <option value="Featured">Featured (70-79)</option>
                    <option value="Standard">Standard (below 70)</option>
                  </select>
                </div>

                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedSector("all");
                    setSelectedCountry("all");
                    setSelectedTier("all");
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            </div>

            {/* Listings */}
            <div className="lg:col-span-3">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Company Listings</h2>
                  <p className="text-gray-600 mt-1">{filteredListings.length} companies found</p>
                </div>
                <select className="px-4 py-2 border border-gray-300 rounded-lg text-sm">
                  <option>Highest Ranking</option>
                  <option>Most Viewed</option>
                  <option>Recently Updated</option>
                  <option>Alphabetical</option>
                </select>
              </div>

              <div className="space-y-6">
                {filteredListings.map(listing => (
                  <div key={listing.id} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition overflow-hidden">
                    {/* Cover Image */}
                    <div className="h-32 bg-cover bg-center relative" style={{ backgroundImage: `url(${listing.coverImage})` }}>
                      <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent"></div>
                      {listing.rankingTier && (
                        <div className={`absolute top-3 right-3 px-3 py-1 rounded-lg text-xs font-bold backdrop-blur ${
                          listing.rankingTier === "Elite" ? 'bg-purple-500 text-white' :
                          listing.rankingTier === "Premium" ? 'bg-yellow-500 text-white' :
                          listing.rankingTier === "Featured" ? 'bg-blue-500 text-white' :
                          'bg-gray-500 text-white'
                        }`}>
                          {listing.rankingTier}
                        </div>
                      )}
                    </div>

                    <div className="p-6 -mt-12 relative">
                      <div className="flex items-start gap-4">
                        {/* Logo */}
                        <img 
                          src={listing.logo} 
                          alt={listing.companyName}
                          className="w-20 h-20 rounded-lg border-4 border-white shadow-lg flex-shrink-0"
                        />

                        {/* Company Info */}
                        <div className="flex-1 mt-12">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                {listing.companyName}
                                {listing.verified && (
                                  <Award className="w-5 h-5 text-agbc-green" />
                                )}
                              </h3>
                              <div className="text-sm text-gray-600 mt-1">{listing.tagline}</div>
                            </div>
                            <div className="text-right">
                              <div className="flex items-center gap-1 mb-1">
                                <TrendingUp className="w-4 h-4 text-agbc-green" />
                                <span className="font-bold text-lg text-agbc-green">{listing.rankingScore}</span>
                              </div>
                              <div className="text-xs text-gray-500">Ranking Score</div>
                            </div>
                          </div>

                          <p className="text-gray-700 mb-4 line-clamp-2">{listing.description}</p>

                          {/* Key Info Grid */}
                          <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
                            <div className="flex items-center gap-2 text-gray-600">
                              <MapPin className="w-4 h-4 text-agbc-blue" />
                              <span>{listing.city}, {listing.country}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                              <Globe className="w-4 h-4 text-agbc-blue" />
                              <a href={`https://${listing.website}`} target="_blank" rel="noopener noreferrer" className="hover:text-agbc-blue">
                                {listing.website}
                              </a>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                              <Star className="w-4 h-4 text-agbc-blue" />
                              <span>Est. {listing.foundedYear}</span>
                            </div>
                          </div>

                          {/* Sector & Industries */}
                          <div className="flex flex-wrap gap-2 mb-4">
                            <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs rounded-full font-medium">
                              {listing.sector}
                            </span>
                            {listing.industries.slice(0, 2).map((ind, idx) => (
                              <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                                {ind}
                              </span>
                            ))}
                          </div>

                          {/* Certifications */}
                          {listing.certifications.length > 0 && (
                            <div className="mb-4">
                              <div className="text-xs font-semibold text-gray-700 mb-2">Certifications:</div>
                              <div className="flex flex-wrap gap-2">
                                {listing.certifications.slice(0, 4).map((cert, idx) => (
                                  <span key={idx} className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded font-medium flex items-center gap-1">
                                    <Award className="w-3 h-3" />
                                    {cert}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Stats */}
                          <div className="grid grid-cols-3 gap-4 py-3 border-t border-gray-100 mb-4">
                            <div>
                              <div className="text-lg font-bold text-agbc-blue">{listing.views.toLocaleString()}</div>
                              <div className="text-xs text-gray-500">Profile Views</div>
                            </div>
                            <div>
                              <div className="text-lg font-bold text-agbc-blue">{listing.inquiries}</div>
                              <div className="text-xs text-gray-500">Inquiries</div>
                            </div>
                            <div>
                              <div className="text-lg font-bold text-agbc-blue">{listing.exportMarkets.length}</div>
                              <div className="text-xs text-gray-500">Export Markets</div>
                            </div>
                          </div>

                          {/* CTA Buttons */}
                          <div className="flex gap-3">
                            <Link to={`/index/company/${listing.slug}`} className="flex-1">
                              <Button className="w-full bg-agbc-green hover:bg-agbc-green-dark">
                                View Full Profile
                              </Button>
                            </Link>
                            <Button 
                              variant="outline"
                              onClick={() => toast.success("Contact information revealed")}
                            >
                              <Mail className="w-4 h-4 mr-2" />
                              Contact
                            </Button>
                            <Button 
                              variant="outline"
                              onClick={() => window.open(`https://${listing.website}`, '_blank')}
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredListings.length === 0 && (
                <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                  <Search className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No companies found</h3>
                  <p className="text-gray-600 mb-4">Try adjusting your search or filters</p>
                  <Button variant="outline" onClick={() => {
                    setSearchQuery("");
                    setSelectedSector("all");
                    setSelectedCountry("all");
                    setSelectedTier("all");
                  }}>
                    Clear All Filters
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* CTA Banner */}
          <div className="mt-12 bg-gradient-to-r from-agbc-green to-agbc-blue rounded-xl p-8 text-white text-center">
            <h3 className="text-2xl font-bold mb-3">Is your company listed?</h3>
            <p className="text-green-100 mb-6 max-w-2xl mx-auto">
              Claim your profile or create a new listing to reach international buyers and increase your visibility across Africa.
            </p>
            <div className="flex gap-4 justify-center">
              <Button className="bg-white text-agbc-green hover:bg-gray-100">
                Claim Your Profile
              </Button>
              <Button variant="outline" className="text-white border-white hover:bg-white/10">
                Create New Listing
              </Button>
            </div>
          </div>
        </div>
      </div>
    </UnifiedShell>
  );
};

export default IndexPage;
