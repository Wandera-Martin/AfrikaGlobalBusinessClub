import React from 'react';

interface Step4Props {
  formData: any;
  onSubmit: () => void;
  onBack: () => void;
  isSubmitting: boolean;
  countries: { code: string; name: string }[];
}

const Step4Review: React.FC<Step4Props> = ({ formData, onSubmit, onBack, isSubmitting, countries }) => {
  const countryName = countries.find(c => c.code === formData.country)?.name || formData.country;

  return (
    <div className="w-full max-w-2xl mx-auto p-10 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:rounded-3xl relative overflow-hidden">
      
      {/* Progress Bar */}
      <div className="flex items-center justify-between mb-8">
        <span className="text-sm font-medium text-gray-500">Step 4 of 4</span>
        <span className="text-sm font-bold text-green-600">100%</span>
      </div>
      <div className="w-full bg-gray-100 h-1.5 rounded-full mb-10 overflow-hidden">
        <div className="bg-green-500 h-1.5 rounded-full w-full" />
      </div>

      <div className="text-center mb-10">
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl shadow-sm border-4 border-white ring-1 ring-green-50">
          ✓
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Review your Profile</h2>
        <p className="text-gray-500">Please review your details before completing onboarding.</p>
      </div>

      <div className="space-y-6 bg-gray-50 rounded-2xl p-6 border border-gray-100 mb-10">
        <div>
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">1. Business Information</h3>
          <div className="grid grid-cols-2 gap-y-3 text-sm">
            <span className="text-gray-500">Company Name:</span>
            <span className="font-semibold text-gray-900 text-right">{formData.companyName}</span>
            <span className="text-gray-500">Website:</span>
            <span className="font-medium text-gray-900 text-right">{formData.websiteUrl || '-'}</span>
            <span className="text-gray-500">Founded:</span>
            <span className="font-medium text-gray-900 text-right">{formData.yearEstablished || '-'}</span>
          </div>
        </div>
        <hr className="border-gray-200" />
        <div>
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">2. Operations</h3>
          <div className="grid grid-cols-2 gap-y-3 text-sm">
            <span className="text-gray-500">Country:</span>
            <span className="font-semibold text-gray-900 text-right flex items-center justify-end gap-1">🌍 {countryName}</span>
            <span className="text-gray-500">Primary Sector:</span>
            <span className="font-medium text-gray-900 text-right">{formData.primarySector || '-'}</span>
          </div>
        </div>
        <hr className="border-gray-200" />
        <div>
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">3. Membership</h3>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Selected Tier:</span>
            <span className="inline-flex px-3 py-1 rounded-full bg-orange-100 text-orange-800 font-bold text-sm uppercase tracking-wide">
              {formData.membershipTier}
            </span>
          </div>
        </div>
      </div>

      <div className="pt-2 flex items-center justify-between">
        <button 
          type="button" 
          onClick={onBack}
          disabled={isSubmitting}
          className="text-gray-500 hover:text-gray-900 font-medium transition-colors flex items-center gap-1 disabled:opacity-50"
        >
          <span className="text-xl leading-none">←</span> Edit Details
        </button>
        
        <button 
          onClick={onSubmit}
          disabled={isSubmitting}
          className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-all duration-300 transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-wait flex items-center gap-2 shadow-lg shadow-green-600/20"
        >
          {isSubmitting ? 'Saving Profile...' : 'Complete Setup ✓'}
        </button>
      </div>

    </div>
  );
};

export default Step4Review;
