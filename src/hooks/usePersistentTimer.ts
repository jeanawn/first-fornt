import { useState, useEffect, useCallback, useRef } from 'react';

interface TimerData {
  operationId: string;
  createdDate: string;
  duration: number; // en minutes
}

interface UseTimerReturn {
  timeRemaining: string;
  isExpired: boolean;
  resetTimer: () => void;
  clearTimer: () => void;
}

export const usePersistentTimer = (
  operationId: string,
  createdDate: string,
  duration: number = 15 // 15 minutes par défaut
): UseTimerReturn => {
  const [timeRemaining, setTimeRemaining] = useState('');
  const [isExpired, setIsExpired] = useState(false);
  const intervalRef = useRef<number | null>(null);

  const getStorageKey = useCallback(() => {
    return `timer_${operationId}`;
  }, [operationId]);

  const formatTimeRemaining = useCallback((milliseconds: number): string => {
    if (milliseconds <= 0) return 'Expiré';

    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);

    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }, []);

  const calculateRemainingTime = useCallback((startDate: string, durationMinutes: number): number => {
    const now = new Date().getTime();
    const created = new Date(startDate).getTime();
    const expirationTime = created + (durationMinutes * 60 * 1000);
    return expirationTime - now;
  }, []);

  const saveTimerToStorage = useCallback((data: TimerData) => {
    try {
      localStorage.setItem(getStorageKey(), JSON.stringify(data));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du timer:', error);
    }
  }, [getStorageKey]);

  const loadTimerFromStorage = useCallback((): TimerData | null => {
    try {
      const stored = localStorage.getItem(getStorageKey());
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Erreur lors du chargement du timer:', error);
    }
    return null;
  }, [getStorageKey]);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    try {
      localStorage.removeItem(getStorageKey());
    } catch (error) {
      console.error('Erreur lors de la suppression du timer:', error);
    }
  }, [getStorageKey]);

  const resetTimer = useCallback(() => {
    const timerData: TimerData = {
      operationId,
      createdDate,
      duration
    };
    saveTimerToStorage(timerData);
    setIsExpired(false);
  }, [operationId, createdDate, duration, saveTimerToStorage]);

  const updateTimer = useCallback(() => {
    let timerData = loadTimerFromStorage();

    // Si pas de données stockées, créer un nouveau timer
    if (!timerData) {
      timerData = {
        operationId,
        createdDate,
        duration
      };
      saveTimerToStorage(timerData);
    }

    // Calculer le temps restant
    const remaining = calculateRemainingTime(timerData.createdDate, timerData.duration);

    if (remaining <= 0) {
      setTimeRemaining('Expiré');
      setIsExpired(true);
      clearTimer();
    } else {
      setTimeRemaining(formatTimeRemaining(remaining));
      setIsExpired(false);
    }
  }, [
    operationId,
    createdDate,
    duration,
    loadTimerFromStorage,
    saveTimerToStorage,
    calculateRemainingTime,
    formatTimeRemaining,
    clearTimer
  ]);

  // Initialisation et mise à jour du timer
  useEffect(() => {
    // Mise à jour immédiate
    updateTimer();

    // Mise à jour toutes les secondes
    intervalRef.current = setInterval(updateTimer, 1000);

    // Cleanup
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [updateTimer]);

  // Nettoyage automatique quand le composant est démonté
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Vérification périodique pour nettoyer les timers expirés
  useEffect(() => {
    const cleanupExpiredTimers = () => {
      try {
        const keys = Object.keys(localStorage);
        const timerKeys = keys.filter(key => key.startsWith('timer_'));

        timerKeys.forEach(key => {
          const stored = localStorage.getItem(key);
          if (stored) {
            const timerData: TimerData = JSON.parse(stored);
            const remaining = calculateRemainingTime(timerData.createdDate, timerData.duration);

            // Supprimer les timers expirés depuis plus de 1 heure
            if (remaining < -3600000) { // -1 heure en millisecondes
              localStorage.removeItem(key);
            }
          }
        });
      } catch (error) {
        console.error('Erreur lors du nettoyage des timers expirés:', error);
      }
    };

    // Nettoyage initial
    cleanupExpiredTimers();

    // Nettoyage toutes les heures
    const cleanupInterval = setInterval(cleanupExpiredTimers, 3600000); // 1 heure

    return () => clearInterval(cleanupInterval);
  }, [calculateRemainingTime]);

  return {
    timeRemaining,
    isExpired,
    resetTimer,
    clearTimer
  };
};

export default usePersistentTimer;