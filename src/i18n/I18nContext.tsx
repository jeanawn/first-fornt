import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { fr, type Translations } from './translations/fr';
import { en } from './translations/en';

export type Language = 'fr' | 'en';

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const translations: Record<Language, Translations> = { fr, en };

const I18nContext = createContext<I18nContextType | undefined>(undefined);

// Détecter la langue du navigateur
const detectBrowserLanguage = (): Language => {
  const browserLang = navigator.language || (navigator as any).userLanguage;
  if (browserLang) {
    const lang = browserLang.toLowerCase().split('-')[0];
    if (lang === 'fr') return 'fr';
    if (lang === 'en') return 'en';
  }
  return 'fr'; // Default to French
};

// Récupérer la langue sauvegardée
const getSavedLanguage = (): Language | null => {
  try {
    const saved = localStorage.getItem('xaary_language');
    if (saved === 'fr' || saved === 'en') return saved;
  } catch {
    // localStorage not available
  }
  return null;
};

// Sauvegarder la langue
const saveLanguage = (lang: Language) => {
  try {
    localStorage.setItem('xaary_language', lang);
  } catch {
    // localStorage not available
  }
};

interface I18nProviderProps {
  children: ReactNode;
}

export function I18nProvider({ children }: I18nProviderProps) {
  const [language, setLanguageState] = useState<Language>(() => {
    // Priorité: 1. Langue sauvegardée, 2. Langue du navigateur
    return getSavedLanguage() || detectBrowserLanguage();
  });

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    saveLanguage(lang);
  }, []);

  // Mettre à jour l'attribut lang du document
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const value: I18nContextType = {
    language,
    setLanguage,
    t: translations[language],
  };

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}

// Hook simplifié pour accéder aux traductions
export function useTranslation() {
  const { t, language } = useI18n();
  return { t, language };
}
