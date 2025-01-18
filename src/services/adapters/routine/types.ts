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

export type RoutinePlanResponse = {
  id: string;
  name: string;
};

export type ExerciseResponse = {
  id: string;
  name: string;
};

export type RoutineExerciseResponse = {
  id: string;
  duration: string;
  pause: string;
  repetitions: number;
  exercise: ExerciseResponse;
};

export type RoutineSectionResponse = {
  id: string;
  name: string;
  duration: string;
  pause: string;
  laps: number;
  routineExercises: Array<RoutineExerciseResponse>;
};

export type RoutineDetailedResponse = {
  id: string;
  createdAt: string;
  name: string;
  description: string;
  duration: string;
  level: RoutineLevel;
  equipment: RoutineEquipment;
  status: RoutineStatus;
  routineSections: Array<RoutineSectionResponse>;
};
