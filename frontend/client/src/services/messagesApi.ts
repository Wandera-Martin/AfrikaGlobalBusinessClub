import { fetchWithAuth } from '../utils/fetchWithAuth';
import { BusinessProfile } from './businessApi';

const API_URL = 'http://127.0.0.1:8000/api/v1/messaging';

export interface Message {
  id: number;
  conversation: number;
  sender: number;
  content: string;
  is_read: boolean;
  timestamp: string;
  sender_details: BusinessProfile;
}

export interface Conversation {
  id: number;
  type: 'public_aio' | 'private_dm';
  participants: number[];
  created_at: string;
  updated_at: string;
  participants_details: BusinessProfile[];
  last_message: Message | null;
  unread_count: number;
}

export const fetchConversations = async (): Promise<Conversation[]> => {
  const response = await fetchWithAuth(`${API_URL}/conversations/`, {
    method: 'GET',
  });
  if (!response.ok) throw new Error('Failed to fetch conversations');
  return response.json();
};

export const createConversation = async (targetBusinessId: number): Promise<Conversation> => {
  const response = await fetchWithAuth(`${API_URL}/conversations/create/`, {
    method: 'POST',
    body: JSON.stringify({ target_business_id: targetBusinessId }),
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || 'Failed to start conversation');
  }
  return response.json();
};

export const fetchMessages = async (conversationId: number): Promise<Message[]> => {
  const response = await fetchWithAuth(`${API_URL}/conversations/${conversationId}/messages/`, {
    method: 'GET',
  });
  if (!response.ok) throw new Error('Failed to fetch messages');
  return response.json();
};

export const sendMessage = async (conversationId: number, content: string): Promise<Message> => {
  const response = await fetchWithAuth(`${API_URL}/conversations/${conversationId}/messages/`, {
    method: 'POST',
    body: JSON.stringify({ content }),
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.detail || 'Failed to send message');
  }
  return response.json();
};

export const markMessagesRead = async (conversationId: number) => {
  const response = await fetchWithAuth(`${API_URL}/conversations/${conversationId}/read/`, {
    method: 'POST',
  });
  if (!response.ok) throw new Error('Failed to mark read');
  return response.json();
};
