import React, { useState } from 'react';

interface Step2Props {
  formData: any;
  setFormData: (data: any) => void;
  onNext: () => void;
  onBack: () => void;
  countries: { code: string; name: string }[];
}

const SECTORS = [
  "Agriculture",
  "Technology & SaaS",
  "E-commerce",
  "Energy",
  "Finance & Banking",
  "Healthcare",
  "Manufacturing",
  "Real Estate",
  "Retail",
  "Transportation & Logistics",
  "Other"
];

const Step2Operations: React.FC<Step2Props> = ({ formData, setFormData, onNext, onBack, countries }) => {
  const [newSector, setNewSector] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddSector = () => {
    if (newSector && newSector !== 'Select sector' && !formData.additionalSectors.includes(newSector)) {
      setFormData({
        ...formData,
        additionalSectors: [...formData.additionalSectors, newSector]
      });
    }
    setNewSector('');
  };

  const removeSector = (sectorToRemove: string) => {
    setFormData({
      ...formData,
      additionalSectors: formData.additionalSectors.filter((s: string) => s !== sectorToRemove)
    });
  };

  const isComplete = formData.country !== '' && formData.primarySector !== '';

  return (
    <div className="w-full max-w-2xl mx-auto p-10 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:rounded-3xl relative overflow-hidden">
      
      {/* Progress Bar */}
      <div className="flex items-center justify-between mb-8">
        <span className="text-sm font-medium text-gray-500">Step 2 of 4</span>
        <span className="text-sm font-bold text-orange-600">50%</span>
      </div>
      <div className="w-full bg-gray-100 h-1.5 rounded-full mb-10 overflow-hidden">
        <div className="bg-orange-600 h-1.5 rounded-full w-2/4 transition-all duration-500 ease-out" />
      </div>

      <h2 className="text-3xl font-bold text-gray-900 mb-2">Where do you operate?</h2>
      <p className="text-gray-500 mb-8">Tell us more about your business location and industry focus.</p>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🌍</span>
            <select 
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-colors bg-gray-50/50 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2224%22%20height%3D%2224%22%20fill%3D%22none%22%20stroke%3D%22%236b7280%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M6%209l6%206%206-6%22%2F%3E%3C%2Fvg%3E')] bg-[length:20px] bg-no-repeat bg-[position:right_1rem_center]"
            >
              <option value="">Select country</option>
              {countries.map(c => (
                <option key={c.code} value={c.code}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Primary Sector</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🏢</span>
            <select 
              name="primarySector"
              value={formData.primarySector}
              onChange={handleChange}
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-colors bg-gray-50/50 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2224%22%20height%3D%2224%22%20fill%3D%22none%22%20stroke%3D%22%236b7280%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M6%209l6%206%206-6%22%2F%3E%3C%2Fvg%3E')] bg-[length:20px] bg-no-repeat bg-[position:right_1rem_center]"
            >
              <option value="">Select primary sector</option>
              {SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Additional Sectors</label>
          <div className="flex flex-wrap gap-2 mb-3">
            {formData.additionalSectors.map((sector: string) => (
              <span key={sector} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm bg-orange-50 text-orange-700 border border-orange-100">
                {sector}
                <button type="button" onClick={() => removeSector(sector)} className="text-orange-400 hover:text-orange-600">×</button>
              </span>
            ))}
          </div>
          
          <div className="flex gap-2">
            <select 
              value={newSector}
              onChange={(e) => setNewSector(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-gray-50/50 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2224%22%20height%3D%2224%22%20fill%3D%22none%22%20stroke%3D%22%236b7280%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M6%209l6%206%206-6%22%2F%3E%3C%2Fvg%3E')] bg-[length:20px] bg-no-repeat bg-[position:right_1rem_center]"
            >
              <option value="">Select sector...</option>
              {SECTORS.filter(s => s !== formData.primarySector && !formData.additionalSectors.includes(s)).map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <button 
              type="button" 
              onClick={handleAddSector}
              disabled={!newSector}
              className="px-4 py-2.5 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              + Add Sector
            </button>
          </div>
        </div>

        <div className="pt-8 flex items-center justify-between border-t border-gray-100 mt-8">
          <button 
            type="button" 
            onClick={onBack}
            className="text-gray-500 hover:text-gray-900 font-medium transition-colors flex items-center gap-1"
          >
            <span className="text-xl leading-none">←</span> Back
          </button>
          
          <button 
            onClick={() => { if(isComplete) onNext(); }}
            disabled={!isComplete}
            className="px-8 py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-xl transition-all duration-300 transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            Continue <span className="text-xl leading-none">→</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Step2Operations;
