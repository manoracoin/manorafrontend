"use client"

import { Badge } from "@/components/ui/badge"
import { Box } from "lucide-react"

export type BlockItem = {
  height: number
  timestamp: string
  transactions: number
  size: string
  status: 'validated' | 'pending'
}

type BlocksListProps = {
  items: BlockItem[]
  labels: { title: string; validated: string; txs: string }
}

export default function BlocksList({ items, labels }: BlocksListProps) {
  return (
    <div className="space-y-2 sm:space-y-3">
      {items.map((block) => (
        <div key={block.height} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 sm:p-3 rounded-lg border bg-card/50">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-500">
              <Box className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-medium">{labels.title} #{block.height}</span>
                <Badge variant="secondary" className="bg-green-500/10 text-green-500">
                  {labels.validated}
                </Badge>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                <span>{block.transactions} {labels.txs}</span>
                <span>{block.size}</span>
              </div>
            </div>
          </div>
          <div className="mt-2 sm:mt-0 text-sm text-muted-foreground sm:text-right">
            {new Date(block.timestamp).toLocaleString()}
          </div>
        </div>
      ))}
    </div>
  )
}


