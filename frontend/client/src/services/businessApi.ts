import { fetchWithAuth } from '../utils/fetchWithAuth';

const API_URL = 'http://127.0.0.1:8000/api/v1/business';

export interface BusinessProfile {
  id?: number;
  company_name: string;
  onboarding_completed: boolean;
  onboarding_skipped: boolean;
  is_verified?: boolean;
  posts_count?: number;
  applications_received_count?: number;
  primary_sector?: string;
  country?: string;
  company_description?: string;
  dp?: string;
  cover_photo?: string;
}

export const fetchBusinessProfiles = async (): Promise<BusinessProfile[]> => {
  const response = await fetchWithAuth(`${API_URL}/profiles/`, {
    method: 'GET',
  });
  
  if (!response.ok) {
    if (response.status === 404) return [];
    throw new Error('Failed to fetch business profiles');
  }
  
  return response.json();
};

export const fetchBusinessProfile = async (): Promise<BusinessProfile> => {
  const response = await fetchWithAuth(`${API_URL}/profile/`, {
    method: 'GET',
  });
  if (!response.ok) throw new Error('Failed to fetch business profile');
  return response.json();
};

export const saveBusinessProfile = async (data: any | FormData) => {
  const isFormData = data instanceof FormData;
  const response = await fetchWithAuth(`${API_URL}/profile/`, {
    method: 'POST',
    body: isFormData ? data : JSON.stringify(data),
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.detail || 'Failed to save business profile');
  }
  return response.json();
};

export const skipBusinessOnboarding = async () => {
  const response = await fetchWithAuth(`${API_URL}/profile/skip/`, {
    method: 'POST',
  });
  if (!response.ok) throw new Error('Failed to skip onboarding');
  return response.json();
};

export const fetchCountries = async () => {
  const response = await fetchWithAuth(`${API_URL}/countries/`, {
    method: 'GET',
  });
  if (!response.ok) throw new Error('Failed to fetch countries');
  return response.json();
};
