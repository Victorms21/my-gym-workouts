/**
 * Represents the pivot data for an exercise in a routine
 * Contains the relationship data between routine and exercise
 */
export interface ExercisePivot {
  routine_id: number;
  exercise_id: number;
  sets: number;
  reps: number;
  created_at: string;
  updated_at: string;
}

/**
 * Represents an exercise within a routine
 */
export interface RoutineExercise {
  id: number;
  name: string;
  muscle_group_id: number;
  created_at: string;
  updated_at: string;
  pivot: ExercisePivot;
}

/**
 * Represents a workout routine
 */
export interface Routine {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
  exercises: RoutineExercise[];
}

/**
 * Exercise input for creating or updating routines
 */
export interface RoutineExerciseInput {
  exercise_id: number;
  sets: number;
  reps: number;
}

/**
 * Request payload for creating a new routine
 */
export interface CreateRoutineRequest {
  name: string;
  exercises: RoutineExerciseInput[];
}

/**
 * Request payload for updating an existing routine
 */
export interface UpdateRoutineRequest {
  name?: string;
  exercises?: RoutineExerciseInput[];
}
