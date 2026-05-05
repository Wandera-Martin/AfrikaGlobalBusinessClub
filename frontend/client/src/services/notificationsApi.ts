import { fetchWithAuth } from '../utils/fetchWithAuth';

const API_URL = 'http://127.0.0.1:8000/api/v1/notifications/';

export interface Notification {
  id: number;
  notification_type: 'LIKE' | 'COMMENT' | 'APPLY' | 'MESSAGE' | 'SYSTEM';
  message: string;
  is_read: boolean;
  created_at: string;
  actor_name?: string;
  actor_id?: number;
  content_model?: string;
  object_id?: number;
}

export const fetchNotifications = async (): Promise<Notification[]> => {
  const response = await fetchWithAuth(API_URL, {
    method: 'GET',
  });
  if (!response.ok) throw new Error('Failed to fetch notifications');
  return response.json();
};

export const markNotificationRead = async (id: number): Promise<void> => {
  const response = await fetchWithAuth(`${API_URL}${id}/read/`, {
    method: 'PATCH',
  });
  if (!response.ok) throw new Error('Failed to mark notification as read');
};

export const markAllNotificationsRead = async (): Promise<{ status: string }> => {
  const response = await fetchWithAuth(`${API_URL}mark_all_read/`, {
    method: 'POST',
  });
  if (!response.ok) throw new Error('Failed to mark all notifications as read');
  return response.json();
};
