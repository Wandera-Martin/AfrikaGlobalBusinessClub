import { fetchWithAuth } from '../utils/fetchWithAuth';

const API_URL = 'http://127.0.0.1:8000/api/v1/feed/posts/';

export interface Post {
  id: number;
  post_type: 'text' | 'media' | 'article' | 'opportunity';
  content: string;
  title?: string;
  cover_image?: string | null;
  media_file?: string | null;
  media_type?: string | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  company_name: string;
  likes_count: number;
  comments_count: number;
  shares_count: number;
  is_liked_by_user: boolean;
  is_mine: boolean;
  slug: string;
  is_open?: boolean;
  is_verified?: boolean;
  has_applied?: boolean;
  applications_count?: number;
  author_business_id?: number;
  is_saved_by_user?: boolean;
  opportunity_details?: {
    opportunity_type: string;
    currency: string;
    min_value?: string;
    max_value?: string;
    min_value_usd?: string;
    max_value_usd?: string;
    deadline?: string;
    target_country?: string;
    is_featured: boolean;
  } | null;
}

export const fetchPosts = async (options?: { type?: string; exclude_type?: string; opportunity_type?: string }): Promise<Post[]> => {
  let url = API_URL;
  if (options) {
    const params = new URLSearchParams();
    if (options.type) params.append('type', options.type);
    if (options.exclude_type) params.append('exclude_type', options.exclude_type);
    if (options.opportunity_type) params.append('opportunity_type', options.opportunity_type);
    const queryString = params.toString();
    if (queryString) url += `?${queryString}`;
  }
  
  const response = await fetchWithAuth(url, {
    method: 'GET',
  });
  if (!response.ok) throw new Error('Failed to fetch posts');
  return response.json();
};

export const createPost = async (formData: FormData): Promise<Post> => {
  const response = await fetchWithAuth(API_URL, {
    method: 'POST',
    body: formData
  });
  if (!response.ok) throw new Error('Failed to create post');
  return response.json();
};

export const deletePost = async (id: number): Promise<void> => {
  const response = await fetchWithAuth(`${API_URL}${id}/`, {
    method: 'DELETE',
  });
  if (!response.ok && response.status !== 204) throw new Error('Failed to delete post');
};

export const toggleLike = async (id: number): Promise<{ likes_count: number, is_liked_by_user: boolean }> => {
  const response = await fetchWithAuth(`${API_URL}${id}/like/`, {
    method: 'POST',
  });
  if (!response.ok) throw new Error('Failed to toggle like');
  return response.json();
};

export const sharePost = async (id: number): Promise<{ shares_count: number }> => {
  const response = await fetchWithAuth(`${API_URL}${id}/share/`, {
    method: 'POST',
  });
  if (!response.ok) throw new Error('Failed to share post');
  return response.json();
};

export const savePost = async (id: number): Promise<{ is_saved_by_user: boolean }> => {
  const response = await fetchWithAuth(`${API_URL}${id}/save/`, {
    method: 'POST',
  });
  if (!response.ok) throw new Error('Failed to save post');
  return response.json();
};

export interface Comment {
  id: number;
  post: number;
  business: number;
  content: string;
  created_at: string;
  updated_at: string;
  company_name: string;
  is_verified: boolean;
}

export const fetchComments = async (postId: number): Promise<Comment[]> => {
  const response = await fetchWithAuth(`${API_URL}${postId}/comments/`, {
    method: 'GET',
  });
  if (!response.ok) throw new Error('Failed to fetch comments');
  return response.json();
};

export const createComment = async (postId: number, content: string): Promise<Comment> => {
  const response = await fetchWithAuth(`${API_URL}${postId}/comments/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ content })
  });
  if (!response.ok) throw new Error('Failed to create comment');
  return response.json();
};
