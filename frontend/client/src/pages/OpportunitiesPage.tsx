import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter } from 'lucide-react';
import PostsSection from '../components/Dashboard/PostsSection';
import { RecommendedWidget, SavedWidget, CommunitiesWidget } from '../components/Opportunities/SidebarWidgets';

const OpportunitiesPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'all' | 'supply_lead' | 'grant' | 'partnership' | 'export_contract' | 'investment'>('all');

  return (
    <>
      {/* ── HEADER ── */}
        {/* ── MAIN CONTENT GRID ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 relative items-start">
            
            {/* ── LEFT COLUMN (Main Feed) ── */}
            <div className="w-full min-w-0">
               <div className="mb-6 bg-gradient-to-r from-navy to-blue-900 rounded-2xl p-8 text-white shadow-md relative overflow-hidden">
                 <div className="relative z-10">
                   <h1 className="text-3xl font-extrabold mb-2">Trade Opportunities</h1>
                   <p className="text-blue-100 max-w-xl">Browse, apply, and post exclusive trade opportunities within the AGBC network to grow your business.</p>
                 </div>
                 <div className="absolute -right-10 -bottom-10 opacity-10 text-[180px] leading-none pointer-events-none">🤝</div>
               </div>
               
               {/* ── SEARCH & FILTER BAR ── */}
               <div className="flex bg-white rounded-2xl p-2 mb-4 border border-gray-100 shadow-sm items-center gap-2">
                 <div className="flex-1 flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-xl">
                   <Search size={18} className="text-gray-400" />
                   <input type="text" placeholder="Search opportunities..." className="bg-transparent border-none outline-none text-sm font-bold w-full text-gray-800" />
                 </div>
                 <button className="px-4 py-3 bg-gray-50 rounded-xl text-gray-600 hover:bg-gray-100 font-bold text-sm transition-colors flex items-center gap-2 shadow-sm border border-gray-100">
                   <Filter size={16} /> Filters
                 </button>
               </div>

               {/* ── CATEGORY TABS ── */}
               <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-none" style={{ scrollbarWidth: 'none' }}>
                  {[
                    { id: 'all', label: 'All Opportunities' },
                    { id: 'supply_lead', label: 'Supply Leads' },
                    { id: 'grant', label: 'Grants' },
                    { id: 'partnership', label: 'Partnerships' },
                    { id: 'investment', label: 'Investments' }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`px-5 py-2.5 rounded-xl font-bold text-sm whitespace-nowrap transition-all ${
                        activeTab === tab.id 
                        ? 'bg-navy text-white shadow-md shadow-navy/20 active:scale-95' 
                        : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
               </div>
              
              {/* ── POSTS FEED (Opportunities Only) ── */}
              {/* ── POSTS FEED (Opportunities Only) ── */}
              <PostsSection 
                 filterType="opportunity" 
                 oppType={activeTab === 'all' ? undefined : activeTab}
                 allowedTypes={['opportunity']} 
                 hideComposer={false}
                 composerTitle="Post a Trade Opportunity ✨"
                 feedTitle="Latest Opportunities"
              />
            </div>

            {/* ── RIGHT COLUMN (Sidebar) ── */}
            <div className="hidden lg:flex flex-col gap-6 sticky top-24 pt-1">
               <RecommendedWidget />
               <SavedWidget />
               <CommunitiesWidget />
            </div>
        </div>
    </>
  );
};

export default OpportunitiesPage;
