import type { RoutineDetailedResponse, RoutineResponse, RoutinePlanResponse } from './types';
import type {
  Routine,
  RoutineDetailed,
  RoutineEquipment,
  RoutineLevel,
  RoutinePlan,
  RoutineStatus,
} from '@/types/routine';

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

export const adaptRoutine = (data?: RoutineDetailedResponse): RoutineDetailed => ({
  id: data?.id || '',
  createdAt: data?.createdAt || '',
  name: data?.name || '',
  description: data?.description || '',
  duration: data?.duration || '00:00:00',
  level: data?.level || '' as RoutineLevel,
  equipment: data?.equipment || '' as RoutineEquipment,
  status: data?.status || '' as RoutineStatus,
  routineSections: (data?.routineSections || []).map(routineSection => ({
    id: routineSection.id,
    name: routineSection.name,
    duration: routineSection.duration,
    laps: routineSection.laps,
    pause: routineSection.pause,
    routineExercises: (routineSection?.routineExercises || []).map(routineExercise => ({
      id: routineExercise.id,
      duration: routineExercise.duration,
      pause: routineExercise.pause,
      repetitions: routineExercise.repetitions,
      exercise: {
        id: routineExercise.exercise.id,
        name: routineExercise.exercise.name,
      }
    })),
  })),
});

export const adaptRoutinePlan = (data?: RoutinePlanResponse): RoutinePlan => ({
  id: data?.id || '',
  name: data?.name || '',
})
