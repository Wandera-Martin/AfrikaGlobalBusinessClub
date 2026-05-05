import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchBusinessProfile, BusinessProfile } from '../services/businessApi';

import PostsSection from '../components/Dashboard/PostsSection';

// ─── DASHBOARD PAGE ───────────────────────────────────────────────────────────
const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [profileStatus, setProfileStatus] = useState<BusinessProfile | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profile = await fetchBusinessProfile();
        setProfileStatus(profile);
      } catch (err) {
        // Profile doesn't exist yet — treat as incomplete
        setProfileStatus({ onboarding_completed: false, onboarding_skipped: false, company_name: '' });
      }
    };
    loadProfile();
  }, []);

  return (
    <>
      {/* ── MAIN CONTENT GRID ── */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* ── LEFT SIDEBAR ── */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-24">
              <div className="h-20 bg-gradient-to-r from-navy to-blue-800"></div>
              <div className="px-5 pb-5">
                <div className="w-16 h-16 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 font-extrabold text-2xl -mt-8 border-4 border-white shadow-sm mb-3">
                  {profileStatus?.company_name?.charAt(0) || 'B'}
                </div>
                <h2 className="font-bold text-gray-900 text-lg leading-tight">
                  {profileStatus?.company_name || 'AGBC Business'}
                </h2>
                <div className="text-xs font-semibold text-green-600 flex items-center gap-1 mt-1">
                  ✓ Verified Member
                </div>
                
                <div className="mt-5 space-y-3 pt-4 border-t border-gray-100">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500 font-medium">Posts</span>
                    <span className="font-bold text-gray-900 bg-gray-50 px-2 py-0.5 rounded-md">{profileStatus?.posts_count || 0}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500 font-medium">Applications</span>
                    <span className="font-bold text-gray-900 bg-gray-50 px-2 py-0.5 rounded-md">{profileStatus?.applications_received_count || 0}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500 font-medium">Network Views</span>
                    <span className="font-bold text-gray-900 bg-gray-50 px-2 py-0.5 rounded-md">142</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sticky top-[340px]">
              <h3 className="font-bold text-gray-800 text-sm mb-3">Quick Links</h3>
              <div className="space-y-2">
                <a href="#" className="block text-sm text-gray-600 hover:text-orange-600 font-medium transition-colors">Find Trading Partners</a>
                <a href="#" className="block text-sm text-gray-600 hover:text-orange-600 font-medium transition-colors">Market Intelligence</a>
                <a href="#" className="block text-sm text-gray-600 hover:text-orange-600 font-medium transition-colors">Edit Profile</a>
              </div>
            </div>
          </div>

          {/* ── RIGHT FEED ── */}
          <div className="md:col-span-3">
            {/* ── POSTS FEED ── */}
            {/* ── POSTS FEED ── */}
            <PostsSection excludeType="opportunity" allowedTypes={['text', 'media', 'article']} />
          </div>
        </div>
    </>
  );
};

export default DashboardPage;
