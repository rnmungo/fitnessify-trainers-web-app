import MuiKeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import MuiKeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import MuiKeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import type { ChipColor } from '@/types/material-ui';
import type { RoutineEquipment, RoutineLevel, RoutineStatus } from '@/types/routine';

export const LEVEL_TRANSLATION: Record<RoutineLevel, string> = {
  Beginner: 'routines-page.fields.routine.enum-level.beginner',
  Intermediate: 'routines-page.fields.routine.enum-level.intermediate',
  Advanced: 'routines-page.fields.routine.enum-level.advanced',
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
  All: 'routines-page.fields.routine.enum-equipment.all',
  Bands: 'routines-page.fields.routine.enum-equipment.bands',
  BodyWeight: 'routines-page.fields.routine.enum-equipment.body-weight',
  DumbbellsAndKettlebells: 'routines-page.fields.routine.enum-equipment.dumbbells-and-kettlebells',
};

export const STATUS_TRANSLATION: Record<RoutineStatus, string> = {
  Deployed: 'routines-page.fields.routine.enum-status.deployed',
  Draft: 'routines-page.fields.routine.enum-status.draft',
};

export const ROUTINE_STATUS_COLOR: Record<string, ChipColor> = {
  Deployed: 'success' as ChipColor,
  Draft: 'default' as ChipColor,
};
