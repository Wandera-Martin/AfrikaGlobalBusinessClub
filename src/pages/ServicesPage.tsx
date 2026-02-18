import { useState } from "react";
import UnifiedShell from "@/components/layout/UnifiedShell";
import { Button } from "@/components/ui/button";
import { mockServices } from "@/lib/mockData";
import { getCurrentUser } from "@/lib/auth";
import { MembershipTier } from "@/types";
import { Check, Star } from "lucide-react";
import { toast } from "sonner";

const ServicesPage = () => {
  const user = getCurrentUser();
  const [services] = useState(mockServices);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", ...Array.from(new Set(services.map(s => s.category)))];

  const filteredServices = selectedCategory === "All"
    ? services
    : services.filter(s => s.category === selectedCategory);

  const canAccessService = (tierAccess: MembershipTier[]) => {
    return user && tierAccess.includes(user.membershipTier);
  };

  const handleBookService = (serviceId: string, tierAccess: MembershipTier[]) => {
    if (!canAccessService(tierAccess)) {
      toast.error("Upgrade your membership to access this service", {
        description: `This service requires ${tierAccess[0]} tier or higher`,
      });
      return;
    }
    toast.success("Service booking request sent!", {
      description: "Our team will contact you shortly",
    });
  };

  return (
    <UnifiedShell>
      <div className="min-h-screen bg-gray-50">
      
      <div className="pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Service Marketplace</h1>
            <p className="text-gray-600">Professional services to accelerate your export growth</p>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-3 mb-8">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  selectedCategory === category
                    ? 'bg-agbc-blue text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Upgrade Banner */}
          <div className="bg-gradient-to-r from-agbc-blue to-agbc-green rounded-xl p-6 mb-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold mb-2">Unlock Exclusive Services</h3>
                <p className="text-blue-100 mb-4">
                  Upgrade to Gold or Platinum to access premium services with exclusive discounts
                </p>
                <Button className="bg-white text-agbc-blue hover:bg-gray-100">
                  View Membership Plans
                </Button>
              </div>
              <Star className="w-24 h-24 text-agbc-gold opacity-50" />
            </div>
          </div>

          {/* Services Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => {
              const hasAccess = canAccessService(service.tierAccess);
              
              return (
                <div
                  key={service.id}
                  className={`bg-white rounded-xl shadow-sm overflow-hidden border-2 transition ${
                    hasAccess ? 'border-transparent hover:shadow-lg' : 'border-gray-200 opacity-75'
                  }`}
                >
                  <div className="p-6">
                    {/* Header */}
                    <div className="mb-4">
                      <div className="flex items-start justify-between mb-2">
                        <span className="inline-block px-3 py-1 bg-blue-50 text-agbc-blue text-xs font-semibold rounded-full">
                          {service.category}
                        </span>
                        {!hasAccess && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-50 text-agbc-gold text-xs font-semibold rounded-full">
                            <Star className="w-3 h-3" />
                            Premium
                          </span>
                        )}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{service.title}</h3>
                      <p className="text-sm text-gray-600 mb-3">{service.provider}</p>
                      <p className="text-gray-700 leading-relaxed">{service.description}</p>
                    </div>

                    {/* Deliverables */}
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-gray-900 mb-2">What's included:</h4>
                      <ul className="space-y-2">
                        {service.deliverables.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                            <Check className="w-4 h-4 text-agbc-green flex-shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Tier Access */}
                    <div className="mb-4 pb-4 border-b border-gray-100">
                      <p className="text-xs text-gray-500 mb-1">Available for:</p>
                      <div className="flex flex-wrap gap-2">
                        {service.tierAccess.map((tier) => (
                          <span
                            key={tier}
                            className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded"
                          >
                            {tier}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Price & CTA */}
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-3xl font-bold text-agbc-blue">{service.price}</p>
                        {user && hasAccess && user.membershipTier !== "Free" && (
                          <p className="text-xs text-agbc-green font-medium">
                            {user.membershipTier === "Silver" ? "10%" : user.membershipTier === "Gold" ? "20%" : "30%"} member discount applied
                          </p>
                        )}
                      </div>
                      <Button
                        onClick={() => handleBookService(service.id, service.tierAccess)}
                        className={hasAccess ? "bg-agbc-blue hover:bg-agbc-blue-dark" : ""}
                        variant={hasAccess ? "default" : "outline"}
                      >
                        {hasAccess ? "Book Now" : "Upgrade to Access"}
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredServices.length === 0 && (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No services found</h3>
              <p className="text-gray-600">Try selecting a different category</p>
            </div>
          )}
        </div>
      </div>
    </div>
    </UnifiedShell>
  );
};

export default ServicesPage;
