import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import BottomNav from "@/components/dashboard/BottomNav"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="h-screen flex bg-transparent w-full overflow-hidden">
      <Sidebar />
      <main className="flex-1 min-w-0 overflow-y-auto">
        <Header />
        <div className="p-4 md:p-8">
          <div className="rounded-xl bg-card/50 border border-border/50 p-4 md:p-6 max-w-full overflow-x-hidden">
            {children}
          </div>
        </div>
        <BottomNav />
      </main>
    </div>
  )
}