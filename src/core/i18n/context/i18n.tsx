import { createContext, useContext, useEffect, useState } from 'react';
import { UI_LANGUAGE_KEY } from '@/constants/local-storage-keys';
import { i18n, setLanguage } from '../rosetta';
import { DEFAULT_LANGUAGE, ES_LANGUAGE, EN_LANGUAGE } from '../constants';
import en from '../locales/en.json';
import es from '../locales/es.json';

type LanguageContextProps = {
  locale: string;
  t: typeof i18n.t;
  changeLanguage: (lang: string) => void;
};

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [localeState, setLocaleState] = useState(DEFAULT_LANGUAGE);

  useEffect(() => {
    const savedLang = localStorage.getItem(UI_LANGUAGE_KEY) || DEFAULT_LANGUAGE;
    changeLanguage(savedLang);
  }, []);

  const translate = (text: string, data?: any) => {
    const translated = i18n.t(text, data);
    return translated || text;
  };

  const changeLanguage = (lang: string) => {
    let translations = {};
    if (lang === ES_LANGUAGE) translations = es;
    if (lang === EN_LANGUAGE) translations = en;

    setLanguage(lang, translations);
    setLocaleState(lang);
    localStorage.setItem(UI_LANGUAGE_KEY, lang);
  };

  return (
    <LanguageContext.Provider value={{ locale: localeState, t: translate, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }

  return context;
};
