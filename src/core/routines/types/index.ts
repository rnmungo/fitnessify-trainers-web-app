import type { AutocompleteOption } from '@/types/material-ui';

export interface RoutineBuilder {
  name: string;
  duration: string;
  level: string;
  equipment: string;
};

export interface ExerciseBuilder {
  id: string;
  exerciseId: string;
  duration: string;
  reps: number;
  pauseTime: string;
};

export interface SectionBuilder {
  id: string;
  name: string;
  duration: string;
  pauseTime: string;
  rounds: number;
  exercises: ExerciseBuilder[];
};

export interface AutocompleteExerciseProps {
  options: Array<AutocompleteOption>;
  disabled: boolean;
  helper?: string;
  error?: boolean;
};


