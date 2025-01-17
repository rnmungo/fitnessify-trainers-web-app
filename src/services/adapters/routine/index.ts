import type { RoutineResponse } from './types';
import type { Routine } from '@/types/routine';

export const adaptRoutines = (data: Array<RoutineResponse> = []): Array<Routine> => data.map((routine) => ({
  id: routine.id,
  createdAt: routine.createdAt,
  name: routine.name,
  description: routine.description,
  duration: routine.duration,
  level: routine.level,
  equipment: routine.equipment,
  status: routine.status,
}));
