import api from './axios';
import type { LeadFilters, LeadFormData, LeadsResponse, Lead } from '../types';

export const fetchLeads = (filters: LeadFilters) =>
  api.get<LeadsResponse>('/leads', { params: filters }).then((r) => r.data);

export const fetchLeadStats = () =>
  api.get<{ success: boolean; data: { total: number; New: number; Contacted: number; Qualified: number; Lost: number } }>('/leads/stats').then((r) => r.data.data);

export const fetchLead = (id: string) =>
  api.get<{ success: boolean; data: Lead }>(`/leads/${id}`).then((r) => r.data.data);

export const createLead = (data: LeadFormData) =>
  api.post<{ success: boolean; data: Lead }>('/leads', data).then((r) => r.data.data);

export const updateLead = (id: string, data: Partial<LeadFormData>) =>
  api.put<{ success: boolean; data: Lead }>(`/leads/${id}`, data).then((r) => r.data.data);

export const deleteLead = (id: string) =>
  api.delete(`/leads/${id}`).then((r) => r.data);

export const exportCSV = () =>
  api.get('/leads/export/csv', { responseType: 'blob' }).then((r) => r.data);
