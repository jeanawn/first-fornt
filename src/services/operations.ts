import { apiService } from './api';
import type { ApiResponse } from './api';
import type { Country, Service } from '../types';

export interface CreateOperationRequest {
  serviceCode: string;
  countryCode: string;
}

export interface Operation {
  id: string;
  number: string;
  sms?: string;
  status: 'PENDING' | 'SUCCESS' | 'FAILED';
  service: string;
  country: string;
  price: number;
  createdDate: string;
}

export interface ServicePricing {
  serviceCode: string;
  countryCode: string;
  price: number;
  isActive: boolean;
}

export interface CountryService {
  serviceCode: string;
  price: number;
  isActive: boolean;
}

class OperationsService {
  async getCountries(): Promise<Country[]> {
    const response = await apiService.get<Country[]>('/operations/countries');
    return response;
  }

  async getServices(): Promise<Service[]> {
    const response = await apiService.get<Service[]>('/operations/services');
    // Transformer les codes de service en objets Service avec prix
    return response.map(service => ({
      ...service,
      id: service.code || service.name.toLowerCase(),
      name: service.name,
      price: 0 // Le prix sera récupéré dynamiquement
    }));
  }

  async getServicesByCountry(countryCode: string): Promise<CountryService[]> {
    const response = await apiService.get<ApiResponse<CountryService[]>>(`/service-pricing/country/${countryCode}`);
    return response.data || [];
  }

  async getServicePrice(serviceCode: string, countryCode: string): Promise<number> {
    try {
      const response = await apiService.get<ApiResponse<ServicePricing>>(`/service-pricing/${serviceCode}/${countryCode}/price`);
      return response.data?.price || 0;
    } catch {
      return 0;
    }
  }

  async isServiceAvailable(serviceCode: string, countryCode: string): Promise<boolean> {
    try {
      const response = await apiService.get<ApiResponse<{available: boolean}>>(`/service-pricing/${serviceCode}/${countryCode}/available`);
      return response.data?.available || false;
    } catch {
      return false;
    }
  }

  async createOperation(request: CreateOperationRequest): Promise<Operation> {
    const response = await apiService.post<Operation>('/operations', request);
    return response;
  }

  async getUserOperations(): Promise<Operation[]> {
    const response = await apiService.get<Operation[]>('/operations');
    return response;
  }

  async getOperationById(id: string): Promise<Operation | null> {
    try {
      const operations = await this.getUserOperations();
      return operations.find(op => op.id === id) || null;
    } catch {
      return null;
    }
  }
}

export const operationsService = new OperationsService();