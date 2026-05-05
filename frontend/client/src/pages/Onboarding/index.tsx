import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Step1BusinessInfo from './Step1BusinessInfo';
import Step2Operations from './Step2Operations';
import Step3Membership from './Step3Membership';
import Step4Review from './Step4Review';
import { fetchCountries, saveBusinessProfile, skipBusinessOnboarding } from '../../services/businessApi';

const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [countries, setCountries] = useState<{code: string, name: string}[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    companyName: '',
    description: '',
    websiteUrl: '',
    yearEstablished: '',
    employeeCount: '',
    annualRevenue: '',
    country: '',
    primarySector: '',
    additionalSectors: [] as string[],
    membershipTier: 'free',
    dp: null as File | null,
    coverPhoto: null as File | null,
  });

  useEffect(() => {
    // Fetch countries on load
    const loadCountries = async () => {
      try {
        const data = await fetchCountries();
        setCountries(data);
      } catch (err) {
        console.error("Failed to load countries:", err);
      }
    };
    loadCountries();
  }, []);

  const handleNext = async () => {
    // Optionally auto-save draft here
    setCurrentStep((prev) => Math.min(prev + 1, 4));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSkip = async () => {
    try {
      setIsSubmitting(true);
      await skipBusinessOnboarding();
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || "Failed to skip onboarding.");
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setError(null);
      // Build a FormData payload to support file uploads
      const payload = new FormData();
      payload.append('company_name', formData.companyName);
      payload.append('company_description', formData.description);
      payload.append('website_url', formData.websiteUrl);
      if (formData.yearEstablished) {
        payload.append('year_established', formData.yearEstablished.toString());
      }
      payload.append('employee_count', formData.employeeCount);
      payload.append('annual_revenue', formData.annualRevenue);
      payload.append('country', formData.country);
      payload.append('primary_sector', formData.primarySector);
      // JSONField needs to be stringified when sent via FormData
      payload.append('additional_sectors', JSON.stringify(formData.additionalSectors));
      payload.append('membership_tier', formData.membershipTier);
      payload.append('onboarding_completed', 'true');
      
      if (formData.dp) {
        payload.append('dp', formData.dp);
      }
      if (formData.coverPhoto) {
        payload.append('cover_photo', formData.coverPhoto);
      }

      await saveBusinessProfile(payload);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to complete profile.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] relative">
      <div className="absolute inset-0 bg-gradient-to-b from-orange-50/50 to-white pointer-events-none" />
      
      {/* Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-8 relative z-10 hidden sm:block">
        <div className="text-4xl shadow-sm inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white border border-gray-100 mb-6 transform -rotate-3 hover:rotate-0 transition-transform cursor-pointer">
          🌍
        </div>
        <h2 className="text-center text-3xl font-extrabold text-gray-900 tracking-tight">
          Welcome to AGBC
        </h2>
      </div>

      <div className="relative z-10 w-full px-4 sm:px-0">
        {error && (
          <div className="max-w-2xl mx-auto mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-3 animate-pulse">
            <span className="text-xl">⚠️</span> {error}
          </div>
        )}

        <div className="transition-all duration-300 ease-in-out">
          {currentStep === 1 && (
            <Step1BusinessInfo 
              formData={formData} 
              setFormData={setFormData} 
              onNext={handleNext} 
            />
          )}
          {currentStep === 2 && (
            <Step2Operations 
              formData={formData} 
              setFormData={setFormData} 
              onNext={handleNext} 
              onBack={handleBack} 
              countries={countries}
            />
          )}
          {currentStep === 3 && (
            <Step3Membership 
              formData={formData} 
              setFormData={setFormData} 
              onNext={handleNext} 
              onBack={handleBack} 
            />
          )}
          {currentStep === 4 && (
            <Step4Review 
              formData={formData} 
              onSubmit={handleSubmit} 
              onBack={handleBack} 
              isSubmitting={isSubmitting}
              countries={countries}
            />
          )}
        </div>

        {/* Skip button logic */}
        <div className="max-w-2xl mx-auto mt-8 text-center px-4">
          <p className="text-sm text-gray-500">
            In a rush? You can {" "}
            <button 
              onClick={handleSkip} 
              disabled={isSubmitting}
              className="font-semibold text-orange-600 hover:text-orange-500 hover:underline transition-colors disabled:opacity-50"
            >
              skip this for now
            </button> 
            {" "} and complete it later from your dashboard.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
