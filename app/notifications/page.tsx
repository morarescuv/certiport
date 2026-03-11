import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getUserSelectedExamSlugs, getUserNotifications } from "@/lib/database"
import { DashboardLayout } from "@/components/dashboard-layout"
import { NotificationsClient } from "./notifications-client"

export default async function NotificationsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const selectedExamSlugs = await getUserSelectedExamSlugs(user.id)
  if (selectedExamSlugs.length === 0) {
    redirect("/onboarding")
  }

  const notifications = await getUserNotifications(user.id)

  return (
    <DashboardLayout>
      <NotificationsClient initialNotifications={notifications} />
    </DashboardLayout>
  )
}
