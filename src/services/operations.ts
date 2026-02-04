import { apiService } from './api';
import type { ApiResponse } from './api';
import type { Country, Service } from '../types';

export interface CreateOperationRequest {
  serviceCode: string;
  countryCode: string;
}

export interface CreateOperationResponse {
  success: boolean;
  operationId?: string; // Absent si success=false
  status?: 'PROCESSING';
  message: string;
}

export interface OperationStatusResponse {
  operationId: string;
  status: 'PROCESSING' | 'PENDING' | 'SUCCESS' | 'FAILED';
  number?: string;
  sms?: string;
  message?: string;
}

export interface Operation {
  id: string;
  number: string;
  sms?: string;
  status: 'PROCESSING' | 'PENDING' | 'SUCCESS' | 'FAILED';
  service: string;
  country: string;
  price: number;
  createdDate: string;
  updatedAt?: string;
  type?: string;
  reference?: string;
  // Données enrichies du backend
  countryData?: {
    code: string;
    name: string;
    flag?: string;
    flags?: string;
    alphaCode?: string;
  };
  serviceData?: {
    code: string;
    name: string;
    serviceName?: string;
    logoUrl?: string;
  };
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

// Nouveau flow: Service -> Pays
export interface AvailableService {
  code: string;
  name: string;
  logoUrl: string;
  countriesCount: number;
  minPrice: number;
}

export interface CountryWithPrice {
  code: string;
  name: string;
  flag: string;
  phoneCode: string;
  price: number;
  currency: string;
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

  /**
   * Nouveau flow: Récupérer les services disponibles (ayant des tarifications)
   */
  async getAvailableServices(): Promise<AvailableService[]> {
    return apiService.get<AvailableService[]>('/service-pricing/available-services');
  }

  /**
   * Nouveau flow: Récupérer les pays disponibles pour un service avec leurs prix
   */
  async getCountriesForService(serviceCode: string): Promise<CountryWithPrice[]> {
    return apiService.get<CountryWithPrice[]>(`/service-pricing/service/${serviceCode}/countries`);
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

  async createOperation(request: CreateOperationRequest): Promise<CreateOperationResponse> {
    const response = await apiService.post<CreateOperationResponse>('/operations', request);
    return response;
  }

  async getOperationStatus(operationId: string): Promise<OperationStatusResponse> {
    const response = await apiService.get<OperationStatusResponse>(`/operations/${operationId}`);
    return response;
  }

  async getUserOperations(): Promise<Operation[]> {
    const response = await apiService.get<Operation[]>('/operations');
    return response;
  }

  async getOperationById(id: string): Promise<Operation | null> {
    try {
      // Charger toutes les opérations pour avoir les données enrichies (service, country, price)
      // Le backend enrichit ces données dans getUserOperations
      const operations = await this.getUserOperations();
      return operations.find(op => op.id === id) || null;
    } catch {
      return null;
    }
  }

  async getOperationStatusById(id: string): Promise<OperationStatusResponse | null> {
    try {
      // Endpoint direct pour le polling (statut, numéro, SMS uniquement)
      const response = await apiService.get<OperationStatusResponse>(`/operations/${id}`);
      return response;
    } catch {
      return null;
    }
  }
}

export const operationsService = new OperationsService();