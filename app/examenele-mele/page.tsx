import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getUserSelectedExamSlugs } from "@/lib/database"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ExameneleMeleClient } from "./examenele-mele-client"

export default async function ExameneleMelePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const selectedExamSlugs = await getUserSelectedExamSlugs(user.id)
  if (selectedExamSlugs.length === 0) {
    redirect("/onboarding")
  }

  return (
    <DashboardLayout>
      <ExameneleMeleClient initialSelected={selectedExamSlugs} />
    </DashboardLayout>
  )
}
