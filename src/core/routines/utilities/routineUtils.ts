import {
  EQUIPMENT_TRANSLATION,
  LEVEL_ICON,
  LEVEL_STATUS_COLOR,
  LEVEL_TRANSLATION,
  STATUS_TRANSLATION,
  ROUTINE_STATUS_COLOR,
} from '../constants/routine';

import type { ChipColor } from '@/types/material-ui';
import type { RoutineEquipment, RoutineLevel, RoutineStatus } from '@/types/routine';

export const getEquipmentTranslation = (equipment: string): string =>
  EQUIPMENT_TRANSLATION[equipment as RoutineEquipment] || EQUIPMENT_TRANSLATION.All;

export const getColorByLevel = (level: string): ChipColor =>
  LEVEL_STATUS_COLOR[level] || LEVEL_STATUS_COLOR.Beginner;

export const getLevelTranslation = (level: string): string =>
  LEVEL_TRANSLATION[level as RoutineLevel] || LEVEL_TRANSLATION.Beginner;

export const getLevelIcon = (level: string): any =>
  LEVEL_ICON[level as RoutineLevel] || LEVEL_ICON.Beginner;

export const getStatusTranslation = (status: string): string =>
  STATUS_TRANSLATION[status as RoutineStatus] || STATUS_TRANSLATION.Draft;

export const getColorByStatus = (status: string): ChipColor =>
  ROUTINE_STATUS_COLOR[status] || ROUTINE_STATUS_COLOR.Draft;
