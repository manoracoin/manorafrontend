"use client"

import { useEffect, useMemo, useState } from "react"
import BottomSheet from "@/components/ui/BottomSheet"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { FileCode, Clock } from "lucide-react"
import { explorerData, ContractEvent, ContractTx, HolderItem } from "@/components/explorer/constants"

export type ContractMeta = {
  name?: string
  status?: 'active' | 'paused' | 'archived'
  type?: string
  verified?: boolean
}

export type ContractDetailPanelProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  address?: string | null
  meta?: ContractMeta
}

export default function ContractDetailPanel({ open, onOpenChange, address, meta }: ContractDetailPanelProps) {
  const [isDesktop, setIsDesktop] = useState(false)
  const [events, setEvents] = useState<ContractEvent[]>([])
  const [abi, setAbi] = useState<string>("[]")
  const [txs, setTxs] = useState<ContractTx[]>([])
  const [holders, setHolders] = useState<HolderItem[]>([])

  useEffect(() => {
    const mql = window.matchMedia('(min-width: 640px)')
    const listener = (e: MediaQueryListEvent) => setIsDesktop(e.matches)
    setIsDesktop(mql.matches)
    mql.addEventListener ? mql.addEventListener('change', listener) : mql.addListener(listener)
    return () => { mql.removeEventListener ? mql.removeEventListener('change', listener) : mql.removeListener(listener) }
  }, [])

  useEffect(() => {
    if (!open || !address) return
    explorerData.getContractEvents(address).then(setEvents)
    explorerData.getContractAbi(address).then(setAbi)
    explorerData.getContractTransactions(address).then(setTxs)
    explorerData.getHolders(address).then(setHolders)
  }, [open, address])

  const title = useMemo(() => meta?.name ?? address ?? 'Contract', [meta?.name, address])

  const Summary = (
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600"><FileCode className="h-5 w-5" /></div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-medium">{meta?.name ?? address}</span>
            {meta?.status && (
              <Badge variant="secondary" className={
                meta.status === 'active' ? 'bg-green-500/10 text-green-500' :
                meta.status === 'paused' ? 'bg-yellow-500/10 text-yellow-500' :
                'bg-muted text-foreground'
              }>{meta.status}</Badge>
            )}
          </div>
          <div className="text-sm text-muted-foreground">{meta?.type}{meta?.type ? ' • ' : ''}{address}</div>
        </div>
      </div>
    </div>
  )

  const prettyAbi = useMemo(() => {
    try { return JSON.stringify(JSON.parse(abi), null, 2) } catch { return abi }
  }, [abi])

  const Content = (
    <div className="p-4 space-y-4">
      {Summary}

      <div className="space-y-3">
        <h4 className="text-sm font-semibold">ABI</h4>
        <pre className="bg-muted p-3 rounded-md text-xs whitespace-pre-wrap break-words">{prettyAbi}</pre>
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-semibold">Events</h4>
        <div className="space-y-2 pr-1">
          {events.map(e => (
            <div key={e.id} className="flex items-center justify-between p-2 rounded-lg border bg-card/50">
              <div className="space-y-0.5">
                <div className="font-medium">{e.name}</div>
                <div className="text-xs text-muted-foreground">{e.tx}</div>
              </div>
              <div className="text-xs text-muted-foreground">{new Date(e.time).toLocaleString()}</div>
            </div>
          ))}
          {events.length === 0 && (<div className="text-sm text-muted-foreground">No events.</div>)}
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-semibold">Holders</h4>
        <div className="space-y-2 pr-1">
          {holders.map(h => (
            <div key={h.address} className="flex items-center justify-between p-2 rounded-lg border bg-card/50">
              <span className="font-mono text-sm">{h.address}</span>
              <span className="text-sm">{h.balance}</span>
            </div>
          ))}
          {holders.length === 0 && (<div className="text-sm text-muted-foreground">No holders.</div>)}
        </div>
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
          {txs.length === 0 && (<div className="text-sm text-muted-foreground">No transactions.</div>)}
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


