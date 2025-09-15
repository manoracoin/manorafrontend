"use client"

import { Badge } from "@/components/ui/badge"
import { FileCode } from "lucide-react"

export type ContractItem = {
  name: string
  address: string
  status: 'active' | 'paused' | 'archived'
  type: string
  verified: boolean
  lastEvent: string
}

type ContractsListProps = {
  items: ContractItem[]
  labels: { contractType: string; verified: string }
}

export default function ContractsList({ items, labels }: ContractsListProps) {
  return (
    <div className="space-y-2 sm:space-y-3">
      {items.map((c) => (
        <div key={c.address} className="flex flex-col sm:flex-row sm:items-center p-4 sm:p-3 rounded-lg border bg-card/50 gap-2 sm:gap-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600">
              <FileCode className="h-5 w-5" />
            </div>
            <div className="space-y-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium">{c.name}</span>
                <Badge variant="secondary" className={
                  c.status === 'active' ? 'bg-green-500/10 text-green-500' :
                  c.status === 'paused' ? 'bg-yellow-500/10 text-yellow-500' :
                  'bg-muted text-foreground'
                }>
                  {c.status}
                </Badge>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                <span className="font-mono break-all">{c.address}</span>
                <span>{labels.contractType}: {c.type}</span>
                {c.verified && <span className="text-green-600">{labels.verified}</span>}
              </div>
            </div>
          </div>
          <div className="mt-2 sm:mt-0 sm:ml-auto text-sm text-muted-foreground sm:text-right shrink-0">
            {new Date(c.lastEvent).toLocaleString()}
          </div>
        </div>
      ))}
    </div>
  )
}


