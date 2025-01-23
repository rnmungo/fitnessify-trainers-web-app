export type MuscleGroup = {
  id: string;
  name: string;
};

export type Exercise = {
  id: string;
  name: string;
  description: string;
  muscleGroups: Array<MuscleGroup>;
};

export type Video = {
  id: string;
  createdAt: string;
  title: string;
  url: string;
};

export type ExerciseDetailed = {
  id: string;
  name: string;
  description: string;
  muscleGroups: Array<MuscleGroup>;
  video: Video;
};
