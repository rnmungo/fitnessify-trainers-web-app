import * as Locales from 'date-fns/locale';
import { Locale } from 'date-fns';

export const ES_LANGUAGE = 'es';
export const EN_LANGUAGE = 'en';

export const DEFAULT_LANGUAGE = ES_LANGUAGE;

export const LANGUAGES: Record<string, string> = {
  [ES_LANGUAGE]: 'main.language.spanish',
  [EN_LANGUAGE]: 'main.language.english',
};

export const DATE_LOCALES: Record<string, Locale> = {
  [ES_LANGUAGE]: Locales.es,
  [EN_LANGUAGE]: Locales.enUS,
};
