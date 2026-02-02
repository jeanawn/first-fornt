import { apiService } from './api';

// ============ TYPES ============

export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalOperations: number;
  successfulOperations: number;
  failedOperations: number;
  pendingOperations: number;
  totalRevenue: number;
  totalRefunds: number;
}

export interface DailyStats {
  date: string;
  newUsers: number;
  operations: number;
  successfulOperations: number;
  failedOperations: number;
  revenue: number;
  refunds: number;
}

export interface ServicePricing {
  id: string;
  serviceCode: string;
  countryCode: string;
  price: number;
  currency: string;
  costPrice?: number;
  margin?: number;
  isActive: boolean;
  lastUpdatedBy?: string;
  createdDate: string;
  updatedAt: string;
}

export interface ExchangeRate {
  id: string;
  fromCurrency: string;
  toCurrency: string;
  rate: number;
  isActive: boolean;
  lastUpdatedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminUser {
  id: string;
  username: string;
  email: string;
  balance: number;
  isActive: boolean;
  role: 'user' | 'admin';
  createdAt: string;
  updatedAt: string;
  stats?: {
    operationsCount: number;
    transactionsCount: number;
  };
}

export interface AdminOperation {
  id: string;
  type: string;
  status: string;
  number: string;
  sms?: string;
  reference: string;
  createdDate: string;
  user: {
    id: string;
    username: string;
    email: string;
  };
  servicePricing?: {
    serviceCode: string;
    countryCode: string;
    price: number;
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Reference Data Types
export interface ReferenceCountry {
  code: string;      // alphaCode (US, FR, CM)
  name: string;
  phoneCode: string; // Code téléphonique
  flag: string;
}

export interface ReferenceService {
  code: string;      // Code du service (whatsapp, telegram)
  name: string;
  logoUrl: string;
}

// ============ SERVICE ============

class AdminService {
  // Stats
  async getGlobalStats(): Promise<AdminStats> {
    return apiService.get<AdminStats>('/admin/stats');
  }

  async getDailyStats(days = 30): Promise<DailyStats[]> {
    return apiService.get<DailyStats[]>(`/admin/stats/daily?days=${days}`);
  }

  // Users
  async getUsers(params?: {
    page?: number;
    limit?: number;
    search?: string;
    isActive?: boolean;
  }): Promise<{ users: AdminUser[]; total: number; totalPages: number }> {
    const query = new URLSearchParams();
    if (params?.page) query.append('page', params.page.toString());
    if (params?.limit) query.append('limit', params.limit.toString());
    if (params?.search) query.append('search', params.search);
    if (params?.isActive !== undefined) query.append('isActive', params.isActive.toString());

    return apiService.get(`/admin/users?${query.toString()}`);
  }

  async getUserById(id: string): Promise<AdminUser> {
    return apiService.get<AdminUser>(`/admin/users/${id}`);
  }

  async updateUserStatus(id: string, isActive: boolean): Promise<{ success: boolean }> {
    return apiService.patch(`/admin/users/${id}/status`, { isActive });
  }

  async creditUser(id: string, amount: number, reason?: string): Promise<{ success: boolean; newBalance: number }> {
    return apiService.post(`/admin/users/${id}/credit`, { amount, reason });
  }

  async debitUser(id: string, amount: number, reason?: string): Promise<{ success: boolean; newBalance: number }> {
    return apiService.post(`/admin/users/${id}/debit`, { amount, reason });
  }

  // Operations
  async getOperations(params?: {
    page?: number;
    limit?: number;
    userId?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<{ operations: AdminOperation[]; total: number; totalPages: number }> {
    const query = new URLSearchParams();
    if (params?.page) query.append('page', params.page.toString());
    if (params?.limit) query.append('limit', params.limit.toString());
    if (params?.userId) query.append('userId', params.userId);
    if (params?.status) query.append('status', params.status);
    if (params?.startDate) query.append('startDate', params.startDate);
    if (params?.endDate) query.append('endDate', params.endDate);

    return apiService.get(`/admin/operations?${query.toString()}`);
  }

  async refundOperation(id: string, reason?: string): Promise<{ success: boolean; refundedAmount: number }> {
    return apiService.post(`/admin/operations/${id}/refund`, { reason });
  }

  // Service Pricing
  async getServicePricings(params?: {
    page?: number;
    limit?: number;
    serviceCode?: string;
    countryCode?: string;
    currency?: string;
    isActive?: boolean;
  }): Promise<{ pricings: ServicePricing[]; total: number; totalPages: number }> {
    const query = new URLSearchParams();
    if (params?.page) query.append('page', params.page.toString());
    if (params?.limit) query.append('limit', params.limit.toString());
    if (params?.serviceCode) query.append('serviceCode', params.serviceCode);
    if (params?.countryCode) query.append('countryCode', params.countryCode);
    if (params?.currency) query.append('currency', params.currency);
    if (params?.isActive !== undefined) query.append('isActive', params.isActive.toString());

    return apiService.get(`/admin/service-pricing?${query.toString()}`);
  }

  async getServicePricingById(id: string): Promise<ServicePricing> {
    return apiService.get<ServicePricing>(`/admin/service-pricing/${id}`);
  }

  async createServicePricing(data: {
    serviceCode: string;
    countryCode: string;
    price: number;
    currency?: string;
    costPrice?: number;
    margin?: number;
    isActive?: boolean;
  }): Promise<ServicePricing> {
    return apiService.post<ServicePricing>('/admin/service-pricing', data);
  }

  async updateServicePricing(id: string, data: {
    price?: number;
    currency?: string;
    costPrice?: number;
    margin?: number;
    isActive?: boolean;
  }): Promise<ServicePricing> {
    return apiService.patch<ServicePricing>(`/admin/service-pricing/${id}`, data);
  }

  async deleteServicePricing(id: string): Promise<{ success: boolean }> {
    return apiService.delete(`/admin/service-pricing/${id}`);
  }

  // Exchange Rates
  async getExchangeRates(includeInactive = false): Promise<ExchangeRate[]> {
    return apiService.get<ExchangeRate[]>(`/admin/exchange-rates?includeInactive=${includeInactive}`);
  }

  async getExchangeRateById(id: string): Promise<ExchangeRate> {
    return apiService.get<ExchangeRate>(`/admin/exchange-rates/${id}`);
  }

  async createExchangeRate(data: {
    fromCurrency: string;
    toCurrency: string;
    rate: number;
    isActive?: boolean;
  }): Promise<ExchangeRate> {
    return apiService.post<ExchangeRate>('/admin/exchange-rates', data);
  }

  async updateExchangeRate(id: string, data: {
    rate?: number;
    isActive?: boolean;
  }): Promise<ExchangeRate> {
    return apiService.patch<ExchangeRate>(`/admin/exchange-rates/${id}`, data);
  }

  async deleteExchangeRate(id: string): Promise<{ success: boolean }> {
    return apiService.delete(`/admin/exchange-rates/${id}`);
  }

  async convertCurrency(amount: number, from: string, to: string): Promise<{
    original: { amount: number; currency: string };
    converted: { amount: number; currency: string };
  }> {
    return apiService.get(`/admin/convert?amount=${amount}&from=${from}&to=${to}`);
  }

  // Audit Logs
  async getAuditLogs(params?: { page?: number; limit?: number }): Promise<{
    logs: Array<{
      id: string;
      action: string;
      admin: { id: string; username: string } | null;
      targetUserId?: string;
      targetOperationId?: string;
      details?: Record<string, unknown>;
      ipAddress?: string;
      createdAt: string;
    }>;
    total: number;
    totalPages: number;
  }> {
    const query = new URLSearchParams();
    if (params?.page) query.append('page', params.page.toString());
    if (params?.limit) query.append('limit', params.limit.toString());

    return apiService.get(`/admin/audit-logs?${query.toString()}`);
  }

  // Reference Data (Countries & Services)
  async getAvailableCountries(): Promise<ReferenceCountry[]> {
    return apiService.get<ReferenceCountry[]>('/admin/reference/countries');
  }

  async getAvailableServices(): Promise<ReferenceService[]> {
    return apiService.get<ReferenceService[]>('/admin/reference/services');
  }
}

export const adminService = new AdminService();
