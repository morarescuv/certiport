import { createClient } from "@/lib/supabase/server"
import { isAllowedExamSlug, type AllowedExamSlug } from "@/lib/exams"

// Types
export interface School {
  id: string
  name: string
  city: string | null
  country: string | null
  created_at: string
}

export interface Profile {
  id: string
  display_name: string | null
  avatar_url: string | null
  school_id: string | null
  total_xp: number
  current_streak: number
  longest_streak: number
  last_activity_date: string | null
  created_at: string
  school?: School | null
}

export interface ExamCategory {
  id: string
  name: string
  description: string | null
  icon: string | null
  color: string | null
}

export interface Exam {
  id: string
  category_id: string
  name: string
  slug: string
  description: string | null
  passing_score: number
  time_limit_minutes: number
  question_count?: number
  difficulty: string
  category?: ExamCategory
}

export interface Question {
  id: string
  exam_id: string
  question_text: string
  question_type: string
  options: string[]
  correct_answer: string
  explanation: string | null
  difficulty: string
  points: number
}

export interface QuizAttempt {
  id: string
  user_id: string
  exam_id: string
  mode: string
  score: number
  total_questions: number
  correct_answers: number
  xp_earned: number
  completed_at: string | null
  created_at: string
  exam?: Exam
}

export interface Badge {
  id: string
  name: string
  description: string | null
  icon: string | null
  rarity: string
  xp_reward: number
}

export interface UserBadge {
  id: string
  user_id: string
  badge_id: string
  earned_at: string
  badge?: Badge
}

export interface ProfileAnalytics {
  profile: Profile | null
  quizzesCompleted: number
  mockExamsCompleted: number
  totalQuestionsAnswered: number
  totalCorrectAnswers: number
  totalWrongAnswers: number
  accuracyPercent: number
  averageScorePercent: number
  bestScorePercent: number
  totalStudyTimeSeconds: number
  currentStreak: number
  longestStreak: number
  activityDates: string[]
  recentAttempts: QuizAttempt[]
  badges: UserBadge[]
  examStats: Array<{
    examId: string
    examName: string
    examSlug: string
    attempts: number
    avgScorePercent: number
    bestScorePercent: number
    accuracyPercent: number
  }>
}

export interface Mission {
  id: string
  name: string
  description: string | null
  mission_type: string
  target_value: number
  xp_reward: number
  is_daily: boolean
}

export interface UserMission {
  id: string
  user_id: string
  mission_id: string
  current_progress: number
  is_completed: boolean
  completed_at: string | null
  assigned_date: string
  mission?: Mission
}

export interface UserSelectedExam {
  user_id: string
  exam_slug: AllowedExamSlug
  created_at: string
}

export interface Notification {
  id: string
  user_id: string
  type: string
  title: string
  body: string
  data: unknown | null
  is_read: boolean
  read_at: string | null
  created_at: string
}

export interface StreakLog {
  id: string
  user_id: string
  activity_date: string
  source: string
  created_at: string
}

// Database functions
export async function getSchools(): Promise<School[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("schools")
    .select("*")
    .order("name")
  
  if (error) throw error
  return data || []
}

export async function getExamCategories(): Promise<ExamCategory[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("exam_categories")
    .select("*")
    .order("name")
  
  if (error) throw error
  return data || []
}

export async function getExams(categoryId?: string): Promise<Exam[]> {
  const supabase = await createClient()
  let query = supabase
    .from("exams")
    .select(`
      *,
      category:exam_categories(*)
    `)
  
  if (categoryId) {
    query = query.eq("category_id", categoryId)
  }
  
  const { data, error } = await query.order("name")
  
  if (error) throw error
  return data || []
}

export async function getExam(examId: string): Promise<Exam | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("exams")
    .select(`
      *,
      category:exam_categories(*)
    `)
    .eq("id", examId)
    .single()
  
  if (error) return null
  return data
}

