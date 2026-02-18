import UnifiedShell from "@/components/layout/UnifiedShell";
import { Button } from "@/components/ui/button";
import TierBadge from "@/components/ui/TierBadge";
import VerifiedBadge from "@/components/ui/VerifiedBadge";
import TradeReadinessMeter from "@/components/ui/TradeReadinessMeter";
import { getCurrentCompany, getCurrentUser } from "@/lib/auth";
import { mockProducts, mockCertifications } from "@/lib/mockData";
import { Link } from "react-router-dom";
import { Globe, MapPin, Calendar, MessageCircle, UserPlus, ExternalLink, Award, Package, FileCheck } from "lucide-react";

const ProfilePage = () => {
  const user = getCurrentUser();
  const company = getCurrentCompany();

  return (
    <UnifiedShell>
      <div className="min-h-screen bg-gray-50">
      
      <div className="pt-20 pb-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Profile Header */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
            {/* Cover Pattern */}
            <div className="h-32 bg-gradient-to-r from-agbc-blue via-agbc-blue-dark to-agbc-green"></div>
            
            <div className="px-8 pb-8">
              <div className="flex flex-col md:flex-row gap-6 -mt-16">
                {/* Profile Picture */}
                <div className="w-32 h-32 bg-gradient-to-br from-agbc-blue to-agbc-green rounded-2xl border-4 border-white shadow-lg flex items-center justify-center text-white text-4xl font-bold flex-shrink-0">
                  {company?.companyName?.charAt(0) || "C"}
                </div>

                {/* Company Info */}
                <div className="flex-1 mt-16 md:mt-0">
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-3xl font-bold text-gray-900">
                          {company?.companyName || "Your Company"}
                        </h1>
                        {user?.isVerified && <VerifiedBadge size="lg" />}
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-3">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{company?.country || "Country"}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Package className="w-4 h-4" />
                          <span>{company?.sector || "Sector"}</span>
                        </div>
                        {company?.yearEstablished && (
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>Est. {company.yearEstablished}</span>
                          </div>
                        )}
                        {company?.website && (
                          <a
                            href={`https://${company.website}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-agbc-blue hover:underline"
                          >
                            <Globe className="w-4 h-4" />
                            <span>Website</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                      <TierBadge tier={user?.membershipTier || "Free"} />
                    </div>

                    <div className="flex gap-2">
                      <Link to="/messages">
                        <Button className="bg-agbc-blue hover:bg-agbc-blue-dark">
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Message
                        </Button>
                      </Link>
                      <Button variant="outline">
                        <UserPlus className="w-4 h-4 mr-2" />
                        Connect
                      </Button>
                    </div>
                  </div>

                  <p className="text-gray-700 leading-relaxed mb-4">
                    {company?.description || "Add a description to tell buyers about your business..."}
                  </p>

                  {company?.exportMarkets && company.exportMarkets.length > 0 && (
                    <div className="mb-4">
                      <h3 className="text-sm font-semibold text-gray-700 mb-2">Export Markets:</h3>
                      <div className="flex flex-wrap gap-2">
                        {company.exportMarkets.map((market, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-blue-50 text-agbc-blue text-sm rounded-full border border-blue-200"
                          >
                            {market}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Products Section */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Products & Services</h2>
                  <Button variant="outline" size="sm">Add Product</Button>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {mockProducts.map((product) => (
                    <div key={product.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-40 object-cover"
                      />
                      <div className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-gray-900">{product.name}</h3>
                          {product.certificationStatus && (
                            <FileCheck className="w-5 h-5 text-agbc-green flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {mockProducts.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No products added yet</p>
                    <Button variant="link" className="mt-2">Add your first product</Button>
                  </div>
                )}
              </div>

              {/* Certifications Section */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Certifications</h2>
                  <Button variant="outline" size="sm">Upload Certificate</Button>
                </div>

                <div className="space-y-3">
                  {mockCertifications.map((cert) => (
                    <div
                      key={cert.id}
                      className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                    >
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        cert.verifiedStatus ? 'bg-green-50' : 'bg-gray-50'
                      }`}>
                        <Award className={`w-6 h-6 ${cert.verifiedStatus ? 'text-agbc-green' : 'text-gray-400'}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{cert.certificateName}</h3>
                        <p className="text-sm text-gray-600">{cert.issuingOrganization}</p>
                        <p className="text-xs text-gray-500">Issued: {new Date(cert.issueDate).toLocaleDateString()}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {cert.verifiedStatus && (
                          <span className="text-xs font-medium text-agbc-green bg-green-50 px-2 py-1 rounded">
                            Verified
                          </span>
                        )}
                        <Button variant="ghost" size="sm">View</Button>
                      </div>
                    </div>
                  ))}
                </div>

                {mockCertifications.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <Award className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No certifications uploaded</p>
                    <Button variant="link" className="mt-2">Upload your first certificate</Button>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Trade Readiness */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Trade Readiness</h3>
                <TradeReadinessMeter score={company?.tradeReadinessScore || 25} />
                <div className="mt-4 space-y-2">
                  <div className="text-sm">
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-600">Profile</span>
                      <span className="font-medium">40%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div className="bg-agbc-blue h-1.5 rounded-full" style={{ width: '40%' }}></div>
                    </div>
                  </div>
                  <div className="text-sm">
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-600">Certifications</span>
                      <span className="font-medium">60%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div className="bg-agbc-gold h-1.5 rounded-full" style={{ width: '60%' }}></div>
                    </div>
                  </div>
                  <div className="text-sm">
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-600">Documentation</span>
                      <span className="font-medium">20%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div className="bg-red-500 h-1.5 rounded-full" style={{ width: '20%' }}></div>
                    </div>
                  </div>
                </div>
                <Button variant="link" className="w-full mt-3 text-agbc-blue p-0">
                  View Recommendations →
                </Button>
              </div>

              {/* Profile Strength */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Profile Strength</h3>
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Completion</span>
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
                    <div className="w-2 h-2 rounded-full bg-agbc-green"></div>
                    Company info added
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                    Upload company logo
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <div className="w-2 h-2 rounded-full bg-agbc-green"></div>
                    Products listed
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                    Add export markets
                  </div>
                </div>
              </div>

              {/* Upgrade CTA */}
              <div className="bg-gradient-to-br from-agbc-blue to-agbc-green rounded-xl shadow-sm p-6 text-white">
                <h3 className="font-bold text-lg mb-2">Unlock Premium Features</h3>
                <p className="text-sm text-blue-100 mb-4">
                  Upgrade to Gold and get verified badge, priority placement, and 20% off services
                </p>
                <Button className="w-full bg-white text-agbc-blue hover:bg-gray-100">
                  Upgrade Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </UnifiedShell>
  );
};

export default ProfilePage;
