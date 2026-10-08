// Hand-written to match supabase/migrations. Regenerate with
// `supabase gen types typescript` once the project is linked, if preferred.

export type AttemptKind = "lesson_check" | "module_test" | "review" | "mock_exam";
export type Role = "learner" | "admin";

type Table<Row, Required extends keyof Row> = {
  Row: Row;
  Insert: Partial<Row> & Pick<Row, Required>;
  Update: Partial<Row>;
  Relationships: [];
};

export type ProfileRow = {
  id: string;
  display_name: string | null;
  role: Role;
  created_at: string | null;
};

export type LessonProgressRow = {
  user_id: string;
  lesson_id: string;
  completed_at: string | null;
  visits: number;
};

export type AttemptRow = {
  id: string;
  user_id: string;
  kind: AttemptKind;
  module_id: string | null;
  started_at: string;
  finished_at: string | null;
  score: number | null;
  total: number | null;
  passed: boolean | null;
};

export type AnswerRow = {
  id: string;
  attempt_id: string;
  user_id: string;
  question_id: string;
  rule_ids: string[];
  first_selection: string[] | null;
  final_selection: string[] | null;
  change_count: number | null;
  correct: boolean | null;
  time_to_first_ms: number | null;
  time_to_submit_ms: number | null;
  created_at: string;
};

export type ReviewQueueRow = {
  user_id: string;
  question_id: string;
  due_at: string;
  interval_days: number;
  correct_in_a_row: number;
};

export type ModuleProgressRow = {
  user_id: string;
  module_id: string;
  best_score_pct: number | null;
  passed_at: string | null;
};

export type Database = {
  public: {
    Tables: {
      bchwiya_profiles: Table<ProfileRow, never>;
      bchwiya_lesson_progress: Table<LessonProgressRow, "user_id" | "lesson_id">;
      bchwiya_attempts: Table<AttemptRow, "user_id" | "kind">;
      bchwiya_answers: Table<AnswerRow, "attempt_id" | "user_id" | "question_id">;
      bchwiya_review_queue: Table<ReviewQueueRow, "user_id" | "question_id">;
      bchwiya_module_progress: Table<ModuleProgressRow, "user_id" | "module_id">;
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
};
