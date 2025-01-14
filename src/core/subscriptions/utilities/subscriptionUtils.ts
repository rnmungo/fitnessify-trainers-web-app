import type { ChipColor } from '@/types/material-ui';

const SUBSCRIPTION_STATUS_TRANSLATION: Record<string, string> = {
  Active: 'Activo',
  Canceled: 'Cancelado',
  Draft: 'Borrador',
  Paused: 'Pausado',
};

export const getStatusTranslation = (status: string): string =>
  SUBSCRIPTION_STATUS_TRANSLATION[status] || SUBSCRIPTION_STATUS_TRANSLATION.Draft;

const SUBSCRIPTION_STATUS_COLOR: Record<string, ChipColor> = {
  Active: 'success' as ChipColor,
  Canceled: 'error' as ChipColor,
  Draft: 'default' as ChipColor,
  Paused: 'default' as ChipColor,
};

export const getColorByStatus = (status: string): ChipColor =>
  SUBSCRIPTION_STATUS_COLOR[status] || SUBSCRIPTION_STATUS_COLOR.Draft;
