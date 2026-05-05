import React, { useState } from 'react';
import { Service, applyForService } from '../../services/servicesApi';
import { useToast } from '../../context/ToastContext';

interface ServiceCardProps {
  service: Service;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [requirements, setRequirements] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!requirements.trim()) return;

    setIsSubmitting(true);
    try {
      await applyForService(service.id, requirements);
      showToast('Service request submitted successfully!', 'success');
      setIsModalOpen(false);
      setRequirements('');
    } catch (err: any) {
      showToast(err.message || 'Failed to submit request', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col h-full relative overflow-hidden group">
        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-3xl mb-5 shadow-sm group-hover:scale-110 transition-transform">
          {service.icon || '💼'}
        </div>
        
        <h3 className="text-xl font-extrabold text-gray-900 mb-2 leading-tight">{service.title}</h3>
        <p className="text-sm text-gray-600 mb-6 flex-grow leading-relaxed">{service.description}</p>
        
        <div className="mt-auto border-t border-gray-100 pt-5">
          {service.price_range && (
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">Investment</span>
              <span className="text-sm font-extrabold text-gray-900">{service.price_range}</span>
            </div>
          )}
          
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full py-2.5 bg-navy hover:bg-blue-900 text-white text-sm font-bold rounded-xl transition-colors active:scale-[0.98] shadow-sm flex items-center justify-center gap-2"
          >
            Request Service <span>→</span>
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-navy/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden scale-in">
            <div className="bg-gradient-to-r from-navy to-blue-800 p-6 text-white flex justify-between items-center">
              <div>
                <h3 className="font-bold text-lg">Request {service.title}</h3>
                <p className="text-blue-100 text-sm mt-1">Tell our experts about your needs.</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleApply} className="p-6">
              <div className="mb-5">
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Project Requirements & Goals
                </label>
                <textarea
                  required
                  rows={5}
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-navy/20 focus:border-navy outline-none transition-all resize-none bg-gray-50/50"
                  placeholder="Describe your business needs, timelines, and exactly what you are looking to achieve..."
                />
              </div>
              
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-navy hover:bg-blue-900 transition-all active:scale-[0.98] shadow-sm disabled:opacity-50 flex items-center gap-2"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ServiceCard;
