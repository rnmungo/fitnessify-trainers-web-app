import type { MuscleGroupResponse } from './types';
import type { MuscleGroup } from '@/types/exercise';

export const adaptMuscleGroups = (data: Array<MuscleGroupResponse> = []): Array<MuscleGroup> => data.map((muscleGroup) => ({
  id: muscleGroup.id,
  name: muscleGroup.name,
}));
