"use client"

import { useEffect, useMemo, useState } from "react"
import BottomSheet from "@/components/ui/BottomSheet"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Box, Clock } from "lucide-react"
import { explorerData, BlockItem, ContractTx } from "@/components/explorer/constants"

export type BlockDetailPanelProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  height?: number | null
}

export default function BlockDetailPanel({ open, onOpenChange, height }: BlockDetailPanelProps) {
  const [isDesktop, setIsDesktop] = useState(false)
  const [block, setBlock] = useState<BlockItem | undefined>()
  const [txs, setTxs] = useState<ContractTx[]>([])

  // Responsive behavior
  useEffect(() => {
    const mql = window.matchMedia('(min-width: 640px)')
    const listener = (e: MediaQueryListEvent) => setIsDesktop(e.matches)
    setIsDesktop(mql.matches)
    mql.addEventListener ? mql.addEventListener('change', listener) : mql.addListener(listener)
    return () => { mql.removeEventListener ? mql.removeEventListener('change', listener) : mql.removeListener(listener) }
  }, [])

  // Fetch details when opening
  useEffect(() => {
    if (!open || !height) return
    explorerData.getBlockByHeight(height).then(setBlock)
    explorerData.getBlockTransactions(height).then(setTxs)
  }, [open, height])

  const title = useMemo(() => `Block #${height ?? ''}`, [height])

  const Content = (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-500"><Box className="h-5 w-5" /></div>
        <div className="space-y-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium">Hash</span>
            {block?.status && (
              <Badge variant="secondary" className="bg-green-500/10 text-green-500">{block.status}</Badge>
            )}
          </div>
          <div className="text-sm text-muted-foreground break-all">{block?.hash ?? '—'}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
        <div><span className="text-muted-foreground">Parent</span><div className="break-all">{block?.parentHash ?? '—'}</div></div>
        <div><span className="text-muted-foreground">Timestamp</span><div>{block ? new Date(block.timestamp).toLocaleString() : '—'}</div></div>
        <div><span className="text-muted-foreground">Transactions</span><div>{block?.transactions ?? '—'}</div></div>
        <div><span className="text-muted-foreground">Size</span><div>{block?.size ?? '—'}</div></div>
        <div><span className="text-muted-foreground">Gas Used</span><div>{block?.gasUsed ?? '—'}</div></div>
        <div><span className="text-muted-foreground">Gas Limit</span><div>{block?.gasLimit ?? '—'}</div></div>
        <div><span className="text-muted-foreground">Proposer</span><div>{block?.proposer ?? '—'}</div></div>
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-semibold">Transactions</h4>
        <div className="space-y-2 pr-1">
          {txs.map(tx => (
            <div key={tx.id} className="p-2 rounded-lg border bg-card/50">
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm">{tx.id}</span>
                <span className="flex items-center gap-1 text-xs text-muted-foreground"><Clock className="h-3 w-3" />{new Date(tx.timestamp).toLocaleString()}</span>
              </div>
              <div className="mt-1 text-xs text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-1">
                <span>Method: {tx.method}</span>
                <span>From: {tx.from}</span>
                <span>To: {tx.to}</span>
                <span>Value: {tx.value}</span>
              </div>
            </div>
          ))}
          {txs.length === 0 && <div className="text-sm text-muted-foreground">No transactions.</div>}
        </div>
      </div>
    </div>
  )

  if (!isDesktop) {
    return (
      <BottomSheet open={open} onOpenChange={onOpenChange} title={title}>
        {Content}
      </BottomSheet>
    )
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="sm:max-w-md w-[90vw] p-0 flex flex-col">
        <SheetHeader className="px-4 pt-4">
          <SheetTitle>{title}</SheetTitle>
        </SheetHeader>
        <div className="min-h-0 overflow-y-auto">
          {Content}
        </div>
      </SheetContent>
    </Sheet>
  )
}


