import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  getStrings,
  Language,
  TranslationStrings,
} from '../constants/strings';
import { updateShopLanguage } from '../db';

export interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => Promise<void>;
  strings: TranslationStrings;
  t: (key: keyof TranslationStrings, params?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export interface LanguageProviderProps {
  children: React.ReactNode;
  initialLanguage?: Language;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({
  children,
  initialLanguage = 'hi-en',
}) => {
  const [language, setLanguageState] = useState<Language>(initialLanguage);

  useEffect(() => {
    if (initialLanguage && initialLanguage !== language) {
      setLanguageState(initialLanguage);
    }
  }, [initialLanguage]);

  const setLanguage = async (newLang: Language) => {
    setLanguageState(newLang);
    try {
      // Safely persist to existing SQLite shops table if a shop exists
      await updateShopLanguage(newLang);
    } catch {
      // Non-blocking: shop may not exist yet during first-launch onboarding
    }
  };

  const strings = getStrings(language);

  const t = (
    key: keyof TranslationStrings,
    params?: Record<string, string | number>
  ): string => {
    let text = strings[key] || '';
    if (params) {
      Object.entries(params).forEach(([paramKey, val]) => {
        text = text.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(val));
      });
    }
    return text;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        strings,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    // Graceful fallback for non-context usages
    const fallbackStrings = getStrings('hi-en');
    return {
      language: 'hi-en',
      setLanguage: async () => {},
      strings: fallbackStrings,
      t: (key: keyof TranslationStrings, params?: Record<string, string | number>) => {
        let text = fallbackStrings[key] || '';
        if (params) {
          Object.entries(params).forEach(([paramKey, val]) => {
            text = text.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(val));
          });
        }
        return text;
      },
    };
  }
  return context;
};
