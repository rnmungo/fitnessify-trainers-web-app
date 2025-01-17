import type { RoutineEquipment, RoutineLevel, RoutineStatus } from '@/types/routine';

export interface RoutineResponse {
  id: string;
  createdAt: string;
  name: string;
  description: string;
  duration: string;
  level: RoutineLevel;
  equipment: RoutineEquipment;
  status: RoutineStatus;
};
