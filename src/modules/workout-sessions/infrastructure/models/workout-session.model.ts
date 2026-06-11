export type WorkoutSessionModel = {
  id: string;
  user_id: string;
  workout_id: string;
  started_at: string;
  finished_at: string | null;
  calories_burned: number | null;
};
