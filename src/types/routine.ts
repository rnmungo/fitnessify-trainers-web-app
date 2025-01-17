export type RoutineEquipment = 'All' | 'Bands' | 'BodyWeight' | 'DumbbellsAndKettlebells';

export type RoutineLevel = 'Advanced' | 'Beginner' | 'Intermediate';

export type RoutineStatus = 'Deployed' | 'Draft';

export type Routine = {
  id: string;
  createdAt: string;
  name: string;
  description: string;
  duration: string;
  level: RoutineLevel;
  equipment: RoutineEquipment;
  status: RoutineStatus;
};

export type Exercise = {
  id: string;
  name: string;
};

export type RoutineExercise = {
  duration: string;
  pause: string;
  repetitions: number;
  exercise: Exercise;
};

export type RoutineSection = {
  name: string;
  duration: string;
  pause: string;
  laps: number;
  routineExercises: Array<RoutineExercise>;
};

export type RoutineDetailed = {
  id: string;
  createdAt: string;
  name: string;
  description: string;
  duration: string;
  level: RoutineLevel;
  equipment: RoutineEquipment;
  status: RoutineStatus;
  routineSections: Array<RoutineSection>;
};

export type CreateRoutineExercise = {
  exerciseId: string;
  duration: string;
  pause: string;
  repetitions: number;
};

export type CreateRoutineSection = {
  name: string;
  duration: string;
  pause: string;
  laps: number;
  routineExercises: Array<CreateRoutineExercise>;
};

export type CreateRoutine = {
  name: string;
  description: string;
  duration: string;
  level: RoutineLevel;
  equipment: RoutineEquipment;
  routineSections: Array<CreateRoutineSection>
};
