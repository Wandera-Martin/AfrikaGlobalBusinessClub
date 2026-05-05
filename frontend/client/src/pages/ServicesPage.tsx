import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchBusinessProfile, BusinessProfile } from '../services/businessApi';
import { fetchServices, Service } from '../services/servicesApi';
import ServiceCard from '../components/Dashboard/ServiceCard';



const ServicesPage: React.FC = () => {
  const navigate = useNavigate();
  const [profileStatus, setProfileStatus] = useState<BusinessProfile | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [profile, servicesData] = await Promise.all([
          fetchBusinessProfile(),
          fetchServices()
        ]);
        setProfileStatus(profile);
        setServices(servicesData);
      } catch (err) {
        console.error("Error loading services", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const showBanner =
    profileStatus !== null &&
    !profileStatus.onboarding_completed &&
    profileStatus.onboarding_skipped;

  return (
    <>
      {/* ── NAV ── */}
      

      
        {/* ── MAIN CONTENT ── */}
        <div className="w-full">
            <div className="mb-6 bg-gradient-to-r from-blue-900 to-indigo-900 rounded-2xl p-8 text-white shadow-md relative overflow-hidden">
              <div className="relative z-10">
                <h1 className="text-3xl font-extrabold mb-2">AGBC Services</h1>
                <p className="text-blue-100 max-w-xl">Accelerate your business scale with expert services led by the Trade Africa Global Business Club.</p>
              </div>
              <div className="absolute -right-5 -bottom-10 opacity-10 text-[180px] leading-none pointer-events-none">🚀</div>
            </div>
            
            {loading ? (
              <div className="flex justify-center p-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-navy"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {services.length > 0 ? (
                  services.map(service => (
                    <ServiceCard key={service.id} service={service} />
                  ))
                ) : (
                  <div className="col-span-2 text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm">
                    <div className="text-4xl mb-3">🛠️</div>
                    <h3 className="text-lg font-bold text-gray-800 mb-1">No services available right now</h3>
                    <p className="text-gray-500 text-sm">Check back later for new offerings from Trade Africa Group.</p>
                  </div>
                )}
              </div>
            )}
        </div>
    </>
  );
};

export default ServicesPage;
