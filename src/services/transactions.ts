import { apiService } from './api';
import type { Transaction } from '../types';

interface TransactionsResponse {
  data: Transaction[];
  total: number;
  limit: number;
  offset: number;
}

class TransactionService {
  async getUserTransactions(limit: number = 10, offset: number = 0): Promise<TransactionsResponse> {
    try {
      const response = await apiService.get(`/transactions?limit=${limit}&offset=${offset}`);
      return response;
    } catch (error: unknown) {
      // Si l'endpoint n'existe pas (404), retourner des données vides
      if ((error as any)?.statusCode === 404) {
        //console.warn('Endpoint /transactions non disponible');
        return { data: [], total: 0, limit, offset };
      }
      throw error;
    }
  }

  async getRecentTransactions(limit: number = 5): Promise<Transaction[]> {
    try {
      const response = await this.getUserTransactions(limit, 0);
      return response.data || [];
    } catch (error) {
      console.warn('Impossible de récupérer les transactions:', error);
      return [];
    }
  }

  async getTransactionById(transactionId: string): Promise<Transaction> {
    const response = await apiService.get(`/transactions/${transactionId}`);
    return response;
  }
}

export const transactionService = new TransactionService();