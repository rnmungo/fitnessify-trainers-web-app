import Rosetta from 'rosetta';
import { DEFAULT_LANGUAGE } from './constants';

export const i18n = Rosetta();

i18n.locale(DEFAULT_LANGUAGE);

export const setLanguage = (lang: string, translations?: Record<string, any>) => {
  i18n.locale(lang);

  if (translations) {
    i18n.set(lang, translations);
  }
};
