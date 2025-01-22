import { Locale } from 'date-fns/locale';
import { DATE_LOCALES } from '../constants';

export const getDateLocale = (locale: string): Locale =>
  DATE_LOCALES[locale] || DATE_LOCALES.es
