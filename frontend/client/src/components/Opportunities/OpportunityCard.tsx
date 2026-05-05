import React, { useState, useRef, useEffect } from 'react';
import { Post, savePost, fetchComments, createComment, Comment } from '../../services/postsApi';
import { applyToOpportunity } from '../../services/opportunitiesApi';
import { useToast } from '../../context/ToastContext';
import { Bookmark, MapPin, DollarSign, Clock, Share2, MessageCircle, Info } from 'lucide-react';

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

interface OpportunityCardProps {
  post: Post;
  onShare: (id: number) => void;
  onDelete: (id: number) => void;
  onSaveToggle: (id: number, isSaved: boolean) => void; 
}

const OpportunityCard: React.FC<OpportunityCardProps> = ({ post, onShare, onDelete, onSaveToggle }) => {
  const { showToast } = useToast();
  const details = post.opportunity_details;
  
  const [isExpanded, setIsExpanded] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Apply state
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [marketplaceId, setMarketplaceId] = useState('');
  const [isApplying, setIsApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(post.has_applied || false);

  // Share state
  const [sharePopoverOpen, setSharePopoverOpen] = useState(false);
  const shareButtonRef = useRef<HTMLButtonElement>(null);
  const sharePopoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sharePopoverOpen) return;
    const handler = (e: MouseEvent) => {
      if (
        sharePopoverRef.current && !sharePopoverRef.current.contains(e.target as Node) &&
        shareButtonRef.current && !shareButtonRef.current.contains(e.target as Node)
      ) {
        setSharePopoverOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [sharePopoverOpen]);

  if (!details) return null; // Fallback if data is missing

  const isFeatured = details.is_featured;

  const handleSaveToggle = async () => {
    setIsSaving(true);
    try {
      const resp = await savePost(post.id);
      onSaveToggle(post.id, resp.is_saved_by_user);
      if (resp.is_saved_by_user) {
        showToast('Saved to your bookmarks! 🔖', 'success');
      }
    } catch (err) {
      showToast('Failed to save opportunity.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleApplySubmit = async () => {
    if (!marketplaceId.trim()) {
      showToast('Please enter your Marketplace Account ID', 'error');
      return;
    }
    setIsApplying(true);
    try {
      await applyToOpportunity(post.id, marketplaceId.trim());
      setHasApplied(true);
      setShowApplyModal(false);
      showToast('Successfully applied to opportunity! 🎉', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to apply.', 'error');
    } finally {
      setIsApplying(false);
    }
  };

  const postUrl = `${window.location.origin}/posts/${post.slug || post.id}`;
  const shareText = `Check out this ${details.opportunity_type.replace('_', ' ')} opportunity on AGBC \n\n${post.title}`;

  const handleShareClick = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: shareText, url: postUrl });
        onShare(post.id);
        return;
      } catch (err) {
        if ((err as Error).name === 'AbortError') return;
      }
    }
    setSharePopoverOpen(prev => !prev);
  };

  const formatCurrency = (val: string | undefined | null) => {
    if (!val) return null;
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: details.currency, maximumFractionDigits: 0 }).format(parseFloat(val));
  };

  const valueDisplay = details.min_value && details.max_value 
    ? `${formatCurrency(details.min_value)} - ${formatCurrency(details.max_value)}`
    : details.min_value 
    ? `${formatCurrency(details.min_value)}+`
    : details.max_value
    ? `Up to ${formatCurrency(details.max_value)}`
    : 'Value Undisclosed';

  const MAX_LENGTH = 180;
  const shouldTruncate = post.content.length > MAX_LENGTH;
  const displayedContent = !isExpanded && shouldTruncate 
    ? post.content.substring(0, MAX_LENGTH) + '...' 
    : post.content;

  return (
    <div className={`bg-white rounded-2xl border transition-all overflow-hidden mb-6 group ${isFeatured ? 'border-orange-200 shadow-md shadow-orange-500/5' : 'border-gray-100 shadow-sm hover:shadow-md'}`}>
      
      {/* Featured Header */}
      {isFeatured && (
        <div className="bg-gradient-to-r from-orange-500 to-amber-500 px-5 py-2 flex items-center gap-2 text-white font-bold text-xs uppercase tracking-wider">
          <span className="animate-pulse">✨</span> Premium Opportunity
        </div>
      )}

      {/* ── CARD HEADER ── */}
      <div className="px-6 pt-6 flex justify-between items-start">
        <div className="flex gap-4 items-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-navy to-blue-800 flex items-center justify-center text-white font-extrabold text-xl shrink-0 shadow-inner">
            {post.company_name?.charAt(0) || 'B'}
          </div>
          <div>
            <h4 className="font-extrabold text-gray-900 text-lg leading-tight hover:text-navy cursor-pointer transition-colors">
              {post.company_name || 'Verified Business'}
            </h4>
            <div className="flex items-center gap-2 text-sm mt-1">
              {post.is_verified && (
                <span className="text-green-600 font-bold flex items-center gap-1 bg-green-50 px-2 py-0.5 rounded-full text-xs">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                  Verified
                </span>
              )}
              <span className="text-gray-400 text-xs font-semibold flex items-center gap-1">
                <Clock size={12} /> {timeAgo(post.created_at)}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-gray-400">
           <button 
             onClick={handleSaveToggle}
             disabled={isSaving}
             className={`p-2 rounded-full transition-all ${post.is_saved_by_user ? 'bg-orange-50 text-orange-500' : 'hover:bg-gray-100 hover:text-gray-600'}`}
           >
             <Bookmark size={20} className={post.is_saved_by_user ? 'fill-current' : ''} />
           </button>
           
           {post.is_mine && (
             <div className="relative">
               <button onClick={() => setShowOptions(!showOptions)} className="p-2 rounded-full hover:bg-gray-100 hover:text-gray-600 transition-all">
                 <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>
               </button>
               {showOptions && (
                 <div className="absolute right-0 mt-2 w-32 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-20">
                   <button onClick={() => { setShowOptions(false); onDelete(post.id); }} className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 font-bold transition-colors">
                     Delete Post
                   </button>
                 </div>
               )}
             </div>
           )}
        </div>
      </div>

      {/* ── CONTENT BODY ── */}
      <div className="px-6 mt-5">
        <h3 className="font-extrabold text-2xl text-gray-900 mb-3 tracking-tight">{post.title}</h3>
        
        {/* Chips */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="px-3 py-1 bg-navy/5 text-navy text-xs font-bold rounded-lg capitalize border border-navy/10">
            {details.opportunity_type.replace('_', ' ')}
          </span>
          <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-lg border border-green-200/60 flex items-center gap-1">
            <DollarSign size={13} strokeWidth={3} /> {valueDisplay}
          </span>
          {details.target_country && (
            <span className="px-3 py-1 bg-gray-50 text-gray-600 text-xs font-bold rounded-lg border border-gray-200 flex items-center gap-1">
              <MapPin size={13} strokeWidth={2.5} /> {details.target_country}
            </span>
          )}
        </div>

        <p className="text-gray-700 text-[15.5px] leading-relaxed whitespace-pre-wrap font-medium">
          {displayedContent}
          {shouldTruncate && !isExpanded && (
            <button onClick={() => setIsExpanded(true)} className="ml-1 text-orange-600 hover:underline font-bold">
              Read More
            </button>
          )}
        </p>
      </div>

      {/* ── ACTION FOOTER ── */}
      <div className="px-3 pb-3 pt-5 mt-4 border-t border-gray-50 flex items-center gap-2">
         {post.is_mine ? (
           <button className="flex-1 bg-navy/5 hover:bg-navy/10 text-navy font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.5)]">
             <Info size={18} strokeWidth={2.5} /> View Applications ({post.applications_count || 0})
           </button>
         ) : (
           <button 
             onClick={() => hasApplied ? null : setShowApplyModal(true)}
             disabled={hasApplied}
             className={`flex-1 font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 text-[15px] shadow-sm ${
               hasApplied 
                 ? 'bg-green-50 text-green-700 border border-green-200 cursor-not-allowed' 
                 : 'bg-orange-600 hover:bg-orange-700 text-white shadow-orange-600/20 active:scale-[0.98]'
             }`}
           >
             {hasApplied ? (
               <><span className="text-xl leading-none">✓</span> Application Sent</>
             ) : (
               <>Apply Now 🚀</>
             )}
           </button>
         )}

         <button className="flex-none p-3.5 px-6 rounded-xl font-bold text-gray-600 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center gap-2 text-sm">
           <MessageCircle size={18} /> {post.comments_count}
         </button>
         
         <div className="relative">
           <button ref={shareButtonRef} onClick={handleShareClick} className="flex-none p-3.5 rounded-xl font-bold text-gray-600 bg-gray-50 hover:bg-gray-100 transition-colors">
             <Share2 size={18} />
           </button>
           {sharePopoverOpen && (
             <div ref={sharePopoverRef} className="absolute bottom-full mb-2 right-0 bg-white rounded-xl shadow-2xl border border-gray-100 p-2 min-w-[200px] z-20 animate-In">
                <button onClick={() => { navigator.clipboard.writeText(postUrl); showToast('Link copied!', 'success'); setSharePopoverOpen(false); }} className="w-full text-left px-4 py-2.5 hover:bg-gray-50 rounded-lg text-sm font-bold text-gray-700">
                  Copy Link
                </button>
             </div>
           )}
         </div>
      </div>

      {/* ── APPLY MODAL ── */}
      {showApplyModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-navy/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-In">
            <div className="p-8">
              <h3 className="text-2xl font-extrabold text-gray-900 mb-2">Apply for Opportunity</h3>
              <p className="text-gray-500 font-medium mb-8 leading-relaxed">
                Connect your business directly to this opportunity by entering your AGBC Marketplace ID.
              </p>
              
              <div className="mb-8">
                <label className="block text-sm font-bold text-gray-900 mb-2.5">
                  Marketplace Account ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={marketplaceId}
                  onChange={(e) => setMarketplaceId(e.target.value)}
                  placeholder="e.g. AGBC-789234"
                  className="w-full px-5 py-4 bg-gray-50 rounded-xl border border-gray-200 focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-500/10 outline-none transition-all font-bold text-lg placeholder:font-medium placeholder:text-gray-400 text-gray-900"
                  autoFocus
                />
              </div>
              
              <div className="flex gap-4">
                <button
                  onClick={() => setShowApplyModal(false)}
                  className="flex-1 py-4 px-4 rounded-xl text-gray-600 font-bold hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApplySubmit}
                  disabled={isApplying || !marketplaceId.trim()}
                  className="flex-[2] py-4 px-4 rounded-xl bg-orange-600 text-white font-extrabold text-lg hover:bg-orange-700 disabled:opacity-50 transition-all shadow-md shadow-orange-600/20 active:scale-[0.98] flex items-center justify-center"
                >
                  {isApplying ? <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" /> : 'Confirm Application'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default OpportunityCard;
