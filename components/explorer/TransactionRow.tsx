"use client"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { ArrowDownLeft, ArrowUpRight, XCircle } from "lucide-react"

type TransactionRowProps = {
  id: string
  type?: string
  contract?: string
  status: 'success' | 'failed'
  from: string
  to: string
  method?: string
  amount?: string
  value: string
  timestamp: string
  labels: {
    from: string
    to: string
    method: string
  }
}

export default function TransactionRow({ id, type, contract, status, from, to, method, amount, value, timestamp, labels }: TransactionRowProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 rounded-lg border bg-card/50">
      <div className="flex items-center gap-3 w-full sm:w-auto">
        <div className={cn(
          "p-3 rounded-xl",
          type === 'mint' && 'bg-green-500/10 text-green-600',
          type === 'transfer' && 'bg-blue-500/10 text-blue-600',
          type === 'burn' && 'bg-red-500/10 text-red-600'
        )}>
          {type === 'mint' ? <ArrowDownLeft className="h-5 w-5" /> : type === 'transfer' ? <ArrowUpRight className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
        </div>
        <div className="space-y-1 w-full">
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm truncate max-w-full sm:max-w-none">{id}</span>
            {contract && <Badge variant="secondary" className="hidden sm:inline-flex">{contract}</Badge>}
            <Badge variant="secondary" className={status === 'success' ? 'hidden sm:inline-flex bg-green-500/10 text-green-500' : 'hidden sm:inline-flex bg-red-500/10 text-red-500'}>
              {status === 'success' ? 'Success' : 'Failed'}
            </Badge>
          </div>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
            <span>{labels.from}: {from}</span>
            <span className="mx-1">→</span>
            <span>{labels.to}: {to}</span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline">{labels.method}: {method ?? '—'}</span>
          </div>
          <div className="sm:hidden mt-2 text-sm">
            <div className="text-base font-semibold">{amount}</div>
            <div className="text-muted-foreground">{value}</div>
            <div className="text-xs text-muted-foreground">{new Date(timestamp).toLocaleString()}</div>
          </div>
        </div>
      </div>
      <div className="hidden sm:block mt-2 sm:mt-0 text-sm sm:text-right w-full sm:w-auto">
        <div className="font-medium">{amount}</div>
        <div className="text-muted-foreground">{value}</div>
        <div className="text-xs text-muted-foreground">{new Date(timestamp).toLocaleString()}</div>
      </div>
    </div>
  )
}


