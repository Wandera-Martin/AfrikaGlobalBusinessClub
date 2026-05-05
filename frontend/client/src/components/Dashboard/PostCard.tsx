import React, { useState, useRef, useEffect } from 'react';
import { Post, Comment, fetchComments, createComment } from '../../services/postsApi';
import { applyToOpportunity } from '../../services/opportunitiesApi';
import { useToast } from '../../context/ToastContext';

// Simple helper to get time ago
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

interface PostCardProps {
  post: Post;
  onLike: (id: number) => void;
  onShare: (id: number) => void;
  onDelete: (id: number) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onLike, onShare, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [sharePopoverOpen, setSharePopoverOpen] = useState(false);
  const shareButtonRef = useRef<HTMLButtonElement>(null);
  const sharePopoverRef = useRef<HTMLDivElement>(null);
  const { showToast } = useToast();

  // Comments State
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  // Opportunity State
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [marketplaceId, setMarketplaceId] = useState('');
  const [isApplying, setIsApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(post.has_applied || false);

  const displayedCommentsCount = Math.max(post.comments_count, comments.length);

  const handleToggleComments = async () => {
    if (!showComments) {
      setShowComments(true);
      setIsLoadingComments(true);
      try {
        const data = await fetchComments(post.id);
        setComments(data);
      } catch (err) {
        console.error("Failed to load comments");
      } finally {
        setIsLoadingComments(false);
      }
    } else {
      setShowComments(false);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setIsSubmittingComment(true);
    try {
      const added = await createComment(post.id, newComment);
      setComments([...comments, added]);
      setNewComment('');
    } catch (err) {
      console.error("Failed to post comment");
    } finally {
      setIsSubmittingComment(false);
    }
  };

  // Close share popover when clicking outside
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

  const postUrl = `${window.location.origin}/posts/${post.slug || post.id}`;
  const shareText = post.title ? `Check out "${post.title}" on AGBC Network` : `Check out this post on AGBC Network`;

  const handleShareClick = async () => {
    // Try native Web Share API first (great on mobile)
    if (navigator.share) {
      try {
        await navigator.share({ title: shareText, url: postUrl });
        onShare(post.id); // increment backend counter
        return;
      } catch (err) {
        // User cancelled share dialog — do nothing
        if ((err as Error).name === 'AbortError') return;
      }
    }
    // Fallback: toggle the custom popover on desktop
    setSharePopoverOpen(prev => !prev);
  };

  const handleShareViaWhatsApp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(shareText + '\n' + postUrl)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    onShare(post.id);
    setSharePopoverOpen(false);
  };

  const handleShareViaEmail = () => {
    const subject = encodeURIComponent(shareText);
    const body = encodeURIComponent(`${shareText}\n\n${postUrl}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
    onShare(post.id);
    setSharePopoverOpen(false);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(postUrl);
      showToast('Link copied to clipboard! 📋', 'success');
      onShare(post.id);
    } catch {
      showToast('Failed to copy link.', 'error');
    }
    setSharePopoverOpen(false);
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
      showToast('Successfully applied to opportunity!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to apply.', 'error');
    } finally {
      setIsApplying(false);
    }
  };

  // Truncate logic
  const MAX_LENGTH = 180;
  const shouldTruncate = post.content.length > MAX_LENGTH;
  const displayedContent = !isExpanded && shouldTruncate 
    ? post.content.substring(0, MAX_LENGTH) + '...' 
    : post.content;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
      
      {/* ── HEADER ── */}
      <div className="px-5 pt-5 flex justify-between items-start">
        <div className="flex gap-3">
          {/* Avatar */}
          <div className="w-12 h-12 rounded-full overflow-hidden bg-navy flex items-center justify-center text-white font-bold shrink-0 shadow-sm">
            {post.company_name?.charAt(0) || 'B'}
          </div>
          
          {/* Author Info */}
          <div>
            <h4 className="font-bold text-gray-900 leading-tight">
              {post.company_name || 'Verified Business'}
            </h4>
            
            <div className="flex items-center gap-1 text-sm mt-0.5">
              {post.is_verified ? (
                <>
                  <span className="text-green-600 font-bold flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                    4.8
                  </span>
                  <span className="text-gray-500 line-clamp-1">
                    Verified Partner at AGBC Network
                  </span>
                </>
              ) : (
                <span className="text-gray-500 line-clamp-1">
                  Business Network Member
                </span>
              )}
            </div>

            <div className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
              {timeAgo(post.updated_at)} • 
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
            </div>
          </div>
        </div>

        {/* Options Menu (Delete) — only shown to post owner */}
        {post.is_mine && (
          <div className="relative">
            <button 
              onClick={() => setShowOptions(!showOptions)}
              className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>
            </button>
            {showOptions && (
              <div className="absolute right-0 mt-1 w-32 bg-white rounded-lg shadow-lg border border-gray-100 z-10 py-1">
                <button 
                  onClick={() => {
                    setShowOptions(false);
                    onDelete(post.id);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors font-medium"
                >
                  Delete Post
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── CONTENT ── */}
      <div className="px-5 mt-4">
        {post.post_type === 'article' && post.title && (
          <h3 className="font-extrabold text-xl text-gray-900 mb-2 leading-snug">{post.title}</h3>
        )}
        <p className="text-gray-800 text-[15px] leading-relaxed whitespace-pre-wrap font-medium">
          {displayedContent}
          {shouldTruncate && !isExpanded && (
            <button 
              onClick={() => setIsExpanded(true)}
              className="ml-1 text-orange-600 hover:underline font-bold"
            >
              Read More
            </button>
          )}
        </p>
      </div>

      {/* ── MEDIA ── */}
      {post.post_type === 'media' && post.media_file && (
        <div className="mt-4 w-full bg-gray-50 flex items-center justify-center border-t border-b border-gray-100/50">
          {post.media_type === 'video' ? (
            <video 
              src={post.media_file.startsWith('http') ? post.media_file : `http://127.0.0.1:8000${post.media_file}`} 
              controls 
              className="w-full max-h-[500px] object-cover" 
            />
          ) : (
            <img 
              src={post.media_file.startsWith('http') ? post.media_file : `http://127.0.0.1:8000${post.media_file}`} 
              alt="Post media" 
              className="w-full max-h-[500px] object-cover" 
            />
          )}
        </div>
      )}

      {/* ── REACTION METRICS ── */}
      <div className="px-5 py-3 flex justify-between items-center text-xs text-gray-500 font-medium">
        {/* Left Side: Likes count */}
        <div className="flex items-center gap-1.5 cursor-pointer hover:underline">
          <div className="flex -space-x-1">
            <div className="w-5 h-5 rounded-full bg-orange-100 flex items-center justify-center text-[10px] text-orange-600 border-2 border-white z-10">
              👍
            </div>
            {post.likes_count > 1 && (
              <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-[10px] text-blue-600 border-2 border-white z-0">
                💡
              </div>
            )}
          </div>
          <span>
            {post.likes_count > 0 
              ? `${post.likes_count} like${post.likes_count !== 1 ? 's' : ''}`
              : 'Be the first to like this'}
          </span>
        </div>

        {/* Right Side: Comments / Shares stats */}
        <div className="flex items-center gap-2 cursor-pointer hover:underline" onClick={handleToggleComments}>
          <span>{displayedCommentsCount} comment{displayedCommentsCount !== 1 ? 's' : ''}</span>
          <span>•</span>
          <span>{post.shares_count} shares</span>
        </div>
      </div>

      {/* ── ACTION BAR ── */}
      <div className="px-3 pb-2">
        <div className="border-t border-gray-100 flex justify-between items-center pt-1">
          
          {post.post_type === 'opportunity' ? (
            post.is_mine ? (
              <button 
                onClick={() => {/* Open Applications Drawer (implemented later) */}}
                className="flex-1 flex items-center justify-center py-3 rounded-xl transition-all font-bold text-sm text-navy hover:bg-navy/5"
              >
                📥 View Applications ({post.applications_count || 0})
              </button>
            ) : (
              <button 
                onClick={() => hasApplied ? null : setShowApplyModal(true)}
                disabled={hasApplied}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all font-bold text-sm ${
                  hasApplied 
                    ? 'text-green-600 bg-green-50' 
                    : 'text-white bg-orange-600 hover:bg-orange-700 mx-1 shadow-sm'
                }`}
              >
                {hasApplied ? '✓ Applied' : '👋 Apply Now'}
              </button>
            )
          ) : (
            <button 
              onClick={() => onLike(post.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all font-semibold text-sm ${
                post.is_liked_by_user 
                  ? 'text-orange-600 hover:bg-orange-50' 
                  : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              <svg className={`w-5 h-5 ${post.is_liked_by_user ? 'fill-current' : 'fill-none stroke-current stroke-2'}`} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
              </svg>
              Like
            </button>
          )}
          
          <button 
            onClick={handleToggleComments}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all font-semibold text-sm ${
              showComments ? 'text-orange-600 bg-orange-50' : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            <svg className="w-5 h-5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
            </svg>
            Comment
          </button>
          
          {/* Share Button + Popover */}
          <div className="flex-1 relative">
            <button
              ref={shareButtonRef}
              onClick={handleShareClick}
              className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl transition-all font-semibold text-sm ${
                sharePopoverOpen ? 'text-orange-600 bg-orange-50' : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              <svg className="w-5 h-5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                <circle cx="18" cy="5" r="3"></circle>
                <circle cx="6" cy="12" r="3"></circle>
                <circle cx="18" cy="19" r="3"></circle>
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
              </svg>
              Share
            </button>

            {/* Share Popover */}
            {sharePopoverOpen && (
              <div
                ref={sharePopoverRef}
                style={{
                  position: 'absolute',
                  bottom: 'calc(100% + 8px)',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: '#fff',
                  borderRadius: '14px',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
                  border: '1px solid #f1f5f9',
                  minWidth: '200px',
                  zIndex: 50,
                  overflow: 'hidden',
                  animation: 'slideUpModal 0.2s ease',
                }}
              >
                <div style={{ padding: '10px 6px 6px', borderBottom: '1px solid #f1f5f9', textAlign: 'center', fontSize: '11px', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                  Share via
                </div>
                {/* WhatsApp */}
                <button
                  onClick={handleShareViaWhatsApp}
                  style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '12px 16px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: 600, color: '#1a1a1a', transition: 'background 0.15s' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#f0fdf4')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'none')}
                >
                  <svg viewBox="0 0 24 24" style={{ width: 20, height: 20, fill: '#25D366', flexShrink: 0 }}>
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  WhatsApp
                </button>
                {/* Email */}
                <button
                  onClick={handleShareViaEmail}
                  style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '12px 16px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: 600, color: '#1a1a1a', transition: 'background 0.15s' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#eff6ff')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'none')}
                >
                  <svg viewBox="0 0 24 24" style={{ width: 20, height: 20, fill: '#3b82f6', flexShrink: 0 }}>
                    <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                  </svg>
                  Email
                </button>
                {/* Copy Link */}
                <button
                  onClick={handleCopyLink}
                  style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '12px 16px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: 600, color: '#1a1a1a', transition: 'background 0.15s', borderTop: '1px solid #f1f5f9' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#f8fafc')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'none')}
                >
                  <svg viewBox="0 0 24 24" style={{ width: 20, height: 20, fill: '#64748b', flexShrink: 0 }}>
                    <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
                  </svg>
                  Copy Link
                </button>
              </div>
            )}
          </div>
          
        </div>
      </div>

      {/* ── COMMENTS SECTION ── */}
      {showComments && (
        <div className="px-5 pb-5 pt-3 bg-gray-50 border-t border-gray-100">
          {/* New Comment Input */}
          <form onSubmit={handleCommentSubmit} className="flex gap-3 mb-5">
            <div className="w-8 h-8 rounded-full bg-navy flex items-center justify-center text-white text-xs font-bold shrink-0 mt-0.5 shadow-sm">
              Me
            </div>
            <div className="flex-1 flex items-stretch rounded-2xl border border-gray-200 bg-white overflow-hidden focus-within:ring-2 focus-within:ring-orange-500/50 focus-within:border-orange-500 transition-all shadow-sm">
              <input 
                type="text" 
                className="flex-1 px-4 py-2.5 text-sm focus:outline-none bg-transparent" 
                placeholder="Add a comment..." 
                value={newComment} 
                onChange={e => setNewComment(e.target.value)} 
                disabled={isSubmittingComment} 
              />
              <button 
                type="submit" 
                disabled={isSubmittingComment || !newComment.trim()} 
                className="px-4 font-bold text-orange-600 disabled:opacity-40 hover:bg-orange-50 transition-colors text-sm"
              >
                Post
              </button>
            </div>
          </form>

          {/* Comments List */}
          {isLoadingComments ? (
            <div className="text-center text-sm text-gray-500 py-4 font-medium animate-pulse">Loading comments...</div>
          ) : comments.length === 0 ? (
            <div className="text-center text-sm text-gray-400 py-6 font-medium">No comments yet. Be the first to start the conversation!</div>
          ) : (
            <div className="space-y-4">
              {comments.map(c => (
                <div key={c.id} className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-navy flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-sm">
                    {c.company_name?.charAt(0) || 'B'}
                  </div>
                  <div className="bg-white px-4 py-3 rounded-2xl border border-gray-100 shadow-sm flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h5 className="font-bold text-sm text-gray-900 flex items-center gap-1">
                        {c.company_name}
                        {c.is_verified && (
                          <span className="text-green-600">
                            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                          </span>
                        )}
                      </h5>
                      <span className="text-[11px] font-medium text-gray-400">{timeAgo(c.created_at)}</span>
                    </div>
                    <p className="text-[14px] text-gray-700 leading-relaxed font-medium">{c.content}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── APPLY MODAL ── */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-In">
            <div className="p-6">
              <div className="flex justify-between items-center mb-5">
                <h3 className="text-xl font-bold text-gray-900">Apply to Opportunity</h3>
                <button 
                  onClick={() => setShowApplyModal(false)}
                  className="text-gray-400 hover:text-gray-600 rounded-full p-1"
                >
                  ✕
                </button>
              </div>
              
              <p className="text-gray-600 mb-6 font-medium">
                To apply for this trade opportunity, please provide your Network Marketplace Account ID. The poster will review your account and contact you.
              </p>
              
              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Marketplace Account ID
                </label>
                <input
                  type="text"
                  value={marketplaceId}
                  onChange={(e) => setMarketplaceId(e.target.value)}
                  placeholder="e.g. AGBC-789234"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-navy focus:ring-2 focus:ring-navy/20 outline-none transition-all font-medium"
                  autoFocus
                />
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowApplyModal(false)}
                  className="flex-1 py-3 px-4 rounded-xl border border-gray-200 text-gray-700 font-bold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApplySubmit}
                  disabled={isApplying || !marketplaceId.trim()}
                  className="flex-1 py-3 px-4 rounded-xl bg-orange-600 text-white font-bold hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex justify-center items-center"
                >
                  {isApplying ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    'Submit Application'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default PostCard;
