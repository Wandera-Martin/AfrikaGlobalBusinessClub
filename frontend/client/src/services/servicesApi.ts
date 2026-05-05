import { fetchWithAuth } from '../utils/fetchWithAuth';

const API_URL = 'http://127.0.0.1:8000/api/v1/services';

export interface Service {
  id: number;
  title: string;
  description: string;
  price_range: string;
  icon: string;
  is_active: boolean;
  created_at: string;
}

export const fetchServices = async (): Promise<Service[]> => {
  const response = await fetchWithAuth(`${API_URL}/`, {
    method: 'GET',
  });
  if (!response.ok) throw new Error('Failed to fetch services');
  return response.json();
};

export const applyForService = async (serviceId: number, projectRequirements: string) => {
  const response = await fetchWithAuth(`${API_URL}/${serviceId}/apply/`, {
    method: 'POST',
    body: JSON.stringify({ project_requirements: projectRequirements }),
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.detail || 'Failed to apply for service');
  }
  return response.json();
};
