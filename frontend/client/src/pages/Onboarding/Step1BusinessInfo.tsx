import React from 'react';

interface Step1Props {
  formData: any;
  setFormData: (data: any) => void;
  onNext: () => void;
}

const Step1BusinessInfo: React.FC<Step1Props> = ({ formData, setFormData, onNext }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, [fieldName]: e.target.files[0] });
    }
  };

  const isComplete = formData.companyName.trim() !== '';

  return (
    <div className="w-full max-w-2xl mx-auto p-10 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:rounded-3xl relative overflow-hidden">
      
      {/* Progress Bar */}
      <div className="flex items-center justify-between mb-8">
        <span className="text-sm font-medium text-gray-500">Step 1 of 4</span>
        <span className="text-sm font-bold text-orange-600">25%</span>
      </div>
      <div className="w-full bg-gray-100 h-1.5 rounded-full mb-10 overflow-hidden">
        <div className="bg-orange-600 h-1.5 rounded-full w-1/4 transition-all duration-500 ease-out" />
      </div>

      <h2 className="text-3xl font-bold text-gray-900 mb-2">Tell us about your business</h2>
      <p className="text-gray-500 mb-8">Please provide the basic information about your company to get started with your account.</p>

      <form onSubmit={(e) => { e.preventDefault(); if(isComplete) onNext(); }} className="space-y-6">
        {/* Cover Photo & DP Upload Section */}
        <div className="flex flex-col gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Cover Photo</label>
            <div className="relative w-full h-32 rounded-xl bg-gray-100 overflow-hidden border-2 border-dashed border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors">
              {formData.coverPhoto ? (
                <img src={URL.createObjectURL(formData.coverPhoto)} alt="Cover preview" className="w-full h-full object-cover" />
              ) : (
                <span className="text-gray-400 text-sm flex flex-col items-center">
                  <span className="text-2xl mb-1">🖼️</span> Upload Banner
                </span>
              )}
              <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'coverPhoto')} className="absolute inset-0 opacity-0 cursor-pointer" />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative w-24 h-24 rounded-full bg-gray-100 overflow-hidden border-2 border-dashed border-gray-300 flex items-center justify-center flex-shrink-0 hover:bg-gray-50 transition-colors">
              {formData.dp ? (
                <img src={URL.createObjectURL(formData.dp)} alt="DP preview" className="w-full h-full object-cover" />
              ) : (
                <span className="text-gray-400 text-sm flex flex-col items-center">
                   <span className="text-xl">📷</span> Logo
                </span>
              )}
              <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'dp')} className="absolute inset-0 opacity-0 cursor-pointer" />
            </div>
            <div className="text-sm text-gray-500">
              <p className="font-medium text-gray-700">Company Logo / Display Picture</p>
              <p>Recommended size: 256x256px. PNG or JPG.</p>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Company Name (required)</label>
          <input 
            type="text" 
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            placeholder="e.g. Acme Corp"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-colors bg-gray-50/50"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Company Description</label>
          <textarea 
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Tell us what your business does..."
            rows={4}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-colors bg-gray-50/50 resize-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Website URL</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🌐</span>
              <input 
                type="url" 
                name="websiteUrl"
                value={formData.websiteUrl}
                onChange={handleChange}
                placeholder="https://"
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-colors bg-gray-50/50"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Year Established</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">📅</span>
              <input 
                type="number" 
                name="yearEstablished"
                value={formData.yearEstablished}
                onChange={handleChange}
                placeholder="YYYY"
                min="1800"
                max={new Date().getFullYear()}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-colors bg-gray-50/50"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Employee Count</label>
            <select 
              name="employeeCount"
              value={formData.employeeCount}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-colors bg-gray-50/50 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2224%22%20height%3D%2224%22%20fill%3D%22none%22%20stroke%3D%22%236b7280%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M6%209l6%206%206-6%22%2F%3E%3C%2Fvg%3E')] bg-[length:20px] bg-no-repeat bg-[position:right_1rem_center]"
            >
              <option value="">Select Range</option>
              <option value="1-10">1-10</option>
              <option value="11-50">11-50</option>
              <option value="51-200">51-200</option>
              <option value="201-500">201-500</option>
              <option value="500+">500+</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Annual Revenue</label>
            <select 
              name="annualRevenue"
              value={formData.annualRevenue}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-colors bg-gray-50/50 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2224%22%20height%3D%2224%22%20fill%3D%22none%22%20stroke%3D%22%236b7280%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M6%209l6%206%206-6%22%2F%3E%3C%2Fvg%3E')] bg-[length:20px] bg-no-repeat bg-[position:right_1rem_center]"
            >
              <option value="">Select Range</option>
              <option value="<$100k">&lt; $100k</option>
              <option value="$100k-$500k">$100k - $500k</option>
              <option value="$500k-$1M">$500k - $1M</option>
              <option value="$1M-$5M">$1M - $5M</option>
              <option value="$5M+">$5M+</option>
            </select>
          </div>
        </div>

        <div className="pt-6 flex justify-end border-t border-gray-100">
          <button 
            type="submit"
            disabled={!isComplete}
            className="px-8 py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-xl transition-all duration-300 transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            Continue <span className="text-xl leading-none">→</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default Step1BusinessInfo;
