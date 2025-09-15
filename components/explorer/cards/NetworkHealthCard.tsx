"use client"

import { Card } from "@/components/ui/card"
import { Activity } from "lucide-react"

type NetworkHealthCardProps = {
  title: string
  statusBadge: { label: string; className: string }
  blockTimeLabel: string
  pendingTxsLabel: string
  difficultyLabel: string
  hashRateLabel: string
  blockTime: string
  pendingTxs: number
  difficulty: string
  hashRate: string
}

export default function NetworkHealthCard({ title, statusBadge, blockTimeLabel, pendingTxsLabel, difficultyLabel, hashRateLabel, blockTime, pendingTxs, difficulty, hashRate }: NetworkHealthCardProps) {
  return (
    <Card className="p-4 min-h-[180px] bg-gradient-to-br from-sky-500 to-indigo-600 text-white border-none relative w-full min-w-full sm:min-w-0 snap-start">
      <Activity className="h-20 w-20 absolute -bottom-3 -right-2 opacity-20 pointer-events-none" />
      <div className="flex items-start justify-between">
        <div className="text-base sm:text-lg leading-snug font-bold tracking-tight">{title}</div>
        <span className={`px-2 py-0.5 rounded-full text-xs ${statusBadge.className}`}>{statusBadge.label}</span>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div>
          <div className="opacity-90">{blockTimeLabel}</div>
          <div className="font-medium">{blockTime}</div>
        </div>
        <div>
          <div className="opacity-90">{pendingTxsLabel}</div>
          <div className="font-medium">{pendingTxs.toLocaleString()}</div>
        </div>
        <div>
          <div className="opacity-90">{difficultyLabel}</div>
          <div className="font-medium">{difficulty}</div>
        </div>
        <div>
          <div className="opacity-90">{hashRateLabel}</div>
          <div className="font-medium">{hashRate}</div>
        </div>
      </div>
    </Card>
  )
}


