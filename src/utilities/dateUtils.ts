import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export const formatCompleteDate = (date: Date): string => {
  return format(date, "d 'de' MMMM 'de' yyyy, HH:mm 'HS'", { locale: es });
};
