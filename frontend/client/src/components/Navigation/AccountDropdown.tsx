import React, { useState, useRef, useEffect } from 'react';
import { User, LogOut, Key, Edit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { fetchBusinessProfile, BusinessProfile } from '../../services/businessApi';

interface AccountDropdownProps {
  onLogout?: () => void;
}

const AccountDropdown: React.FC<AccountDropdownProps> = ({ onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [profile, setProfile] = useState<BusinessProfile | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await fetchBusinessProfile();
        setProfile(data);
      } catch (err) {
        // Ignored
      }
    };
    loadProfile();
  }, []);

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      window.location.href = '/login';
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center overflow-hidden border border-white/10 flex-shrink-0"
      >
        {profile?.dp ? (
          <img src={`http://127.0.0.1:8000${profile.dp}`} alt="Profile" className="w-full h-full object-cover" />
        ) : (
          <User size={20} className="text-white" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl py-2 z-50 border border-gray-100 overflow-hidden transform origin-top-right transition-all">
          <div className="px-4 py-3 border-b border-gray-50 flex items-center gap-3">
             {profile?.dp ? (
              <img src={`http://127.0.0.1:8000${profile.dp}`} alt="Profile" className="w-10 h-10 rounded-full object-cover" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                <User size={18} />
              </div>
            )}
            <div className="flex flex-col">
              <span className="text-sm font-bold text-gray-900 truncate w-32">{profile?.company_name || 'My Account'}</span>
              <span className="text-xs text-green-600 font-medium">{profile?.is_verified ? 'Verified' : 'Member'}</span>
            </div>
          </div>
          
          <div className="py-2">
            <button
              onClick={() => { setIsOpen(false); navigate('/onboarding'); }}
              className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 flex items-center gap-3 transition-colors"
            >
              <Edit size={16} /> Edit Profile
            </button>
            <button
              onClick={() => { setIsOpen(false); navigate('/change-password'); }}
              className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 flex items-center gap-3 transition-colors"
            >
              <Key size={16} /> Change Password
            </button>
          </div>
          
          <div className="border-t border-gray-50 py-1">
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors font-medium"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountDropdown;
