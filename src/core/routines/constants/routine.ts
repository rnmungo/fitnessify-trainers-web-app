import type { RoutineEquipment, RoutineLevel } from '@/types/routine';

export const LEVEL_TRANSLATION: Record<RoutineLevel, string> = {
  Beginner: 'Principiante',
  Intermediate: 'Intermedio',
  Advanced: 'Avanzado',
};

export const EQUIPMENT_TRANSLATION: Record<RoutineEquipment, string> = {
  All: 'Todos',
  Bands: 'Bandas',
  BodyWeight: 'Peso corporal',
  DumbbellsAndKettlebells: 'Dumbbells y kettlebells',
};
