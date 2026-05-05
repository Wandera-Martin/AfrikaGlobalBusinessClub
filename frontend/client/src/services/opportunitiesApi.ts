import { fetchWithAuth } from '../utils/fetchWithAuth';
import { Post } from './postsApi';

const OPP_API_URL = 'http://127.0.0.1:8000/api/v1/opportunities/';

export interface OpportunityApplication {
  id: number;
  opportunity: number;
  applicant: number;
  marketplace_account_id: string;
  message: string;
  status: string;
  created_at: string;
  company_name: string;
  is_verified: boolean;
}

export const fetchOpportunities = async (options?: { opportunity_type?: string; target_country?: string }): Promise<Post[]> => {
  let url = OPP_API_URL;
  if (options) {
    const params = new URLSearchParams();
    if (options.opportunity_type) params.append('opportunity_type', options.opportunity_type);
    if (options.target_country) params.append('target_country', options.target_country);
    const queryString = params.toString();
    if (queryString) url += `?${queryString}`;
  }
  
  const response = await fetchWithAuth(url, {
    method: 'GET',
  });
  if (!response.ok) throw new Error('Failed to fetch opportunities');
  return response.json();
};

export const createOpportunity = async (formData: FormData): Promise<Post> => {
  const response = await fetchWithAuth(OPP_API_URL, {
    method: 'POST',
    body: formData
  });
  if (!response.ok) throw new Error('Failed to create opportunity');
  return response.json();
};

export const applyToOpportunity = async (postId: number, marketplace_account_id: string): Promise<OpportunityApplication> => {
  const response = await fetchWithAuth(`${OPP_API_URL}${postId}/apply/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ marketplace_account_id })
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Failed to apply to opportunity');
  }
  return response.json();
};

export const fetchOpportunityApplications = async (postId: number): Promise<OpportunityApplication[]> => {
  const response = await fetchWithAuth(`${OPP_API_URL}${postId}/applications/`, {
    method: 'GET',
  });
  if (!response.ok) throw new Error('Failed to fetch applications');
  return response.json();
};

export const saveOpportunity = async (id: number): Promise<{ is_saved_by_user: boolean }> => {
  const response = await fetchWithAuth(`${OPP_API_URL}${id}/save/`, {
    method: 'POST',
  });
  if (!response.ok) throw new Error('Failed to save opportunity');
  return response.json();
};