export async function getQuestions(examId: string, limit?: number): Promise<Question[]> {
  const supabase = await createClient()
  let query = supabase
    .from("questions")
    .select("*")
    .eq("exam_id", examId)
  
  if (limit) {
    query = query.limit(limit)
  }
  
  const { data, error } = await query.order("created_at")
  
  if (error) throw error
  return data || []
}

export async function getUserStats(userId: string) {
  const supabase = await createClient()
  
  // Get profile
  const { data: profile } = await supabase
    .from("profiles")
    .select(`*, school:schools(*)`)
    .eq("id", userId)
    .single()
  
  // Get total quizzes completed
  const { count: quizzesCompleted } = await supabase
    .from("quiz_attempts")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .not("completed_at", "is", null)
  
  // Get average score
  const { data: attempts } = await supabase
    .from("quiz_attempts")
    .select("score")
    .eq("user_id", userId)
    .not("completed_at", "is", null)
  
  const avgScore = attempts && attempts.length > 0
    ? Math.round(attempts.reduce((sum, a) => sum + a.score, 0) / attempts.length)
    : 0
  
  // Get badges count
  const { count: badgesCount } = await supabase
    .from("user_badges")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
  
  return {
    profile,
    quizzesCompleted: quizzesCompleted || 0,
    avgScore,
    badgesCount: badgesCount || 0,
  }
}

export async function getProfileAnalytics(userId: string): Promise<ProfileAnalytics> {
  const supabase = await createClient()

  const [{ data: profile }, { data: attempts }, { data: streakLogs }, { data: userBadges }] =
    await Promise.all([
      supabase
        .from("profiles")
        .select(`*, school:schools(*)`)
        .eq("id", userId)
        .single(),
      supabase
        .from("quiz_attempts")
        .select(
          `*, exam:exams(id, name, slug)`
        )
        .eq("user_id", userId)
        .order("completed_at", { ascending: false }),
      supabase
        .from("streak_logs")
        .select("activity_date")
        .eq("user_id", userId)
        .order("activity_date", { ascending: false }),
      supabase
        .from("user_badges")
        .select(`*, badge:badges(*)`)
        .eq("user_id", userId)
        .order("earned_at", { ascending: false }),
    ])

  const typedProfile = (profile || null) as Profile | null
  const typedAttempts = ((attempts || []) as unknown as QuizAttempt[]).filter((a) => Boolean(a.completed_at))
  const activityDates = (streakLogs || []).map((r) => String((r as { activity_date: string }).activity_date))
  const badges = (userBadges || []) as unknown as UserBadge[]

  const quizzesCompleted = typedAttempts.length
  const mockExamsCompleted = typedAttempts.filter((a) => a.mode === "test").length

  const totalQuestionsAnswered = typedAttempts.reduce((sum, a) => sum + (a.total_questions || 0), 0)
  const totalCorrectAnswers = typedAttempts.reduce((sum, a) => sum + (a.correct_answers || 0), 0)
  const totalWrongAnswers = Math.max(0, totalQuestionsAnswered - totalCorrectAnswers)

  const accuracyPercent = totalQuestionsAnswered > 0
    ? Math.round((totalCorrectAnswers / totalQuestionsAnswered) * 100)
    : 0

  const scores = typedAttempts.map((a) => a.score || 0)
  const averageScorePercent = scores.length > 0
    ? Math.round(scores.reduce((s, v) => s + v, 0) / scores.length)
    : 0
  const bestScorePercent = scores.length > 0 ? Math.max(...scores) : 0

  const totalStudyTimeSeconds = typedAttempts.reduce((sum, a) => sum + ((a as unknown as { time_spent_seconds?: number }).time_spent_seconds || 0), 0)

  const currentStreak = typedProfile?.current_streak || 0
  const longestStreak = typedProfile?.longest_streak || 0

  const recentAttempts = typedAttempts.slice(0, 10)

  const examBuckets = new Map<string, {
    examId: string
    examName: string
    examSlug: string
    attempts: QuizAttempt[]
  }>()

  for (const a of typedAttempts) {
    const exam = (a as unknown as { exam?: { id: string; name: string; slug: string } | null }).exam
    if (!exam) continue
    const existing = examBuckets.get(exam.id)
    if (!existing) {
      examBuckets.set(exam.id, { examId: exam.id, examName: exam.name, examSlug: exam.slug, attempts: [a] })
    } else {
      existing.attempts.push(a)
    }
  }

  const examStats = Array.from(examBuckets.values()).map((b) => {
    const attemptsCount = b.attempts.length
    const bucketScores = b.attempts.map((a) => a.score || 0)
    const avgScorePercent = bucketScores.length > 0
      ? Math.round(bucketScores.reduce((s, v) => s + v, 0) / bucketScores.length)
      : 0
    const bestScorePercent = bucketScores.length > 0 ? Math.max(...bucketScores) : 0

    const totalQ = b.attempts.reduce((sum, a) => sum + (a.total_questions || 0), 0)
    const correctQ = b.attempts.reduce((sum, a) => sum + (a.correct_answers || 0), 0)
    const accuracyPercent = totalQ > 0 ? Math.round((correctQ / totalQ) * 100) : 0

    return {
      examId: b.examId,
      examName: b.examName,
      examSlug: b.examSlug,
      attempts: attemptsCount,
      avgScorePercent,
      bestScorePercent,
      accuracyPercent,
    }
  })

  return {
    profile: typedProfile,
    quizzesCompleted,
    mockExamsCompleted,
    totalQuestionsAnswered,
    totalCorrectAnswers,
    totalWrongAnswers,
    accuracyPercent,
    averageScorePercent,
    bestScorePercent,
    totalStudyTimeSeconds,
    currentStreak,
    longestStreak,
    activityDates,
    recentAttempts,
    badges,
    examStats,
  }
}

