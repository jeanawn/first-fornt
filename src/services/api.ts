const API_BASE_URL = 'https://api.teranum.com';

export interface ApiResponse<T = unknown> {
  success?: boolean;
  data?: T;
  message?: string;
  access_token?: string;
}

export interface ApiError {
  success: false;
  message: string;
  statusCode?: number;
}

class ApiService {
  private getAuthHeader(): HeadersInit {
    const token = localStorage.getItem('auth_token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    const data = await response.json();
    
    if (!response.ok) {
      // Si token invalide ou expiré, nettoyer automatiquement
      if (response.status === 401 || response.status === 403) {
        localStorage.clear();
        window.location.reload();
      }
      
      // Gestion des erreurs HTTP
      const error: ApiError = {
        success: false,
        message: data.message || `HTTP Error ${response.status}`,
        statusCode: response.status
      };
      throw error;
    }

    // Gestion des erreurs API (success: false)
    if (data.success === false) {
      const error: ApiError = {
        success: false,
        message: data.message || 'Une erreur est survenue',
      };
      throw error;
    }

    return data;
  }

  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeader(),
      },
    });

    return this.handleResponse<T>(response);
  }

  async post<T>(endpoint: string, body?: unknown): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeader(),
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    return this.handleResponse<T>(response);
  }

  async patch<T>(endpoint: string, body?: unknown): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeader(),
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    return this.handleResponse<T>(response);
  }
}

export const apiService = new ApiService();