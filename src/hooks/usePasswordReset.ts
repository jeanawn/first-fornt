import { useState } from 'react';
import { authService } from '../services/auth';
import type { ApiError } from '../types';

type FlowState = 'IDLE' | 'SENDING_OTP' | 'OTP_SENT' | 'VERIFYING_OTP' | 'OTP_VERIFIED' | 'RESETTING' | 'SUCCESS' | 'ERROR';

interface UsePasswordResetReturn {
  state: FlowState;
  error: string;
  sendOtp: (email: string) => Promise<void>;
  verifyOtp: (email: string, otpCode: string) => Promise<void>;
  resetPassword: (email: string, otpCode: string, newPassword: string) => Promise<void>;
  clearError: () => void;
  reset: () => void;
}

export const usePasswordReset = (): UsePasswordResetReturn => {
  const [state, setState] = useState<FlowState>('IDLE');
  const [error, setError] = useState('');

  const handleError = (err: unknown) => {
    const apiError = err as ApiError;
    setError(apiError.message || 'Une erreur inattendue est survenue');
    setState('ERROR');
  };

  const clearError = () => {
    setError('');
    if (state === 'ERROR') {
      setState('IDLE');
    }
  };

  const reset = () => {
    setState('IDLE');
    setError('');
  };

  const sendOtp = async (email: string): Promise<void> => {
    setState('SENDING_OTP');
    clearError();

    try {
      await authService.forgotPassword(email);
      setState('OTP_SENT');
    } catch (err) {
      handleError(err);
      throw err;
    }
  };

  const verifyOtp = async (email: string, otpCode: string): Promise<void> => {
    setState('VERIFYING_OTP');
    clearError();

    try {
      await authService.verifyOtp({ email, otpCode });
      setState('OTP_VERIFIED');
    } catch (err) {
      handleError(err);
      throw err;
    }
  };

  const resetPassword = async (email: string, otpCode: string, newPassword: string): Promise<void> => {
    setState('RESETTING');
    clearError();

    try {
      await authService.resetPassword({ email, otpCode, newPassword });
      setState('SUCCESS');
    } catch (err) {
      handleError(err);
      throw err;
    }
  };

  return {
    state,
    error,
    sendOtp,
    verifyOtp,
    resetPassword,
    clearError,
    reset
  };
};