"use client"

import { Card } from "@/components/ui/card"
import { Box } from "lucide-react"

type LatestBlockCardProps = {
  label: string
  value: number
}

export default function LatestBlockCard({ label, value }: LatestBlockCardProps) {
  return (
    <Card className="p-4 min-h-[160px] bg-gradient-to-br from-violet-500 to-fuchsia-600 text-white border-none relative w-full min-w-full sm:min-w-0 snap-start">
      <Box className="h-20 w-20 absolute -bottom-3 -right-2 opacity-20 pointer-events-none" />
      <div className="text-base sm:text-lg leading-snug font-bold tracking-tight">{label}</div>
      <div className="mt-2 text-3xl font-bold tracking-tight">{value.toLocaleString()}</div>
    </Card>
  )
}


