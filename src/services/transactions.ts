import { apiService } from './api';
import type { Transaction } from '../types';
class TransactionService {
  async getUserTransactions(limit: number = 10, offset: number = 0): Promise<unknown> {
    try {
      const response = await apiService.get(`/transactions?limit=${limit}&offset=${offset}`);
      return response;
    } catch (error: unknown) {
      // Si l'endpoint n'existe pas (404), retourner des données vides
      if (error && typeof error === 'object' && 'statusCode' in error && error.statusCode === 404) {
        //console.warn('Endpoint /transactions non disponible');
        return { data: [], total: 0, limit, offset };
      }
      throw error;
    }
  }

  async getRecentTransactions(limit: number = 5): Promise<Transaction[]> {
    try {
      const response = await this.getUserTransactions(limit, 0);
      if (response && typeof response === 'object' && 'data' in response && Array.isArray(response.data)) {
        return response.data as Transaction[];
      }
      return [];
    } catch {
      // Impossible de récupérer les transactions
      return [];
    }
  }

  async getTransactionById(transactionId: string): Promise<Transaction | null> {
    try {
      const response = await apiService.get(`/transactions/${transactionId}`);
      if (response && typeof response === 'object' && 'data' in response) {
        return response.data as Transaction;
      }
      return null;
    } catch {
      // Transaction non trouvée
      return null;
    }
  }
}

export const transactionService = new TransactionService();