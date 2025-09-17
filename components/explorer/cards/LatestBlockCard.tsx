"use client"

import { Card } from "@/components/ui/card"
import { Box } from "lucide-react"
import { ReactNode, ElementType } from "react"

type LatestBlockCardProps = {
  id?: string
  label: string
  value: number
  subtitle?: string
  gradientClassName?: string
  locale?: string
  rightElement?: ReactNode
  footerElement?: ReactNode
  icon?: ElementType
}

export default function LatestBlockCard({ id, label, value, subtitle, gradientClassName, locale = 'en-US', rightElement, footerElement, icon }: LatestBlockCardProps) {
  const IconComp = icon || Box
  return (
    <Card id={id} className={`p-4 min-h-[160px] text-white border-none relative overflow-hidden w-full min-w-full sm:min-w-0 snap-start ${gradientClassName || 'bg-gradient-to-br from-violet-500 to-fuchsia-600'}`}>
      <IconComp className="h-20 w-20 absolute -bottom-3 -right-2 opacity-20 pointer-events-none" />
      <div className="flex items-start justify-between gap-3">
        <div className="text-base sm:text-lg leading-snug font-bold tracking-tight">{label}</div>
        {rightElement}
      </div>
      <div className="mt-2 text-3xl font-bold tracking-tight">{value.toLocaleString(locale)}</div>
      {subtitle && (
        <div className="opacity-90 text-sm mt-1">{subtitle}</div>
      )}
      {footerElement && (
        <div className="mt-3">
          {footerElement}
        </div>
      )}
    </Card>
  )
}