export async function getUserSelectedExamSlugs(userId: string): Promise<AllowedExamSlug[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("user_selected_exams")
    .select("exam_slug")
    .eq("user_id", userId)
    .order("created_at", { ascending: true })

  if (error) throw error

  const slugs = (data || [])
    .map((row) => String((row as { exam_slug: string }).exam_slug))
    .filter(isAllowedExamSlug)

  return slugs
}

export async function setUserSelectedExamSlugs(userId: string, slugs: AllowedExamSlug[]) {
  const supabase = await createClient()

  const next = Array.from(new Set(slugs))

  await supabase
    .from("user_selected_exams")
    .delete()
    .eq("user_id", userId)

  if (next.length === 0) return

  const { error } = await supabase
    .from("user_selected_exams")
    .insert(next.map((s) => ({ user_id: userId, exam_slug: s })))

  if (error) throw error
}

export async function getUserMissions(userId: string): Promise<UserMission[]> {
  const supabase = await createClient()
  const today = new Date().toISOString().split("T")[0]
  
  const { data, error } = await supabase
    .from("user_missions")
    .select(`
      *,
      mission:missions(*)
    `)
    .eq("user_id", userId)
    .eq("assigned_date", today)
  
  if (error) throw error
  return data || []
}

export async function getUserBadges(userId: string): Promise<UserBadge[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("user_badges")
    .select(`
      *,
      badge:badges(*)
    `)
    .eq("user_id", userId)
    .order("earned_at", { ascending: false })
  
  if (error) throw error
  return data || []
}

export async function getRecentAttempts(userId: string, limit = 5): Promise<QuizAttempt[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("quiz_attempts")
    .select(`
      *,
      exam:exams(*, category:exam_categories(*))
    `)
    .eq("user_id", userId)
    .not("completed_at", "is", null)
    .order("completed_at", { ascending: false })
    .limit(limit)
  
  if (error) throw error
  return data || []
}

