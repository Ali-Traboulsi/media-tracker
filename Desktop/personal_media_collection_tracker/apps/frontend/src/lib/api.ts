import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001';

export interface User {
  id: string;
  email: string;
  name?: string;
}

export interface MediaItem {
  id: string;
  title: string;
  type: 'MOVIE' | 'TV_SHOW' | 'BOOK' | 'GAME' | 'PODCAST';
  status: 'WANT_TO_WATCH' | 'WATCHING' | 'COMPLETED' | 'DROPPED' | 'ON_HOLD';
  rating?: number;
  notes?: string;
  coverUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMediaItem {
  title: string;
  type: MediaItem['type'];
  status?: MediaItem['status'];
  rating?: number;
  notes?: string;
  coverUrl?: string;
}

export interface UpdateMediaItem extends Partial<CreateMediaItem> {}

class ApiService {
  private api = axios.create({
    baseURL: API_BASE_URL,
  });

  constructor() {
    // No authentication needed for demo
    // this.api.interceptors.request.use((config) => {
    //   const token = localStorage.getItem('token');
    //   if (token) {
    //     config.headers.Authorization = `Bearer ${token}`;
    //   }
    //   return config;
    // });
  }

  // Auth endpoints
  async signUp(email: string, password: string, name?: string) {
    const response = await this.api.post('/auth/signup', { email, password, name });
    return response.data;
  }

  async signIn(email: string, password: string) {
    const response = await this.api.post('/auth/signin', { email, password });
    return response.data;
  }

  async getProfile() {
    const response = await this.api.get('/auth/profile');
    return response.data;
  }

  // Media endpoints
  async getMediaItems(type?: string, status?: string): Promise<MediaItem[]> {
    const params = new URLSearchParams();
    if (type) params.append('type', type);
    if (status) params.append('status', status);
    
    const response = await this.api.get(`/media?${params.toString()}`);
    return response.data;
  }

  async createMediaItem(data: CreateMediaItem): Promise<MediaItem> {
    const response = await this.api.post('/media', data);
    return response.data;
  }

  async updateMediaItem(id: string, data: UpdateMediaItem): Promise<MediaItem> {
    const response = await this.api.patch(`/media/${id}`, data);
    return response.data;
  }

  async deleteMediaItem(id: string): Promise<void> {
    await this.api.delete(`/media/${id}`);
  }

  async searchMedia(query: string): Promise<MediaItem[]> {
    const response = await this.api.get(`/media/search?q=${encodeURIComponent(query)}`);
    return response.data;
  }

  async getMediaStats() {
    const response = await this.api.get('/media/stats');
    return response.data;
  }

  // AI endpoints
  async getRecommendations(mediaType?: string) {
    const params = mediaType ? `?type=${mediaType}` : '';
    const response = await this.api.get(`/ai/recommendations${params}`);
    return response.data;
  }

  async getMediaInsights() {
    const response = await this.api.get('/ai/insights');
    return response.data;
  }
}

export const apiService = new ApiService();
