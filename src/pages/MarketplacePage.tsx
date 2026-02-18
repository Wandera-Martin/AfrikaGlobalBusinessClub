import { useState } from "react";
import UnifiedShell from "@/components/layout/UnifiedShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { mockMarketplaceProducts, mockSupplierProfiles, mockRFQs, marketplaceCategories } from "@/lib/marketplaceMockData";
import { Search, Filter, Star, ShoppingCart, MessageSquare, TrendingUp, Award, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const MarketplacePage = () => {
  const [view, setView] = useState<"products" | "suppliers" | "rfqs">("products");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filteredProducts = mockMarketplaceProducts.filter(p => 
    (selectedCategory === "all" || p.category === selectedCategory) &&
    (searchQuery === "" || p.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <UnifiedShell>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Banner */}
        <div className="bg-gradient-to-r from-agbc-blue via-agbc-blue-dark to-agbc-green text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-4xl font-bold mb-3">Afrindex Marketplace</h1>
            <p className="text-xl text-blue-100 mb-6">Africa's Premier B2B Commerce Platform</p>
            
            {/* Search Bar */}
            <div className="max-w-3xl">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search products, suppliers, or categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 py-6 text-lg bg-white"
                />
                <Button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-agbc-green hover:bg-agbc-green-dark">
                  Search
                </Button>
              </div>
            </div>

            {/* View Tabs */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setView("products")}
                className={`px-6 py-2 rounded-lg font-medium transition ${
                  view === "products" ? 'bg-white text-agbc-blue' : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                Products
              </button>
              <button
                onClick={() => setView("suppliers")}
                className={`px-6 py-2 rounded-lg font-medium transition ${
                  view === "suppliers" ? 'bg-white text-agbc-blue' : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                Suppliers
              </button>
              <button
                onClick={() => setView("rfqs")}
                className={`px-6 py-2 rounded-lg font-medium transition flex items-center gap-2 ${
                  view === "rfqs" ? 'bg-white text-agbc-blue' : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                RFQs
                <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">12</span>
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Categories */}
          <div className="mb-8">
            <h3 className="font-semibold text-gray-900 mb-4">Categories</h3>
            <div className="flex gap-3 overflow-x-auto pb-2">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition ${
                  selectedCategory === "all" ? 'bg-agbc-blue text-white' : 'bg-white text-gray-700 hover:bg-gray-50 border'
                }`}
              >
                All Categories
              </button>
              {marketplaceCategories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition flex items-center gap-2 ${
                    selectedCategory === cat.name ? 'bg-agbc-blue text-white' : 'bg-white text-gray-700 hover:bg-gray-50 border'
                  }`}
                >
                  <span>{cat.icon}</span>
                  {cat.name}
                  <span className="text-xs opacity-75">({cat.productCount})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Products View */}
          {view === "products" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Products</h2>
                <div className="flex items-center gap-3">
                  <span className="text-gray-600">{filteredProducts.length} products found</span>
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Filters
                  </Button>
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map(product => (
                  <div key={product.id} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition overflow-hidden">
                    <div className="relative">
                      <img src={product.images[0]} alt={product.name} className="w-full h-48 object-cover" />
                      {product.certifications.length > 0 && (
                        <div className="absolute top-2 right-2 bg-agbc-green text-white px-2 py-1 rounded-lg text-xs font-semibold flex items-center gap-1">
                          <Award className="w-3 h-3" />
                          Certified
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <div className="text-xs text-gray-500 mb-1">{product.category}</div>
                      <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{product.description}</p>
                      
                      <div className="flex items-baseline gap-2 mb-3">
                        <div className="text-2xl font-bold text-agbc-blue">
                          ${product.pricePerUnit}
                        </div>
                        <div className="text-sm text-gray-500">/ unit</div>
                      </div>

                      <div className="text-xs text-gray-500 mb-4">
                        MOQ: {product.minOrderQuantity} units · {product.leadTime}
                      </div>

                      <div className="flex gap-2 text-xs text-gray-600 mb-4">
                        <div className="flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" />
                          {product.views} views
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageSquare className="w-3 h-3" />
                          {product.inquiries} inquiries
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button 
                          className="flex-1 bg-agbc-blue hover:bg-agbc-blue-dark"
                          onClick={() => toast.success("Contact request sent to supplier")}
                        >
                          Contact Supplier
                        </Button>
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => toast.success("Added to cart")}
                        >
                          <ShoppingCart className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Suppliers View */}
          {view === "suppliers" && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Verified Suppliers</h2>
              <div className="space-y-6">
                {mockSupplierProfiles.map(supplier => (
                  <div key={supplier.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden">
                    <div className="h-32 bg-cover bg-center" style={{ backgroundImage: `url(${supplier.coverImage})` }}>
                      <div className="h-full bg-gradient-to-r from-black/50 to-transparent"></div>
                    </div>
                    <div className="p-6 -mt-16 relative">
                      <div className="flex items-start gap-4">
                        <img src={supplier.logo} alt={supplier.companyName} className="w-24 h-24 rounded-lg border-4 border-white shadow-lg" />
                        <div className="flex-1 mt-16">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                {supplier.companyName}
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                  supplier.tier === "Premium" ? 'bg-purple-100 text-purple-700' :
                                  supplier.tier === "Gold" ? 'bg-yellow-100 text-yellow-700' :
                                  'bg-blue-100 text-blue-700'
                                }`}>
                                  {supplier.tier} Supplier
                                </span>
                              </h3>
                              <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                                <MapPin className="w-4 h-4" />
                                {supplier.country}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="flex items-center gap-1 mb-1">
                                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                                <span className="font-bold text-lg">{supplier.rating}</span>
                                <span className="text-sm text-gray-500">({supplier.reviews})</span>
                              </div>
                              <div className="text-xs text-gray-500">{supplier.responseRate}% response rate</div>
                            </div>
                          </div>

                          <p className="text-gray-700 mt-3 mb-4">{supplier.description}</p>

                          <div className="flex flex-wrap gap-2 mb-4">
                            {supplier.verificationBadges.map((badge, idx) => (
                              <span key={idx} className="px-3 py-1 bg-green-50 text-green-700 text-xs rounded-full font-medium">
                                {badge}
                              </span>
                            ))}
                          </div>

                          <div className="grid grid-cols-4 gap-4 py-4 border-t border-b border-gray-100 mb-4">
                            <div>
                              <div className="text-2xl font-bold text-agbc-blue">{supplier.yearsInBusiness}</div>
                              <div className="text-xs text-gray-500">Years in Business</div>
                            </div>
                            <div>
                              <div className="text-2xl font-bold text-agbc-blue">{supplier.totalProducts}</div>
                              <div className="text-xs text-gray-500">Products</div>
                            </div>
                            <div>
                              <div className="text-2xl font-bold text-agbc-blue">{supplier.totalOrders}</div>
                              <div className="text-xs text-gray-500">Orders</div>
                            </div>
                            <div>
                              <div className="text-2xl font-bold text-agbc-blue">{supplier.responseTime}</div>
                              <div className="text-xs text-gray-500">Response Time</div>
                            </div>
                          </div>

                          <div className="flex gap-3">
                            <Link to={`/marketplace/supplier/${supplier.id}`} className="flex-1">
                              <Button className="w-full bg-agbc-blue hover:bg-agbc-blue-dark">
                                View Storefront
                              </Button>
                            </Link>
                            <Button variant="outline">
                              <MessageSquare className="w-4 h-4 mr-2" />
                              Contact
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* RFQs View */}
          {view === "rfqs" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Request for Quotations (RFQs)</h2>
                <Button className="bg-agbc-green hover:bg-agbc-green-dark">
                  Post Your RFQ
                </Button>
              </div>

              <div className="space-y-4">
                {mockRFQs.map(rfq => (
                  <div key={rfq.id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full">
                            {rfq.category}
                          </span>
                          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                            rfq.status === "Open" ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-700'
                          }`}>
                            {rfq.status}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{rfq.title}</h3>
                        <p className="text-gray-700 mb-4">{rfq.description}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-4 mb-4 text-sm">
                      <div>
                        <div className="text-gray-500 mb-1">Target Quantity</div>
                        <div className="font-semibold">{rfq.targetQuantity.toLocaleString()} units</div>
                      </div>
                      {rfq.targetPrice && (
                        <div>
                          <div className="text-gray-500 mb-1">Target Price</div>
                          <div className="font-semibold">${rfq.targetPrice.toLocaleString()}</div>
                        </div>
                      )}
                      <div>
                        <div className="text-gray-500 mb-1">Delivery Location</div>
                        <div className="font-semibold">{rfq.deliveryLocation}</div>
                      </div>
                      <div>
                        <div className="text-gray-500 mb-1">Deadline</div>
                        <div className="font-semibold text-red-600">{new Date(rfq.deadline).toLocaleDateString()}</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="text-sm text-gray-600">
                        {rfq.responses} suppliers responded · Posted {new Date(rfq.createdAt).toLocaleDateString()}
                      </div>
                      <Button onClick={() => toast.success("Quote submission form opened")}>
                        Submit Quote
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </UnifiedShell>
  );
};

export default MarketplacePage;
