import { apiService } from './api';
import type { ApiResponse } from './api';

// Legacy interfaces (kept for backward compatibility)
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

// FedaPay interfaces
export interface ConvertCurrencyResponse {
  amountUsd: number;
  amountXof: number;
  rate: number;
  currency: string;
}

export interface CreateFedapayDepositRequest {
  amountUsd: number;
  description?: string;
}

export interface FedapayDepositResponse {
  success: boolean;
  depositId: string;
  amountUsd: number;
  amountXof: number;
  exchangeRate: number;
  paymentUrl: string;
  status: string;
}

export interface FedapayDeposit {
  id: string;
  userId: string;
  amountUsd: number;
  amountXof: number;
  exchangeRate: number;
  fedapayTransactionId: string;
  fedapayReference: string;
  status: 'pending' | 'approved' | 'declined' | 'canceled' | 'refunded' | 'transferred';
  paymentUrl: string;
  paymentToken: string;
  credited: boolean;
  createdAt: string;
  updatedAt: string;
}

// Mapping des réseaux de l'UI vers les codes API (legacy)
export const NETWORK_CODES: Record<string, string> = {
  'Togocel': 'yas_tg',
  'MTN BENIN': 'mtn_bj',
  'MOOV BENIN': 'moov_bj',
  'MOOV TOGO': 'moov_tg'
};

class BalanceService {
  // Legacy method
  async loadBalance(request: LoadBalanceRequest): Promise<LoadBalanceResponse> {
    const response = await apiService.post<LoadBalanceResponse>('/load', request);
    return response;
  }

  // FedaPay methods
  async convertToXof(amountUsd: number): Promise<ConvertCurrencyResponse> {
    const response = await apiService.get<ConvertCurrencyResponse>(
      `/fedapay/convert?amount=${amountUsd}`
    );
    return response;
  }

  async createFedapayDeposit(request: CreateFedapayDepositRequest): Promise<FedapayDepositResponse> {
    const response = await apiService.post<FedapayDepositResponse>('/fedapay/deposit', request);
    return response;
  }

  async getFedapayDeposits(page = 1, limit = 20): Promise<{
    deposits: FedapayDeposit[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const response = await apiService.get<{
      deposits: FedapayDeposit[];
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    }>(`/fedapay/deposits?page=${page}&limit=${limit}`);
    return response;
  }

  async getFedapayDepositById(depositId: string): Promise<FedapayDeposit> {
    const response = await apiService.get<FedapayDeposit>(`/fedapay/deposits/${depositId}`);
    return response;
  }

  async checkFedapayDepositStatus(depositId: string): Promise<FedapayDeposit> {
    const response = await apiService.post<FedapayDeposit>(`/fedapay/deposits/${depositId}/check`, {});
    return response;
  }
}

export const balanceService = new BalanceService();
