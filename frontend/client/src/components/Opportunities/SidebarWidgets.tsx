import React from 'react';
import { Bookmark, TrendingUp, Users, ArrowRight } from 'lucide-react';

export const RecommendedWidget = () => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
    <h3 className="font-extrabold text-gray-900 flex items-center gap-2 mb-4 text-[15px]">
      <TrendingUp size={18} className="text-orange-500" strokeWidth={2.5} /> Recommended Matches
    </h3>
    <div className="space-y-4">
      {[1, 2].map(i => (
        <div key={i} className="group cursor-pointer">
          <div className="flex justify-between items-start mb-1">
            <h4 className="text-sm font-bold text-gray-800 group-hover:text-navy transition-colors line-clamp-2">
              Looking for Solar Panel Distributors in East Africa
            </h4>
          </div>
          <p className="text-xs text-gray-500 font-medium">EcoPower Tech Ltd • <span className="text-green-600 font-bold">$10k - $50k</span></p>
        </div>
      ))}
      <button className="w-full mt-2 py-2.5 text-sm font-bold text-navy hover:bg-navy/5 rounded-xl transition-colors">
        View all matches
      </button>
    </div>
  </div>
);

export const SavedWidget = () => (
  <div className="bg-gradient-to-br from-navy to-blue-900 rounded-2xl border border-blue-800 shadow-md p-5 text-white">
    <h3 className="font-extrabold flex items-center gap-2 mb-4 text-[15px]">
      <Bookmark size={18} className="text-orange-400" strokeWidth={2.5} /> Saved Opportunities
    </h3>
    <div className="space-y-4">
      <div className="flex gap-3 items-center group cursor-pointer bg-white/10 hover:bg-white/20 p-3 rounded-xl transition-all">
        <div className="w-10 h-10 rounded-lg bg-orange-500 flex items-center justify-center font-bold text-white shrink-0">
          A
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-bold text-white line-clamp-1 group-hover:underline">Agri-tech Investment...</h4>
          <p className="text-xs text-blue-200 mt-0.5 font-medium line-clamp-1">AgriCorp Inc</p>
        </div>
      </div>
      <button className="w-full flex items-center justify-between mt-2 py-2 px-3 text-sm font-bold text-white hover:bg-white/10 rounded-xl transition-colors">
        See all saved <ArrowRight size={16} />
      </button>
    </div>
  </div>
);

export const CommunitiesWidget = () => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
    <h3 className="font-extrabold text-gray-900 flex items-center gap-2 mb-4 text-[15px]">
      <Users size={18} className="text-blue-500" strokeWidth={2.5} /> Active Communities
    </h3>
    <div className="space-y-3">
      {['Tech Founders Africa', 'Export Compliance Group', 'Renewable Energy Hub'].map((name, i) => (
        <div key={i} className="flex items-center justify-between cursor-pointer group">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-xs font-bold text-gray-600 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
              #
            </div>
            <span className="text-sm font-bold text-gray-700 group-hover:text-gray-900 transition-colors">{name}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);
