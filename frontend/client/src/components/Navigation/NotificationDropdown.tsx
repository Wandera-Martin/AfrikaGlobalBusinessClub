import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchNotifications, markNotificationRead, markAllNotificationsRead, Notification } from '../../services/notificationsApi';
import { fetchBusinessProfile, BusinessProfile } from '../../services/businessApi';

function timeAgo(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  let interval = Math.floor(seconds / 31536000);
  if (interval > 1) return interval + "y";
  interval = Math.floor(seconds / 2592000);
  if (interval > 1) return interval + "mo";
  interval = Math.floor(seconds / 86400);
  if (interval >= 1) return interval + "d";
  interval = Math.floor(seconds / 3600);
  if (interval >= 1) return interval + "h";
  interval = Math.floor(seconds / 60);
  if (interval >= 1) return interval + "m";
  return "Just now";
}

const NotificationDropdown: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [profileStatus, setProfileStatus] = useState<BusinessProfile | null | undefined>(undefined);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const loadData = async () => {
    try {
      const data = await fetchNotifications();
      setNotifications(data);
    } catch (err) {
      console.error('Failed to load notifications', err);
    }
    
    try {
      const profile = await fetchBusinessProfile();
      setProfileStatus(profile);
    } catch (err) {
      setProfileStatus(null);
    }
  };

  useEffect(() => {
    loadData();
    const intervalId = setInterval(loadData, 30000); // Poll every 30 seconds
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  let stickyNotice = null;
  if (profileStatus === null) {
    stickyNotice = "Create business profile to access more services";
  } else if (profileStatus && !profileStatus.onboarding_completed) {
    stickyNotice = "Complete profile";
  }

  let unreadCount = notifications.filter(n => !n.is_read).length;
  if (stickyNotice) {
    unreadCount += 1;
  }

  const handleNotificationClick = async (notif: Notification) => {
    if (!notif.is_read) {
      try {
        await markNotificationRead(notif.id);
        setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, is_read: true } : n));
      } catch (err) {
        console.error('Failed to mark read', err);
      }
    }
    
    setIsOpen(false);
    
    // Navigate based on type
    if (notif.notification_type === 'MESSAGE') {
      navigate('/messages');
    } else if (notif.notification_type === 'APPLY') {
      if (notif.content_model === 'serviceapplication') navigate('/services');
      else navigate('/opportunities');
    } else if (notif.notification_type === 'SYSTEM') {
      if (notif.content_model === 'service') navigate('/services');
      else if (notif.content_model === 'event') navigate('/events');
      else navigate('/dashboard');
    } else {
      navigate('/dashboard');
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsRead();
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    } catch (err) {
      console.error('Failed to mark all read', err);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-white/80 hover:text-white transition-colors rounded-full hover:bg-white/10"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-navy">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden transform origin-top-right transition-all">
          <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <h3 className="font-bold text-gray-900 text-sm">Notifications</h3>
            {unreadCount > 0 && (
              <button 
                onClick={handleMarkAllRead}
                className="text-[11px] font-bold text-orange-600 hover:text-orange-700 hover:underline"
              >
                Mark all read
              </button>
            )}
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            <div className="divide-y divide-gray-50">
              {stickyNotice && (
                <div 
                  onClick={() => { setIsOpen(false); navigate('/onboarding'); }}
                  className="px-4 py-3 cursor-pointer bg-red-50 hover:bg-red-100 transition-colors flex gap-3 border-b border-red-100"
                >
                  <div className="w-2 h-2 mt-1.5 rounded-full shrink-0 bg-red-500 shadow-sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm tracking-tight font-extrabold text-red-900">
                      {stickyNotice}
                    </p>
                    <p className="text-[11px] text-red-600 mt-1 font-bold">
                      Action Required
                    </p>
                  </div>
                </div>
              )}
              {notifications.length === 0 && !stickyNotice ? (
                <div className="px-4 py-8 text-center text-sm text-gray-500 font-medium">
                  No notifications yet
                </div>
              ) : (
                notifications.map(notif => (
                  <div 
                    key={notif.id}
                    onClick={() => handleNotificationClick(notif)}
                    className={`px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors flex gap-3 ${!notif.is_read ? 'bg-orange-50/30' : ''}`}
                  >
                    <div className={`w-2 h-2 mt-1.5 rounded-full shrink-0 ${!notif.is_read ? 'bg-orange-500' : 'bg-transparent'}`} />
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm tracking-tight ${!notif.is_read ? 'font-bold text-gray-900' : 'font-medium text-gray-600'}`}>
                        {notif.message}
                      </p>
                      <p className="text-[11px] text-gray-400 mt-1 font-medium">
                        {timeAgo(notif.created_at)}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
