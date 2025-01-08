export type MuscleGroupResponse = {
  id: string;
  name: string;
};

export interface ExerciseResponse {
  id: string;
  name: string;
  description: string;
  muscleGroups: Array<MuscleGroupResponse>;
};

export interface VideoResponse {
  id: string;
  createdAt: string;
  title: string;
  url: string;
};

export interface ExerciseDetailedResponse {
  id: string;
  name: string;
  description: string;
  muscleGroups: Array<MuscleGroupResponse>;
  video: VideoResponse;
};
