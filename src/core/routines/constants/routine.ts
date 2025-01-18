import MuiKeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import MuiKeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import MuiKeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import type { ChipColor } from '@/types/material-ui';
import type { RoutineEquipment, RoutineLevel, RoutineStatus } from '@/types/routine';

export const LEVEL_TRANSLATION: Record<RoutineLevel, string> = {
  Beginner: 'Principiante',
  Intermediate: 'Intermedio',
  Advanced: 'Avanzado',
};

export const LEVEL_ICON: Record<RoutineLevel, any> = {
  Beginner: MuiKeyboardArrowDownIcon,
  Intermediate: MuiKeyboardArrowUpIcon,
  Advanced: MuiKeyboardDoubleArrowUpIcon,
};

export const LEVEL_STATUS_COLOR: Record<string, ChipColor> = {
  Beginner: 'info' as ChipColor,
  Intermediate: 'warning' as ChipColor,
  Advanced: 'error' as ChipColor,
};

export const EQUIPMENT_TRANSLATION: Record<RoutineEquipment, string> = {
  All: 'Todos',
  Bands: 'Bandas',
  BodyWeight: 'Peso corporal',
  DumbbellsAndKettlebells: 'Dumbbells y kettlebells',
};

export const STATUS_TRANSLATION: Record<RoutineStatus, string> = {
  Deployed: 'Desplegada',
  Draft: 'Borrador',
};

export const ROUTINE_STATUS_COLOR: Record<string, ChipColor> = {
  Deployed: 'success' as ChipColor,
  Draft: 'default' as ChipColor,
};
