import type { ExerciseResponse, ExerciseDetailedResponse, VideoResponse } from './types';
import type { Exercise, ExerciseDetailed, Video } from '@/types/exercise';

export const adaptExercises = (data: Array<ExerciseResponse> = []): Array<Exercise> => data.map((exercise) => ({
  id: exercise.id,
  name: exercise.name,
  description: exercise.description,
  muscleGroups: (exercise.muscleGroups || []).map((muscleGroup) => ({
    id: muscleGroup.id,
    name: muscleGroup.name,
  })),
}));

export const adaptExercise = (data: ExerciseDetailedResponse): ExerciseDetailed => ({
  id: data.id,
  name: data.name,
  description: data.description,
  muscleGroups: (data.muscleGroups || []).map((muscleGroup) => ({
    id: muscleGroup.id,
    name: muscleGroup.name,
  })),
  video: {
    id: data.video.id,
    createdAt: data.video.createdAt,
    title: data.video.title,
    url: data.video.url,
  },
});

export const adaptVideos = (data: Array<VideoResponse> = []): Array<Video> => data.map((video) => ({
  id: video.id,
  createdAt: video.createdAt,
  title: video.title,
  url: video.url,
}));
