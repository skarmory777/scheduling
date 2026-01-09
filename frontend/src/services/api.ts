import { Appointment, Service } from '@/types';
import axios from 'axios';

// Base URL da API
const API_BASE_URL = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL + '/api'
  : '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token em todas as requisições
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para tratar erros de autenticação
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const servicesApi = {
  getServices: () => api.get<Service[]>('/services'),
  createService: (data: Partial<Service>) => api.post<Service[]>('/services', data),
}

export const appointmentsApi = {
  getAppointments: () => api.get<Appointment[]>('/appointments'),
  createAppointment: (data: Partial<Appointment>) => api.post<Appointment>('/appointments', data),
  cancelAppointment: (appointmentId: string, cancelReason: string) => api.delete(`/appointments/${appointmentId}`, { data: { cancelReason } }),
}

export const professionalsApi = {
  getProfessionalsByService: (serviceId: string) => api.get(`/professionals?serviceId=${serviceId}`),
}

export const availabilityApi = {
  getAvailability: (professionalId: string, date: string) =>
    api.get(`/availability?professionalId=${professionalId}&date=${date}`),
}
export default api;
