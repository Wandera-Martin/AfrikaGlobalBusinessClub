import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Briefcase, Wrench, Calendar, Users, MessageSquare } from 'lucide-react';
import NotificationDropdown from './NotificationDropdown';
import AccountDropdown from './AccountDropdown';
import { fetchBusinessProfile, BusinessProfile } from '../../services/businessApi';
import { apiLogout } from '../../services/authApi';

const ProtectedLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [profileStatus, setProfileStatus] = useState<BusinessProfile | null | undefined>(undefined);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profile = await fetchBusinessProfile();
        setProfileStatus(profile);
      } catch (err) {
        // Profile doesn't exist yet
        setProfileStatus(null);
      }
    };
    loadProfile();
  }, [location.pathname]); // Re-check implicitly on nav if desired, or just once.

  const handleLogout = async () => {
    const refresh = localStorage.getItem('refresh_token');
    if (refresh) {
      await apiLogout(refresh);
    }
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    navigate('/');
  };

  const getActiveProps = (path: string) => {
    const isActive = location.pathname.startsWith(path);
    return isActive 
      ? "flex flex-col items-center justify-center text-white transition-colors px-2 border-b-2 border-orange-500 pb-1 translate-y-[2px]"
      : "flex flex-col items-center justify-center text-white/70 hover:text-white transition-colors px-2";
  };

  let bannerText = null;
  if (profileStatus === null) {
    bannerText = "Create business profile to access more services";
  } else if (profileStatus && !profileStatus.onboarding_completed) {
    bannerText = "Complete profile";
  }

  // We only show banner if we have a resolved profileStatus (not undefined) and there's text
  const showBanner = profileStatus !== undefined && bannerText !== null;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 pb-20">
      {/* ── NAV ── */}
      <nav className="fixed top-0 inset-x-0 z-[100] flex items-center justify-between px-10 h-16 bg-navy/95 backdrop-blur-xl">
        <div className="flex items-center gap-2.5 cursor-pointer flex-shrink-0" onClick={() => navigate('/dashboard')}>
          <div className="w-9 h-9 rounded-lg bg-grad flex items-center justify-center font-extrabold text-[15px] text-white">🌍</div>
          <div className="text-white font-bold text-[15px]">AGBC</div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-3 pr-1">
            <button 
              onClick={() => navigate('/dashboard')}
              className={getActiveProps('/dashboard')}
            >
              <LayoutDashboard size={20} className="mb-0.5" />
              <span className="text-[11px] font-bold">Dashboard</span>
            </button>
            <button 
              onClick={() => navigate('/opportunities')}
              className={getActiveProps('/opportunities')}
            >
              <Briefcase size={20} className="mb-0.5" />
              <span className="text-[11px] font-semibold">Opportunities</span>
            </button>
            <button 
              onClick={() => navigate('/services')}
              className={getActiveProps('/services')}
            >
              <Wrench size={20} className="mb-0.5" />
              <span className="text-[11px] font-semibold">Services</span>
            </button>
            <button 
              onClick={() => navigate('/events')}
              className={getActiveProps('/events')}
            >
              <Calendar size={20} className="mb-0.5" />
              <span className="text-[11px] font-semibold">Events</span>
            </button>
            <button 
              onClick={() => navigate('/network')}
              className={getActiveProps('/network')}
            >
              <Users size={20} className="mb-0.5" />
              <span className="text-[11px] font-semibold">Network</span>
            </button>
            <button 
              onClick={() => navigate('/messages')}
              className={getActiveProps('/messages')}
            >
              <MessageSquare size={20} className="mb-0.5" />
              <span className="text-[11px] font-semibold">Messages</span>
            </button>
          </div>
          <div className="flex items-center gap-3 pl-2 border-l border-white/20">
            <NotificationDropdown />
            <AccountDropdown onLogout={handleLogout} />
          </div>
        </div>
      </nav>

      {/* ── MAIN LAYOUT WRAPPER ── */}
      <div className="pt-24 px-10 max-w-6xl mx-auto">
        {/* ── COMPLETE PROFILE BANNER ── */}
        {showBanner && (
          <div className="mb-8 flex items-center justify-between gap-6 bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-2xl px-6 py-5 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center text-2xl flex-shrink-0">
                📋
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-base">{bannerText}</h3>
                {profileStatus === null ? (
                  <p className="text-sm text-gray-500 mt-0.5">
                    Build a business profile to start networking and discovering trade opportunities.
                  </p>
                ) : (
                  <p className="text-sm text-gray-500 mt-0.5">
                    Complete your profile to unlock your full network access and visibility across the AGBC platform.
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={() => navigate('/onboarding')}
              className="flex-shrink-0 px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-sm font-bold rounded-xl transition-all duration-200 active:scale-[0.98] shadow-md shadow-orange-200 whitespace-nowrap"
            >
              {profileStatus === null ? 'Create Profile →' : 'Complete Profile →'}
            </button>
          </div>
        )}
        
        {/* Render the actual page content under the banner */}
        <Outlet />
      </div>
    </div>
  );
};

export default ProtectedLayout;
