export type Category = 'Pull' | 'Push' | 'Legs' | 'Core' | 'Skills';

export interface Exercise {
  id: string;
  level: number;
  name: string;
  category: Category;
  description: string;
  progressionTreeId: string;
  targetMetric: 'reps' | 'hold';
  targetValue: number; // e.g. 12 reps or 15 seconds
}

export interface ProgressionTree {
  id: string;
  name: string; // e.g. "Pull-up Progression", "Handstand Progression"
  category: Category;
  description: string;
  levels: Exercise[];
}

export interface WorkoutSet {
  id: string;
  reps?: number;
  holdTime?: number; // in seconds
  weight?: number; // extra weight in kg (0 for bodyweight)
  rpe?: number; // rate of perceived exertion 1-10
}

export interface ExerciseLog {
  id: string;
  exerciseId: string;
  exerciseName: string;
  category: Category;
  sets: WorkoutSet[];
}

export interface WorkoutLog {
  id: string;
  date: string; // ISO string or YYYY-MM-DD
  routineName?: string;
  durationMinutes?: number;
  notes?: string;
  exercisesLogged: ExerciseLog[];
}

export interface RoutineExercise {
  exerciseId: string;
  targetSets: number;
  targetRepsOrTime: string; // "3x8-12", "4x10s", etc.
}

export interface Routine {
  id: string;
  name: string;
  category: Category;
  description: string;
  exercises: RoutineExercise[];
}

export interface UserProgressState {
  currentLevelByTree: Record<string, string>; // progressionTreeId -> exerciseId
  routineHistory: WorkoutLog[];
  customRoutines: Routine[];
}
