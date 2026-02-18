import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { getCurrentCompany, updateCompanyProfile, updateMembershipTier } from "@/lib/auth";
import { SECTORS, AFRICAN_COUNTRIES, MEMBERSHIP_TIERS } from "@/constants";
import { Sector, MembershipTier } from "@/types";
import { ChevronRight, ChevronLeft, Check } from "lucide-react";

const OnboardingPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    companyName: "",
    sector: "Agriculture" as Sector,
    country: "",
    description: "",
    website: "",
    yearEstablished: "",
    membershipTier: "Free" as MembershipTier,
  });

  const totalSteps = 4;

  const handleNext = () => {
    if (step === 1 && !formData.companyName) {
      toast.error("Please enter your company name");
      return;
    }
    if (step === 2 && !formData.country) {
      toast.error("Please select your country");
      return;
    }
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    updateCompanyProfile({
      companyName: formData.companyName,
      sector: formData.sector,
      country: formData.country,
      description: formData.description,
      website: formData.website,
      yearEstablished: formData.yearEstablished ? parseInt(formData.yearEstablished) : undefined,
      profileCompletion: 40,
      tradeReadinessScore: 25,
    });
    
    updateMembershipTier(formData.membershipTier);
    
    toast.success("Profile created successfully! Welcome to AGBC!");
    navigate("/dashboard");
  };

  const progress = (step / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-agbc-blue via-agbc-blue-dark to-agbc-green flex items-center justify-center px-4 py-8">
      <div className="max-w-2xl w-full">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-white font-medium">Step {step} of {totalSteps}</span>
            <span className="text-blue-100">{Math.round(progress)}% Complete</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <div
              className="bg-white h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Step 1: Company Info */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-agbc-blue mb-2">Tell us about your business</h2>
                <p className="text-gray-600">Let's start with the basics</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Name *
                </label>
                <Input
                  placeholder="e.g., Okafor Agro Exports"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Description
                </label>
                <textarea
                  placeholder="Brief description of what your company does..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-agbc-blue focus:border-transparent"
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Website (Optional)
                  </label>
                  <Input
                    placeholder="www.yourcompany.com"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Year Established
                  </label>
                  <Input
                    type="number"
                    placeholder="2020"
                    value={formData.yearEstablished}
                    onChange={(e) => setFormData({ ...formData, yearEstablished: e.target.value })}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Location & Sector */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-agbc-blue mb-2">Where do you operate?</h2>
                <p className="text-gray-600">Help buyers find you</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country *
                </label>
                <select
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-agbc-blue focus:border-transparent"
                >
                  <option value="">Select your country</option>
                  {AFRICAN_COUNTRIES.map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Primary Sector *
                </label>
                <select
                  value={formData.sector}
                  onChange={(e) => setFormData({ ...formData, sector: e.target.value as Sector })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-agbc-blue focus:border-transparent"
                >
                  {SECTORS.map((sector) => (
                    <option key={sector} value={sector}>
                      {sector}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Step 3: Membership Tier */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-agbc-blue mb-2">Choose your membership</h2>
                <p className="text-gray-600">You can upgrade anytime</p>
              </div>

              <div className="space-y-4">
                {MEMBERSHIP_TIERS.map((tier) => (
                  <button
                    key={tier.tier}
                    onClick={() => setFormData({ ...formData, membershipTier: tier.tier })}
                    className={`w-full p-4 rounded-xl border-2 text-left transition ${
                      formData.membershipTier === tier.tier
                        ? "border-agbc-blue bg-blue-50"
                        : "border-gray-200 hover:border-agbc-blue/50"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-lg">{tier.tier}</h3>
                          <span className="text-sm font-semibold text-agbc-blue">{tier.price}</span>
                        </div>
                        <ul className="space-y-1">
                          {tier.features.slice(0, 3).map((feature, idx) => (
                            <li key={idx} className="text-sm text-gray-600 flex items-center gap-2">
                              <Check className="w-4 h-4 text-agbc-green" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          formData.membershipTier === tier.tier
                            ? "border-agbc-blue bg-agbc-blue"
                            : "border-gray-300"
                        }`}
                      >
                        {formData.membershipTier === tier.tier && (
                          <Check className="w-4 h-4 text-white" />
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Confirmation */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-agbc-blue mb-2">You're all set!</h2>
                <p className="text-gray-600">Review your information and start connecting</p>
              </div>

              <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                <div>
                  <div className="text-sm text-gray-500 mb-1">Company Name</div>
                  <div className="font-semibold">{formData.companyName}</div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Country</div>
                    <div className="font-semibold">{formData.country}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Sector</div>
                    <div className="font-semibold">{formData.sector}</div>
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">Membership</div>
                  <div className="font-semibold">{formData.membershipTier}</div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="text-sm text-agbc-blue">
                  <strong>Next steps:</strong> Complete your profile, upload certifications, and start connecting
                  with buyers across Africa!
                </p>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t">
            <Button
              variant="outline"
              onClick={() => setStep(step - 1)}
              disabled={step === 1}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </Button>
            <Button
              onClick={handleNext}
              className="bg-agbc-blue hover:bg-agbc-blue-dark text-white flex items-center gap-2"
            >
              {step === totalSteps ? "Complete Setup" : "Continue"}
              {step < totalSteps && <ChevronRight className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
