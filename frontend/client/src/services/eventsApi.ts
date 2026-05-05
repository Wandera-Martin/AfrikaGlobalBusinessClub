import { fetchWithAuth } from '../utils/fetchWithAuth';

const API_URL = 'http://127.0.0.1:8000/api/v1/events';

export interface Event {
  id: number;
  title: string;
  description: string;
  event_date: string;
  location: string;
  is_virtual: boolean;
  capacity: number | null;
  image_banner: string;
  is_active: boolean;
  registered_count: number;
  has_registered: boolean;
  created_at: string;
}

export const fetchEvents = async (): Promise<Event[]> => {
  const response = await fetchWithAuth(`${API_URL}/`, {
    method: 'GET',
  });
  if (!response.ok) throw new Error('Failed to fetch events');
  return response.json();
};

export const joinEvent = async (eventId: number) => {
  const response = await fetchWithAuth(`${API_URL}/${eventId}/join/`, {
    method: 'POST',
    body: JSON.stringify({}),
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.detail || 'Failed to join event');
  }
  return response.json();
};
