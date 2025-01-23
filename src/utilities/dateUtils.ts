import { format } from 'date-fns';
import { Locale } from 'date-fns/locale';
import { es } from 'date-fns/locale';

export const formatCompleteDate = (date: Date, locale?: Locale): string => {
  return format(date, "PPP, HH:mm 'HS'", { locale: locale || es });
};
