import React from 'react';

interface Step3Props {
  formData: any;
  setFormData: (data: any) => void;
  onNext: () => void;
  onBack: () => void;
}

const TIERS = [
  {
    id: 'free',
    name: 'Free Tier',
    price: '$0',
    description: 'Perfect for getting your business started on the platform.',
    features: ['Basic Profile Listing', 'Standard Support', 'Access to Community Forum']
  },
  {
    id: 'pro',
    name: 'Professional',
    price: '$29/mo',
    description: 'Advanced tools to grow your operations.',
    features: ['Verified Badge', 'Priority Support', 'Access to Premium Network', 'Analytics Dashboard']
  },
  {
    id: 'business',
    name: 'Business',
    price: '$99/mo',
    description: 'For established companies looking to scale.',
    features: ['Everything in Pro', 'B2B Matchmaking', 'Dedicated Account Manager', 'Custom API Access']
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 'Custom',
    description: 'Bespoke solutions for large organizations.',
    features: ['Everything in Business', 'White-glove Onboarding', 'SLA Guarantee', 'Board Member Access']
  }
];

const Step3Membership: React.FC<Step3Props> = ({ formData, setFormData, onNext, onBack }) => {
  const handleSelect = (tierId: string) => {
    setFormData({ ...formData, membershipTier: tierId });
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-10 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:rounded-3xl relative overflow-hidden">
      
      {/* Progress Bar */}
      <div className="flex items-center justify-between mb-8">
        <span className="text-sm font-medium text-gray-500">Step 3 of 4</span>
        <span className="text-sm font-bold text-orange-600">75%</span>
      </div>
      <div className="w-full bg-gray-100 h-1.5 rounded-full mb-10 overflow-hidden">
        <div className="bg-orange-600 h-1.5 rounded-full w-3/4 transition-all duration-500 ease-out" />
      </div>

      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Select your Membership</h2>
        <p className="text-gray-500 max-w-xl mx-auto">Choose the tier that best fits your company's needs right now. You can always upgrade later.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {TIERS.map((tier) => {
          const isSelected = formData.membershipTier === tier.id;
          return (
            <div 
              key={tier.id}
              onClick={() => handleSelect(tier.id)}
              className={`relative p-6 rounded-2xl border-2 transition-all cursor-pointer flex flex-col h-full bg-white select-none
                ${isSelected 
                  ? 'border-orange-500 shadow-[0_8px_30px_rgb(234,88,12,0.12)] -translate-y-1' 
                  : 'border-gray-100 hover:border-orange-200 hover:shadow-md'
                }
              `}
            >
              {isSelected && (
                <div className="absolute top-4 right-4 text-orange-600 bg-orange-100 rounded-full p-1">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
              <h3 className="text-xl font-bold text-gray-900 mb-1">{tier.name}</h3>
              <div className="text-2xl font-black text-gray-900 mb-3">{tier.price}</div>
              <p className="text-sm text-gray-500 mb-6 flex-grow">{tier.description}</p>
              
              <ul className="space-y-3 mb-6">
                {tier.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="text-orange-500 mt-0.5">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>

              <div className={`w-full py-2.5 rounded-xl text-center text-sm font-semibold transition-colors mt-auto
                ${isSelected ? 'bg-orange-600 text-white' : 'bg-gray-50 text-gray-600 group-hover:bg-orange-50'}
              `}>
                {isSelected ? 'Selected' : 'Select'}
              </div>
            </div>
          );
        })}
      </div>

      <div className="pt-8 flex items-center justify-between border-t border-gray-100">
        <button 
          type="button" 
          onClick={onBack}
          className="text-gray-500 hover:text-gray-900 font-medium transition-colors flex items-center gap-1"
        >
          <span className="text-xl leading-none">←</span> Back
        </button>
        
        <button 
          onClick={onNext}
          className="px-8 py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-xl transition-all duration-300 transform active:scale-[0.98] flex items-center gap-2"
        >
          Review Details <span className="text-xl leading-none">→</span>
        </button>
      </div>

    </div>
  );
};

export default Step3Membership;
