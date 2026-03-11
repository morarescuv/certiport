-- Enable RLS on all tables
ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.question_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_selected_exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.streak_logs ENABLE ROW LEVEL SECURITY;

-- Schools: Anyone can read
DROP POLICY IF EXISTS "schools_select_all" ON public.schools;
CREATE POLICY "schools_select_all" ON public.schools FOR SELECT USING (true);

-- Profiles: Users can read all profiles (for leaderboard), but only update own
DROP POLICY IF EXISTS "profiles_select_all" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_delete_own" ON public.profiles;
CREATE POLICY "profiles_select_all" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_delete_own" ON public.profiles FOR DELETE USING (auth.uid() = id);

-- Exam categories: Anyone can read
DROP POLICY IF EXISTS "exam_categories_select_all" ON public.exam_categories;
CREATE POLICY "exam_categories_select_all" ON public.exam_categories FOR SELECT USING (true);

-- Exams: Anyone can read
DROP POLICY IF EXISTS "exams_select_all" ON public.exams;
CREATE POLICY "exams_select_all" ON public.exams FOR SELECT USING (true);

-- Questions: Anyone can read
DROP POLICY IF EXISTS "questions_select_all" ON public.questions;
CREATE POLICY "questions_select_all" ON public.questions FOR SELECT USING (true);

-- Quiz attempts: Users can read all (for leaderboard), manage own
DROP POLICY IF EXISTS "quiz_attempts_select_all" ON public.quiz_attempts;
DROP POLICY IF EXISTS "quiz_attempts_insert_own" ON public.quiz_attempts;
DROP POLICY IF EXISTS "quiz_attempts_update_own" ON public.quiz_attempts;
DROP POLICY IF EXISTS "quiz_attempts_delete_own" ON public.quiz_attempts;
CREATE POLICY "quiz_attempts_select_all" ON public.quiz_attempts FOR SELECT USING (true);
CREATE POLICY "quiz_attempts_insert_own" ON public.quiz_attempts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "quiz_attempts_update_own" ON public.quiz_attempts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "quiz_attempts_delete_own" ON public.quiz_attempts FOR DELETE USING (auth.uid() = user_id);

-- Question responses: Only own responses
DROP POLICY IF EXISTS "question_responses_select_own" ON public.question_responses;
DROP POLICY IF EXISTS "question_responses_insert_own" ON public.question_responses;
CREATE POLICY "question_responses_select_own" ON public.question_responses 
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.quiz_attempts 
      WHERE quiz_attempts.id = question_responses.attempt_id 
      AND quiz_attempts.user_id = auth.uid()
    )
  );
CREATE POLICY "question_responses_insert_own" ON public.question_responses 
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.quiz_attempts 
      WHERE quiz_attempts.id = attempt_id 
      AND quiz_attempts.user_id = auth.uid()
    )
  );

-- Badges: Anyone can read
DROP POLICY IF EXISTS "badges_select_all" ON public.badges;
CREATE POLICY "badges_select_all" ON public.badges FOR SELECT USING (true);

-- User badges: Anyone can read (for profiles), users manage own
DROP POLICY IF EXISTS "user_badges_select_all" ON public.user_badges;
DROP POLICY IF EXISTS "user_badges_insert_own" ON public.user_badges;
CREATE POLICY "user_badges_select_all" ON public.user_badges FOR SELECT USING (true);
CREATE POLICY "user_badges_insert_own" ON public.user_badges FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Missions: Anyone can read
DROP POLICY IF EXISTS "missions_select_all" ON public.missions;
CREATE POLICY "missions_select_all" ON public.missions FOR SELECT USING (true);

-- User missions: Users can read own, manage own
DROP POLICY IF EXISTS "user_missions_select_own" ON public.user_missions;
DROP POLICY IF EXISTS "user_missions_insert_own" ON public.user_missions;
DROP POLICY IF EXISTS "user_missions_update_own" ON public.user_missions;
CREATE POLICY "user_missions_select_own" ON public.user_missions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "user_missions_insert_own" ON public.user_missions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "user_missions_update_own" ON public.user_missions FOR UPDATE USING (auth.uid() = user_id);

-- Activity log: Users can read own, insert own
DROP POLICY IF EXISTS "activity_log_select_own" ON public.activity_log;
DROP POLICY IF EXISTS "activity_log_insert_own" ON public.activity_log;
CREATE POLICY "activity_log_select_own" ON public.activity_log FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "activity_log_insert_own" ON public.activity_log FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User selected exams: Users can read/manage own
DROP POLICY IF EXISTS "user_selected_exams_select_own" ON public.user_selected_exams;
DROP POLICY IF EXISTS "user_selected_exams_select_all" ON public.user_selected_exams;
DROP POLICY IF EXISTS "user_selected_exams_insert_own" ON public.user_selected_exams;
DROP POLICY IF EXISTS "user_selected_exams_delete_own" ON public.user_selected_exams;
CREATE POLICY "user_selected_exams_select_all" ON public.user_selected_exams FOR SELECT USING (true);
CREATE POLICY "user_selected_exams_insert_own" ON public.user_selected_exams FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "user_selected_exams_delete_own" ON public.user_selected_exams FOR DELETE USING (auth.uid() = user_id);

-- Notifications: Users can read/manage own
DROP POLICY IF EXISTS "notifications_select_own" ON public.notifications;
DROP POLICY IF EXISTS "notifications_insert_own" ON public.notifications;
DROP POLICY IF EXISTS "notifications_update_own" ON public.notifications;
DROP POLICY IF EXISTS "notifications_delete_own" ON public.notifications;
CREATE POLICY "notifications_select_own" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "notifications_insert_own" ON public.notifications FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "notifications_update_own" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "notifications_delete_own" ON public.notifications FOR DELETE USING (auth.uid() = user_id);

-- Streak logs: Users can read/insert own
DROP POLICY IF EXISTS "streak_logs_select_own" ON public.streak_logs;
DROP POLICY IF EXISTS "streak_logs_insert_own" ON public.streak_logs;
DROP POLICY IF EXISTS "streak_logs_delete_own" ON public.streak_logs;
CREATE POLICY "streak_logs_select_own" ON public.streak_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "streak_logs_insert_own" ON public.streak_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "streak_logs_delete_own" ON public.streak_logs FOR DELETE USING (auth.uid() = user_id);
