"use client"

import { Card } from "@/components/ui/card"
import { FileCode } from "lucide-react"

type SmartContractsSummaryCardProps = {
  title: string
  activeLabel: string
  verifiedLabel: string
  activeCount: number
  verifiedCount: number
}

export default function SmartContractsSummaryCard({ title, activeLabel, verifiedLabel, activeCount, verifiedCount }: SmartContractsSummaryCardProps) {
  return (
    <Card className="p-4 min-h-[160px] bg-gradient-to-br from-rose-500 to-orange-500 text-white border-none relative w-full min-w-full sm:min-w-0 snap-start">
      <FileCode className="h-20 w-20 absolute -bottom-3 -right-2 opacity-20 pointer-events-none" />
      <div className="text-base sm:text-lg leading-snug font-bold tracking-tight">{title}</div>
      <div className="mt-3 grid grid-cols-2 gap-4">
        <div>
          <div className="opacity-90 text-sm">{activeLabel}</div>
          <div className="text-3xl font-bold tracking-tight">{activeCount}</div>
        </div>
        <div>
          <div className="opacity-90 text-sm">{verifiedLabel}</div>
          <div className="text-3xl font-bold tracking-tight">{verifiedCount}</div>
        </div>
      </div>
    </Card>
  )
}


