import { apiService } from './api';

// FedaPay interfaces
export interface CreateFedapayDepositRequest {
  amount: number;
  description?: string;
}

export interface FedapayDepositResponse {
  success: boolean;
  depositId: string;
  amount: number;
  paymentUrl: string;
  status: string;
}

export interface FedapayDeposit {
  id: string;
  userId: string;
  amount: number;
  fedapayTransactionId: string;
  fedapayReference: string;
  status: 'pending' | 'approved' | 'declined' | 'canceled' | 'refunded' | 'transferred';
  paymentUrl: string;
  paymentToken: string;
  credited: boolean;
  createdAt: string;
  updatedAt: string;
}

class BalanceService {
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

  // Force verify from FedaPay API (with timeout protection)
  async forceVerifyDepositStatus(depositId: string): Promise<FedapayDeposit> {
    const response = await apiService.post<FedapayDeposit>(`/fedapay/deposits/${depositId}/verify`, {});
    return response;
  }
}

export const balanceService = new BalanceService();
