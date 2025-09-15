"use client"

import { Wallet } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface Props {
  total: number
  available: number
  invested: number
}

export default function SidebarBalanceCard({ total, available, invested }: Props) {
  const nf = new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  return (
    <div className="w-full rounded-lg p-3 text-white shadow-lg ring-1 ring-white/10 bg-gradient-to-br from-blue-600 via-indigo-600 to-indigo-700 hover:from-blue-500 hover:via-indigo-600 hover:to-indigo-700 transition-colors cursor-default">
      <div className="flex items-start justify-between">
        <div className="text-xs font-medium opacity-95">Total Balance</div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="p-1 rounded-md bg-white/15" aria-label="Balance info">
                <Wallet size={16} className="text-white" />
              </div>
            </TooltipTrigger>
            <TooltipContent side="right" className="text-xs">
              Available = liquid funds. Invested = locked in positions.
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="mt-1 text-3xl font-extrabold tracking-tight">${nf.format(total)}</div>

      <div className="mt-3 grid grid-cols-2 gap-3 text-[12px]">
        <div>
          <div className="opacity-90">Available:</div>
          <div className="font-semibold">${nf.format(available)}</div>
        </div>
        <div>
          <div className="opacity-90">Invested:</div>
          <div className="font-semibold">${nf.format(invested)}</div>
        </div>
      </div>
    </div>
  )
}
