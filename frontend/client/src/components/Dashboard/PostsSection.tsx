import React, { useState, useEffect } from 'react';
import { fetchPosts, createPost, deletePost, toggleLike, sharePost, Post } from '../../services/postsApi';
import { createOpportunity } from '../../services/opportunitiesApi';
import PostCard from './PostCard';
import OpportunityCard from '../Opportunities/OpportunityCard';
import ConfirmModal from '../ConfirmModal';
import { useToast } from '../../context/ToastContext';

interface PostsSectionProps {
  filterType?: string;
  excludeType?: string;
  oppType?: string;
  hideComposer?: boolean;
  allowedTypes?: ('text' | 'media' | 'article' | 'opportunity')[];
  composerTitle?: string;
  feedTitle?: string;
}

const PostsSection: React.FC<PostsSectionProps> = ({ 
  filterType, 
  excludeType, 
  oppType,
  hideComposer,
  allowedTypes = ['text', 'media', 'article', 'opportunity'],
  composerTitle = 'Create a post',
  feedTitle = 'Business Network Feed',
}) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  // Composer state
  const [postType, setPostType] = useState<'text' | 'media' | 'article' | 'opportunity'>(allowedTypes[0] || 'text');
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);

  // Opportunity specific state
  const [optType, setOptType] = useState('supply_lead');
  const [currency, setCurrency] = useState('USD');
  const [minValue, setMinValue] = useState('');
  const [maxValue, setMaxValue] = useState('');
  const [deadline, setDeadline] = useState('');
  const [targetCountry, setTargetCountry] = useState('');

  // Confirm modal state
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadPosts();
  }, [filterType, excludeType, oppType]);

  const loadPosts = async () => {
    setLoading(true);
    try {
      const data = await fetchPosts({ type: filterType, exclude_type: excludeType, opportunity_type: oppType });
      setPosts(data);
    } catch (err) {
      console.error('Failed to load posts', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && postType !== 'media') return;
    
    setIsPublishing(true);
    try {
      const formData = new FormData();
      formData.append('post_type', postType);
      formData.append('content', content);
      
      if (postType === 'article' || postType === 'opportunity') {
        formData.append('title', title);
      }
      if (postType === 'opportunity') {
        const oppDetails = {
          opportunity_type: optType,
          currency: currency,
          min_value: minValue ? parseFloat(minValue) : null,
          max_value: maxValue ? parseFloat(maxValue) : null,
          deadline: deadline || null,
          target_country: targetCountry || null
        };
        formData.append('opportunity_details', JSON.stringify(oppDetails));
      }
      if (postType === 'media' && mediaFile) {
        formData.append('media_file', mediaFile);
        formData.append('media_type', mediaFile.type.startsWith('video/') ? 'video' : 'image');
      }

      let newPost: Post;
      if (postType === 'opportunity') {
        newPost = await createOpportunity(formData);
      } else {
        newPost = await createPost(formData);
      }
      
      // Reset composer
      setContent('');
      setTitle('');
      setMediaFile(null);
      setPostType('text');
      setOptType('supply_lead');
      setCurrency('USD');
      setMinValue('');
      setMaxValue('');
      setDeadline('');
      setTargetCountry('');
      
      // Optimistically update feed
      setPosts(prevPosts => [newPost, ...prevPosts]);
      showToast('Post published successfully! 🎉');
    } catch (err) {
      console.error('Failed to publish post', err);
      showToast('Failed to publish post. Please try again.', 'error');
    } finally {
      setIsPublishing(false);
    }
  };

  // Step 1: User clicks delete → open confirm modal
  const handleDelete = (id: number) => {
    setPendingDeleteId(id);
    setConfirmOpen(true);
  };

  // Step 2: User confirms → actually delete
  const handleConfirmDelete = async () => {
    if (pendingDeleteId === null) return;
    setIsDeleting(true);
    try {
      await deletePost(pendingDeleteId);
      setPosts(prev => prev.filter(p => p.id !== pendingDeleteId));
      showToast('Post deleted successfully.', 'success');
    } catch (err) {
      console.error('Failed to delete post', err);
      showToast('Failed to delete post. Please try again.', 'error');
    } finally {
      setIsDeleting(false);
      setConfirmOpen(false);
      setPendingDeleteId(null);
    }
  };

  const handleCancelDelete = () => {
    setConfirmOpen(false);
    setPendingDeleteId(null);
  };

  const handleLike = async (id: number) => {
    try {
      const result = await toggleLike(id);
      setPosts(posts.map(p => p.id === id ? {
        ...p,
        likes_count: result.likes_count,
        is_liked_by_user: result.is_liked_by_user
      } : p));
    } catch (err) {
      console.error('Failed to like post', err);
    }
  };

  const handleShare = async (id: number) => {
    try {
      const result = await sharePost(id);
      setPosts(posts.map(p => p.id === id ? {
        ...p,
        shares_count: result.shares_count
      } : p));
      showToast('Post shared on your timeline! 🔗', 'info');
    } catch (err) {
      console.error('Failed to share post', err);
      showToast('Failed to share post. Please try again.', 'error');
    }
  };

  const handleSaveToggle = (id: number, isSaved: boolean) => {
    setPosts(posts.map(p => p.id === id ? {
      ...p,
      is_saved_by_user: isSaved
    } : p));
  };

  return (
    <div className="mt-12 space-y-8">
      {/* ── CONFIRM MODAL ── */}
      <ConfirmModal
        isOpen={confirmOpen}
        title="Delete Post"
        message="Are you sure you want to delete this post? This action cannot be undone."
        confirmLabel={isDeleting ? 'Deleting...' : 'Delete'}
        cancelLabel="Keep Post"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        danger
      />

      {/* ── COMPOSER ── */}
      {!hideComposer && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-gray-50/50 border-b border-gray-100 flex items-center px-6 py-4">
          <h2 className="font-bold text-gray-800 flex items-center gap-2">
            <span className="text-xl">✍️</span> {composerTitle}
          </h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="flex gap-4 mb-4">
            {allowedTypes.includes('text') && (
            <button
              type="button"
              onClick={() => setPostType('text')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${postType === 'text' ? 'bg-navy text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
            >
              Text
            </button>
            )}
            {allowedTypes.includes('media') && (
            <button
              type="button"
              onClick={() => setPostType('media')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${postType === 'media' ? 'bg-navy text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
            >
              Media (Photo/Video)
            </button>
            )}
            {allowedTypes.includes('article') && (
            <button
              type="button"
              onClick={() => setPostType('article')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${postType === 'article' ? 'bg-navy text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
            >
              Article
            </button>
            )}
            {allowedTypes.includes('opportunity') && (
            <button
              type="button"
              onClick={() => setPostType('opportunity')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-colors ${postType === 'opportunity' ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20' : 'bg-orange-50 text-orange-600 hover:bg-orange-100 hover:shadow-sm'}`}
            >
              Trade Opportunity ✨
            </button>
            )}
          </div>

          {['article', 'opportunity'].includes(postType) && (
            <input
              type="text"
              placeholder={postType === 'opportunity' ? "Opportunity Title (e.g. Export Partner Needed)..." : "Article Title..."}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full mb-3 px-4 py-3 bg-gray-50 border border-transparent focus:border-orange-500 focus:bg-white focus:ring-0 rounded-xl font-bold text-lg placeholder-gray-400 transition-all"
              required
            />
          )}

          {postType === 'opportunity' && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">Type</label>
                <select value={optType} onChange={e => setOptType(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-transparent focus:border-orange-500 focus:bg-white rounded-xl font-bold text-gray-700 outline-none">
                  <option value="supply_lead">Supply Lead</option>
                  <option value="grant">Grant</option>
                  <option value="partnership">Partnership</option>
                  <option value="export_contract">Export Contract</option>
                  <option value="investment">Investment</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">Currency</label>
                <select value={currency} onChange={e => setCurrency(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-transparent focus:border-orange-500 focus:bg-white rounded-xl font-bold text-gray-700 outline-none">
                  <option value="USD">USD ($)</option>
                  <option value="NGN">NGN (₦)</option>
                  <option value="KES">KES (KSh)</option>
                  <option value="ZAR">ZAR (R)</option>
                  <option value="EUR">EUR (€)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">Location / Country</label>
                <input type="text" value={targetCountry} onChange={e => setTargetCountry(e.target.value)} placeholder="e.g. Nigeria" className="w-full px-4 py-3 bg-gray-50 border border-transparent focus:border-orange-500 focus:bg-white rounded-xl font-bold text-gray-700 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">Min Value</label>
                <input type="number" value={minValue} onChange={e => setMinValue(e.target.value)} placeholder="0.00" className="w-full px-4 py-3 bg-gray-50 border border-transparent focus:border-orange-500 focus:bg-white rounded-xl font-bold text-gray-700 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">Max Value</label>
                <input type="number" value={maxValue} onChange={e => setMaxValue(e.target.value)} placeholder="0.00" className="w-full px-4 py-3 bg-gray-50 border border-transparent focus:border-orange-500 focus:bg-white rounded-xl font-bold text-gray-700 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">Deadline</label>
                <input type="date" value={deadline} onChange={e => setDeadline(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-transparent focus:border-orange-500 focus:bg-white rounded-xl font-bold text-gray-700 outline-none" />
              </div>
            </div>
          )}

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={
              postType === 'text' ? "What's on your mind?" :
              postType === 'media' ? "Add a caption to your media..." :
              postType === 'opportunity' ? "Describe the trade opportunity in detail. Include requirements, volume, pricing, or any constraints..." :
              "Write your article body here..."
            }
            className="w-full px-4 py-3 bg-gray-50 border-transparent focus:border-orange-500 focus:bg-white focus:ring-0 rounded-xl resize-none h-32 placeholder-gray-400 transition-all"
            required={postType !== 'media'}
          />

          {postType === 'media' && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Upload Photo or Video</label>
              <input
                type="file"
                accept="image/*,video/*"
                onChange={(e) => setMediaFile(e.target.files?.[0] || null)}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100 cursor-pointer"
                required
              />
            </div>
          )}

          <div className="mt-4 flex justify-end">
            <button
              type="submit"
              disabled={isPublishing}
              className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-bold rounded-xl shadow-sm transition-all disabled:opacity-50"
            >
              {isPublishing ? 'Publishing...' : 'Publish'}
            </button>
          </div>
        </form>
      </div>
      )}

      {/* ── FEED ── */}
      <div>
        <h3 className="font-extrabold text-2xl text-gray-800 mb-6">{feedTitle}</h3>
        {loading ? (
          <div className="text-center text-gray-500 py-10 fade-in">Loading posts...</div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 shadow-sm text-gray-500">
            You haven't published any posts yet.<br/>Create your first post above to start engaging with partners!
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map(post => {
              if (post.post_type === 'opportunity') {
                return (
                  <OpportunityCard 
                    key={post.id}
                    post={post}
                    onShare={handleShare}
                    onDelete={handleDelete}
                    onSaveToggle={handleSaveToggle}
                  />
                );
              }
              return (
                <PostCard 
                  key={post.id} 
                  post={post} 
                  onLike={handleLike} 
                  onShare={handleShare} 
                  onDelete={handleDelete} 
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default PostsSection;