export async function getLeaderboard(timeframe: "all" | "weekly" | "monthly" = "all", schoolId?: string) {
  const supabase = await createClient()
  
  let query = supabase
    .from("profiles")
    .select(`
      id,
      display_name,
      avatar_url,
      total_xp,
      current_streak,
      school:schools(id, name)
    `)
    .order("total_xp", { ascending: false })
    .limit(100)
  
  if (schoolId) {
    query = query.eq("school_id", schoolId)
  }
  
  const { data, error } = await query
  
  if (error) throw error
  return data || []
}

export async function getSchoolLeaderboard() {
  const supabase = await createClient()
  
  // Get all profiles with schools
  const { data: profiles, error } = await supabase
    .from("profiles")
    .select(`
      total_xp,
      school:schools(id, name, city, country)
    `)
    .not("school_id", "is", null)
  
  if (error) throw error
  
  // Aggregate by school
  const schoolStats = new Map<string, { 
    school: School, 
    totalXp: number, 
    memberCount: number 
  }>()
  
  for (const profile of profiles || []) {
    if (profile.school) {
      const school = profile.school as unknown as School
      const existing = schoolStats.get(school.id)
      if (existing) {
        existing.totalXp += profile.total_xp
        existing.memberCount += 1
      } else {
        schoolStats.set(school.id, {
          school,
          totalXp: profile.total_xp,
          memberCount: 1,
        })
      }
    }
  }
  
  // Convert to array and sort by total XP
  return Array.from(schoolStats.values())
    .sort((a, b) => b.totalXp - a.totalXp)
}

export async function createQuizAttempt(
  userId: string,
  examId: string,
  mode: "practice" | "test"
): Promise<QuizAttempt> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("quiz_attempts")
    .insert({
      user_id: userId,
      exam_id: examId,
      mode,
      score: 0,
      total_questions: 0,
      correct_answers: 0,
      xp_earned: 0,
    })
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function completeQuizAttempt(
  attemptId: string,
  score: number,
  totalQuestions: number,
  correctAnswers: number
) {
  const supabase = await createClient()
  
  // Calculate XP: base XP for completion + bonus for correct answers
  const baseXp = 10
  const bonusXp = correctAnswers * 5
  const xpEarned = baseXp + bonusXp
  
  const { data: attempt, error } = await supabase
    .from("quiz_attempts")
    .update({
      score,
      total_questions: totalQuestions,
      correct_answers: correctAnswers,
      xp_earned: xpEarned,
      completed_at: new Date().toISOString(),
    })
    .eq("id", attemptId)
    .select()
    .single()
  
  if (error) throw error
  
  // Update user's total XP and streak
  if (attempt) {
    await updateUserXpAndStreak(attempt.user_id, xpEarned)
    await upsertStreakLog(attempt.user_id, "quiz_attempt")
    await createNotification(attempt.user_id, {
      type: "quiz_completed",
      title: "Test finalizat",
      body: `Ai finalizat un test cu scorul ${score}%.`,
      data: { attemptId, score, totalQuestions, correctAnswers },
    })
  }
  
  return { attempt, xpEarned }
}

export async function updateUserXpAndStreak(userId: string, xpToAdd: number) {
  const supabase = await createClient()
  
  // Get current profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single()
  
  if (!profile) return
  
  const today = new Date().toISOString().split("T")[0]
  const lastActivity = profile.last_activity_date
  
  let newStreak = profile.current_streak
  
  if (lastActivity) {
    const lastDate = new Date(lastActivity)
    const todayDate = new Date(today)
    const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) {
      // Consecutive day - increment streak
      newStreak += 1
    } else if (diffDays > 1) {
      // Streak broken - reset to 1
      newStreak = 1
    }
    // If same day (diffDays === 0), keep current streak
  } else {
    // First activity ever
    newStreak = 1
  }
  
  const longestStreak = Math.max(newStreak, profile.longest_streak)
  
  await supabase
    .from("profiles")
    .update({
      total_xp: profile.total_xp + xpToAdd,
      current_streak: newStreak,
      longest_streak: longestStreak,
      last_activity_date: today,
    })
    .eq("id", userId)
}

