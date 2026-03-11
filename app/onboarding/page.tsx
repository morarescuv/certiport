import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getUserSelectedExamSlugs } from "@/lib/database"
import { OnboardingClient } from "./onboarding-client"

export default async function OnboardingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const selected = await getUserSelectedExamSlugs(user.id)

  if (selected.length > 0) {
    redirect("/")
  }

  return <OnboardingClient />
}
