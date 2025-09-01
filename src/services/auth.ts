import { apiService } from './api';
import type { ApiResponse } from './api';
import type { User } from '../types';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface VerifyOtpRequest {
  email: string;
  otpCode: string;
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

  async verifyOtp(data: VerifyOtpRequest): Promise<void> {
    await apiService.post<ApiResponse>('/auth/verify-forgot-password-otp', data);
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
    // Supprimer TOUT le localStorage pour être sûr
    localStorage.clear();
    
    // Alternative plus ciblée si localStorage.clear() pose problème
    // localStorage.removeItem('auth_token');
    // localStorage.removeItem('userPreferences');
    // 
    // const keysToRemove: string[] = [];
    // for (let i = 0; i < localStorage.length; i++) {
    //   const key = localStorage.key(i);
    //   if (key) {
    //     keysToRemove.push(key);
    //   }
    // }
    // keysToRemove.forEach(key => localStorage.removeItem(key));
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('auth_token');
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }
}

export const authService = new AuthService();