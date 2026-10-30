import { apiService } from './api';
import type { ApiResponse } from './api';
import type { User } from '../types';
import { clearAppStorage } from '../utils/storage';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  referralCode?: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  otpCode: string;
  newPassword: string;
}

class AuthService {
  async login(credentials: LoginRequest): Promise<string> {
    const response = await apiService.post<ApiResponse>('/auth/login', credentials);
    const token = response.access_token;
    
    if (!token) {
      throw new Error('Token non reçu du serveur');
    }

    localStorage.setItem('auth_token', token);
    return token;
  }

  async register(userData: RegisterRequest): Promise<User> {
    const response = await apiService.post<User>('/auth/register', userData);
    return response;
  }

  async getCurrentUser(): Promise<User> {
    const response = await apiService.get<User>('/auth/me');
    return response;
  }

  async forgotPassword(email: string): Promise<void> {
    await apiService.post<ApiResponse>('/auth/forgot-password', { email });
  }

  async resetPassword(data: ResetPasswordRequest): Promise<void> {
    await apiService.post<ApiResponse>('/auth/reset-password', data);
  }

  async logout(): Promise<void> {
    try {
      // Tenter de déconnecter côté serveur
      await apiService.post('/auth/logout');
    } catch {
      // Continuer même si l'appel serveur échoue
      
    }
    
    // Nettoyage complet côté client
    this.clearAllData();
  }

  clearAllData(): void {
    // Supprimer TOUT le localStorage pour être sûr, sauf les journaux du
    // pixel : les effacer rejouerait des conversions déjà comptées
    clearAppStorage();
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('auth_token');
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }
}

export const authService = new AuthService();