import React, { useState, useEffect } from 'react';
import { fetchBusinessProfiles, fetchBusinessProfile, BusinessProfile } from '../services/businessApi';
import { createConversation } from '../services/messagesApi';
import { useNavigate } from 'react-router-dom';



const NetworkPage: React.FC = () => {
  const [profileStatus, setProfileStatus] = useState<BusinessProfile | null>(null);
  const [profiles, setProfiles] = useState<BusinessProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isMessaging, setIsMessaging] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [statusData, profilesData] = await Promise.all([
          fetchBusinessProfile().catch(() => null),
          fetchBusinessProfiles()
        ]);
        setProfileStatus(statusData);
        setProfiles(profilesData);
      } catch (err: any) {
        setError(err.message || 'Failed to load business network.');
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const handleMessageClick = async (businessId: number) => {
    setIsMessaging(businessId);
    try {
      await createConversation(businessId);
      navigate('/messages');
    } catch (err: any) {
      alert(err.message || 'Failed to start conversation.');
    } finally {
      setIsMessaging(null);
    }
  };

  const showBanner =
    profileStatus !== null &&
    !profileStatus.onboarding_completed &&
    profileStatus.onboarding_skipped;

  return (
    <>
      {/* ── NAV ── */}
      

      
        {/* ── MAIN CONTENT ── */}
        <div className="w-full">
            <div className="mb-6 flex justify-between items-end">
               <div>
                 <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Business Network</h2>
                 <p className="text-gray-500 mt-1 font-medium text-sm">Discover and connect with verified businesses across Africa</p>
               </div>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="w-8 h-8 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin"></div>
              </div>
            ) : error ? (
              <div className="bg-red-50 text-red-600 p-4 rounded-2xl font-bold text-sm text-center border border-red-100 shadow-sm">
                {error}
              </div>
            ) : profiles.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm">
                <div className="text-4xl mb-4">🌍</div>
                <h3 className="text-xl font-extrabold text-gray-900 mb-2">No businesses yet</h3>
                <p className="text-gray-500 font-medium">The network is currently empty. Check back later!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {profiles.map(profile => (
                  <div key={profile.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col h-full group">
                    <div className="h-28 w-full bg-gradient-to-br from-navy to-blue-900 relative">
                      {profile.cover_photo && (
                        <img src={`http://127.0.0.1:8000${profile.cover_photo}`} alt="Cover" className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
                      )}
                    </div>
                    
                    <div className="p-5 flex flex-col flex-1 relative pt-0">
                      <div className="flex items-start justify-between">
                        <div className="w-16 h-16 rounded-2xl bg-white p-1 flex-shrink-0 shadow-sm -mt-8 mb-3 border border-gray-100 relative z-10">
                          {profile.dp ? (
                            <img src={`http://127.0.0.1:8000${profile.dp}`} alt="Logo" className="w-full h-full object-cover rounded-xl" />
                          ) : (
                            <div className="w-full h-full rounded-xl bg-gradient-to-br from-orange-100 to-amber-50 flex items-center justify-center text-orange-600 font-extrabold text-2xl">
                              {profile.company_name?.charAt(0) || 'B'}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="min-w-0 mb-3">
                        <h3 className="font-extrabold text-gray-900 text-lg leading-tight flex items-center gap-1.5 truncate pr-2">
                          <span className="truncate">{profile.company_name || 'Unnamed Business'}</span>
                          {profile.is_verified && (
                            <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                          )}
                        </h3>
                        {profile.primary_sector && (
                          <p className="text-sm font-semibold text-orange-600 mt-0.5 truncate pr-2">{profile.primary_sector}</p>
                        )}
                        <p className="text-xs font-medium text-gray-400 mt-1 flex items-center gap-1 truncate pr-2">
                          <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                          <span className="truncate">{profile.country || 'Location Unspecified'}</span>
                        </p>
                      </div>
                    
                      <p className="text-sm text-gray-600 font-medium mb-6 line-clamp-3 leading-relaxed flex-1">
                        {profile.company_description || 'No description provided.'}
                      </p>
                    
                    <button 
                      onClick={() => handleMessageClick(profile.id as number)}
                      disabled={isMessaging === profile.id}
                      className="w-full mt-auto py-2.5 bg-navy/5 hover:bg-navy text-navy hover:text-white font-bold text-sm rounded-xl transition-colors border border-navy/10 hover:border-navy flex items-center justify-center gap-2"
                    >
                      {isMessaging === profile.id ? (
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <>✉️ Message</>
                      )}
                    </button>
                  </div>
                </div>
                ))}
              </div>
            )}
        </div>
    </>
  );
};

export default NetworkPage;
