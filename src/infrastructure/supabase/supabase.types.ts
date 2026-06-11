import { WorkoutDifficulty } from '../../modules/workouts/domain/entities/workout-difficulty.enum';

type WorkoutRow = {
  id: string;
  title: string;
  description: string;
  durationSeconds: number;
  calories: number;
  difficulty: WorkoutDifficulty;
};

type UserRow = {
  id: string;
  email: string;
  password_hash: string | null;
  role: string;
};

type WorkoutSessionRow = {
  id: string;
  user_id: string;
  workout_id: string;
  started_at: string;
  finished_at: string | null;
  calories_burned: number | null;
};

export interface Database {
  public: {
    Tables: {
      users: {
        Row: UserRow;
        Insert: Pick<UserRow, 'id' | 'email'> &
          Partial<Pick<UserRow, 'password_hash' | 'role'>>;
        Update: Partial<Omit<UserRow, 'id'>>;
        Relationships: [];
      };
      workout_sessions: {
        Row: WorkoutSessionRow;
        Insert: Pick<WorkoutSessionRow, 'user_id' | 'workout_id'> &
          Partial<
            Pick<
              WorkoutSessionRow,
              'id' | 'started_at' | 'finished_at' | 'calories_burned'
            >
          >;
        Update: Partial<Omit<WorkoutSessionRow, 'id'>>;
        Relationships: [
          {
            foreignKeyName: 'workout_sessions_workout_id_fkey';
            columns: ['workout_id'];
            isOneToOne: false;
            referencedRelation: 'workouts';
            referencedColumns: ['id'];
          },
        ];
      };
      workouts: {
        Row: WorkoutRow;
        Insert: Omit<WorkoutRow, 'id'> & { id?: string };
        Update: Partial<WorkoutRow>;
        Relationships: [];
      };
    };
    Views: Record<never, never>;
    Functions: Record<never, never>;
    Enums: Record<never, never>;
    CompositeTypes: Record<never, never>;
  };
}
