import { UserProfile, Message } from '../types';

const USERS_KEY = 'persona_ai_users';
const CHAT_PREFIX = 'persona_ai_chat_';

export const getStoredUsers = (): Record<string, UserProfile> => {
  const data = localStorage.getItem(USERS_KEY);
  return data ? JSON.parse(data) : {};
};

export const saveUserToStorage = (user: UserProfile) => {
  const users = getStoredUsers();
  users[user.uniqueId] = user;
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const getStoredChat = (userId: string, personaId: string): Message[] => {
  const key = `${CHAT_PREFIX}${userId}_${personaId}`;
  const data = localStorage.getItem(key);
  if (data) {
    // Rehydrate Date objects
    const messages = JSON.parse(data);
    return messages.map((m: any) => ({
        ...m,
        timestamp: new Date(m.timestamp)
    }));
  }
  return [];
};

export const saveChatToStorage = (userId: string, personaId: string, messages: Message[]) => {
  const key = `${CHAT_PREFIX}${userId}_${personaId}`;
  localStorage.setItem(key, JSON.stringify(messages));
};

export const deleteStoredChat = (userId: string, personaId: string) => {
  const key = `${CHAT_PREFIX}${userId}_${personaId}`;
  localStorage.removeItem(key);
};