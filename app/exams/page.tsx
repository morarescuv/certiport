import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getUserSelectedExamSlugs } from "@/lib/database"

export default async function ExamsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const selectedExamSlugs = await getUserSelectedExamSlugs(user.id)
  if (selectedExamSlugs.length === 0) {
    redirect("/onboarding")
  }

  redirect("/examenele-mele")
}
