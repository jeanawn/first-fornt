import { apiService } from './api';
import type { ApiResponse } from './api';

export interface LoadBalanceRequest {
  amount: number;
  phoneNumber: string;
  network: string;
}

export interface LoadBalanceResponse extends ApiResponse {
  success: boolean;
  transactionId: string;
  message: string;
}

// Mapping des réseaux de l'UI vers les codes API
export const NETWORK_CODES: Record<string, string> = {
  'Togocel': 'yas_tg',
  'MTN BENIN': 'mtn_bj', 
  'MOOV BENIN': 'moov_bj',
  'MOOV TOGO': 'moov_tg'
};

class BalanceService {
  async loadBalance(request: LoadBalanceRequest): Promise<LoadBalanceResponse> {
    // Les codes réseau correspondent maintenant directement aux codes API
    const response = await apiService.post<LoadBalanceResponse>('/load', request);
    
    return response;
  }
}

export const balanceService = new BalanceService();