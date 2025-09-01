export interface User {
  id: string;
  username: string;
  email: string;
  balance: number;
  isActive: boolean;
  createdDate: string;
}

export interface Country {
  code: string;
  name: string;
  flag: string; // URL du drapeau (fallback)
  alphaCode?: string;
  flags?: string; // URL directe du drapeau (principale)
}

export interface Service {
  id: string;
  code?: string;
  name: string;
  description?: string;
  logoUrl?: string; // URL du logo du service
  price: number;
}

export interface Network {
  id: string;
  name: string;
}

export interface PhoneNumber {
  id: string;
  number: string;
  country: Country;
  service: Service;
  expiresAt: Date;
  smsCode?: string;
  status: 'PENDING' | 'SUCCESS' | 'FAILED';
  createdDate: string;
}


export interface Transaction {
  id: string;
  amount: number;
  type: 'deposit' | 'withdraw' | 'refund';
  status: 'pending' | 'success' | 'failed';
  reference: string;
  network: string | null;
  phoneNumber: string | null;
  createdAt: string;
  updatedAt: string;
}

// Types pour l'API
export interface ApiError {
  success: false;
  message: string;
  statusCode?: number;
}