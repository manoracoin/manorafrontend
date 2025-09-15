"use client"

import { cn } from "@/lib/utils"
import { ArrowDownLeft, ArrowUpRight, XCircle } from "lucide-react"

type ExplorerTx = {
  id: string
  timestamp: string
  from: string
  to: string
  method?: string
  value: string
  fee?: string
  status: 'success' | 'failed'
  type?: string
  amount?: string
}

type Labels = {
  from: string
  to: string
}

type TransactionMobileRowProps = {
  tx: ExplorerTx
  labels: Labels
}

export default function TransactionMobileRow({ tx, labels }: TransactionMobileRowProps) {
  return (
    <div className="sm:hidden flex items-center gap-3">
      <div className={cn(
        "p-3 rounded-xl",
        tx.type === 'mint' && 'bg-green-500/10 text-green-600',
        tx.type === 'transfer' && 'bg-blue-500/10 text-blue-600',
        tx.type === 'burn' && 'bg-red-500/10 text-red-600'
      )}>
        {tx.type === 'mint' ? <ArrowDownLeft className="h-5 w-5" /> : tx.type === 'transfer' ? <ArrowUpRight className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
      </div>
      <div className="space-y-1 w-full">
        <div className="font-mono text-sm truncate max-w-full">{tx.id}</div>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
          <span>{labels.from}: {tx.from}</span>
          <span className="mx-1">→</span>
          <span>{labels.to}: {tx.to}</span>
        </div>
        <div className="mt-2 text-sm">
          <div className="text-base font-semibold">{tx.amount}</div>
          <div className="text-muted-foreground">{tx.value}</div>
          <div className="text-xs text-muted-foreground">{new Date(tx.timestamp).toLocaleString()}</div>
        </div>
      </div>
    </div>
  )
}


