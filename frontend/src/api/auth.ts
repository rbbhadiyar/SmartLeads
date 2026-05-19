import api from './axios';
import type { User } from '../types';

interface AuthResponse {
  success: boolean;
  data: { token: string; user: User };
}

export const loginApi = (email: string, password: string) =>
  api.post<AuthResponse>('/auth/login', { email, password }).then((r) => r.data.data);

export const registerApi = (name: string, email: string, password: string, role?: string) =>
  api.post<AuthResponse>('/auth/register', { name, email, password, role }).then((r) => r.data.data);

export const getMeApi = () =>
  api.get<{ success: boolean; data: User }>('/auth/me').then((r) => r.data.data);
