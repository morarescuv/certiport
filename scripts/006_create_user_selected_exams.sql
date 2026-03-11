-- User selected exams (single source of truth for what exams a user studies)
CREATE TABLE IF NOT EXISTS public.user_selected_exams (
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  exam_slug TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, exam_slug),
  CONSTRAINT user_selected_exams_exam_slug_check
    CHECK (exam_slug IN ('database', 'python', 'networking'))
);