export async function upsertStreakLog(userId: string, source: string) {
  const supabase = await createClient()
  const today = new Date().toISOString().split("T")[0]

  const { error } = await supabase
    .from("streak_logs")
    .upsert(
      {
        user_id: userId,
        activity_date: today,
        source,
      },
      { onConflict: "user_id,activity_date" }
    )

  if (error) throw error
}

export async function createNotification(
  userId: string,
  input: {
    type: string
    title: string
    body: string
    data?: unknown
  }
) {
  const supabase = await createClient()
  const { error } = await supabase
    .from("notifications")
    .insert({
      user_id: userId,
      type: input.type,
      title: input.title,
      body: input.body,
      data: input.data ?? null,
    })

  if (error) throw error
}

export async function getUserNotifications(userId: string, limit = 50): Promise<Notification[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit)

  if (error) throw error
  return (data || []) as Notification[]
}

export async function getUnreadNotificationsCount(userId: string): Promise<number> {
  const supabase = await createClient()
  const { count, error } = await supabase
    .from("notifications")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("is_read", false)

  if (error) throw error
  return count || 0
}

export async function markNotificationsRead(userId: string, ids: string[]) {
  if (ids.length === 0) return

  const supabase = await createClient()
  const { error } = await supabase
    .from("notifications")
    .update({ is_read: true, read_at: new Date().toISOString() })
    .eq("user_id", userId)
    .in("id", ids)

  if (error) throw error
}

export async function saveQuestionResponse(
  attemptId: string,
  questionId: string,
  selectedAnswer: number,
  isCorrect: boolean
) {
  const supabase = await createClient()
  const { error } = await supabase
    .from("question_responses")
    .insert({
      attempt_id: attemptId,
      question_id: questionId,
      user_answer: String(selectedAnswer),
      is_correct: isCorrect,
    })
  
  if (error) throw error
}

export async function assignDailyMissions(userId: string) {
  const supabase = await createClient()
  const today = new Date().toISOString().split("T")[0]
  
  // Check if user already has missions for today
  const { data: existing } = await supabase
    .from("user_missions")
    .select("id")
    .eq("user_id", userId)
    .eq("assigned_date", today)
    .limit(1)
  
  if (existing && existing.length > 0) {
    return // Already has missions for today
  }
  
  // Get daily missions
  const { data: missions } = await supabase
    .from("missions")
    .select("id")
    .eq("is_daily", true)
  
  if (!missions || missions.length === 0) return
  
  // Assign all daily missions to user
  const userMissions = missions.map(m => ({
    user_id: userId,
    mission_id: m.id,
    current_progress: 0,
    is_completed: false,
    assigned_date: today,
  }))
  
  await supabase.from("user_missions").insert(userMissions)
}

export async function updateMissionProgress(
  userId: string,
  missionType: string,
  incrementBy: number = 1
) {
  const supabase = await createClient()
  const today = new Date().toISOString().split("T")[0]
  
  // Get user's missions of this type for today
  const { data: userMissions } = await supabase
    .from("user_missions")
    .select(`
      *,
      mission:missions(*)
    `)
    .eq("user_id", userId)
    .eq("assigned_date", today)
    .eq("is_completed", false)
  
  if (!userMissions) return
  
  for (const um of userMissions) {
    if (um.mission?.mission_type === missionType) {
      const newProgress = um.current_progress + incrementBy
      const isCompleted = newProgress >= um.mission.target_value
      
      await supabase
        .from("user_missions")
        .update({
          current_progress: newProgress,
          is_completed: isCompleted,
          completed_at: isCompleted ? new Date().toISOString() : null,
        })
        .eq("id", um.id)
      
      // Award XP if completed
      if (isCompleted) {
        await updateUserXpAndStreak(userId, um.mission.xp_reward)
      }
    }
  }
}
