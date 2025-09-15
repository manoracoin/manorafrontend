"use client"

import { Badge } from "@/components/ui/badge"
import { Box } from "lucide-react"

type BlockItem = {
  height: number
  timestamp: string
  transactions: number
  size: string
}

type Labels = {
  block: string
  validated: string
  txs: string
}

type BlockMobileRowProps = {
  block: BlockItem
  labels: Labels
}

export default function BlockMobileRow({ block, labels }: BlockMobileRowProps) {
  return (
    <div className="sm:hidden flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-500">
          <Box className="h-5 w-5" />
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-medium">{labels.block} #{block.height}</span>
            <Badge variant="secondary" className="bg-green-500/10 text-green-500">{labels.validated}</Badge>
          </div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>{block.transactions} {labels.txs}</span>
            <span>{block.size}</span>
          </div>
        </div>
      </div>
      <div className="text-right text-xs text-muted-foreground">{new Date(block.timestamp).toLocaleString()}</div>
    </div>
  )
}


