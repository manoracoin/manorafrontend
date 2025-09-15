"use client"

import { useI18n } from "@/components/i18n-provider"

export default function DashboardPage() {
  const { t } = useI18n()
  return (
    <div className="flex-1 space-y-4">
      <h2 className="text-3xl font-bold tracking-tight">{t('dashboard.title')}</h2>
    </div>
  )
}