"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import React from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Pagination, PaginationContent, PaginationFirst, PaginationItem, PaginationLast, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"

type MnrTx = {
  id: string
  type: 'buy' | 'sell' | 're_token_buy' | 're_token_sell'
  amountMnr: number
  amountUsd?: number
  from: string
  to: string
  timestamp: string
  status: 'success' | 'failed'
}

const mnrTransactions: MnrTx[] = [
  { id: 'mnr_2001', type: 'buy', amountMnr: 200, amountUsd: 500, from: 'Fiat Wallet', to: 'Manora Wallet', timestamp: '2024-03-17T12:00:00', status: 'success' },
  { id: 'mnr_2002', type: 're_token_buy', amountMnr: 50, from: 'Manora Wallet', to: 'Buy RE Token (WRFMI)', timestamp: '2024-03-19T09:30:00', status: 'success' },
]

export default function ManoraTransactionsTable() {
  const [page, setPage] = React.useState<number>(1)
  const [pageSize, setPageSize] = React.useState<number>(10)
  const [showBar, setShowBar] = React.useState<boolean>(true)

  const totalItems = mnrTransactions.length
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
  const currentPage = Math.min(page, totalPages)
  const startIdx = (currentPage - 1) * pageSize
  const endIdx = Math.min(currentPage * pageSize, totalItems)
  const paginated = React.useMemo(() => mnrTransactions.slice(startIdx, endIdx), [startIdx, endIdx])

  const dateFmt = React.useMemo(() => new Intl.DateTimeFormat('en-US', { dateStyle: 'short', timeStyle: 'short', timeZone: 'UTC' }), [])

  React.useEffect(() => {
    const scroller = document.querySelector('main') as HTMLElement | null
    if (!scroller) return
    let last = scroller.scrollTop
    const onScroll = () => {
      const y = scroller.scrollTop
      if (y > last && y > 80) setShowBar(false)
      else setShowBar(true)
      last = y
    }
    scroller.addEventListener('scroll', onScroll, { passive: true })
    return () => scroller.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      {/* Mobile: full-width rows without Card wrapper, with row numbers + pagination */}
      <div className="sm:hidden">
        <h3 className="text-lg font-semibold mb-3">Manora Transactions</h3>
        <div className="space-y-2">
          {paginated.map((tx, i) => (
            <div key={tx.id} className="p-3 rounded-lg border bg-card/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-6 text-xs text-muted-foreground text-right tabular-nums">{startIdx + i + 1}</div>
                  <div className="font-mono text-sm truncate">{tx.id}</div>
                </div>
                <Badge variant="secondary" className={
                  tx.type==='buy' ? 'bg-emerald-500/10 text-emerald-600' :
                  tx.type==='sell' ? 'bg-blue-500/10 text-blue-600' :
                  tx.type==='re_token_buy' ? 'bg-purple-500/10 text-purple-600' :
                  'bg-amber-500/10 text-amber-600'
                }>
                  {tx.type.replace('re_token_', '').replace('_', ' ')}
                </Badge>
              </div>
              <div className="mt-1 text-xs text-muted-foreground">{dateFmt.format(new Date(tx.timestamp))}</div>
              <div className="mt-1 text-sm truncate">{tx.from} → {tx.to}</div>
              <div className="mt-1 text-sm font-medium">{tx.amountMnr.toLocaleString()} MNR{tx.amountUsd?` ($${tx.amountUsd.toLocaleString()})`:''}</div>
            </div>
          ))}
          {totalItems === 0 && (
            <div className="text-sm text-muted-foreground">No MNR transactions.</div>
          )}
        </div>
        <div className={`flex items-center justify-between gap-2 pt-2 sm:pt-3 sm:flex-wrap whitespace-nowrap fixed inset-x-0 bottom-20 z-30 border-t bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/60 px-3 sm:px-0 sm:static transform transition-transform duration-200 ${showBar ? 'translate-y-0' : 'translate-y-full'} sm:translate-y-0`}>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Select value={String(pageSize)} onValueChange={(v)=>setPageSize(Number(v))}>
              <SelectTrigger className="w-[72px] h-9"><SelectValue /></SelectTrigger>
              <SelectContent>{[5,10,20,50].map(n => (<SelectItem key={n} value={String(n)}>{n}</SelectItem>))}</SelectContent>
            </Select>
            <span className="hidden sm:inline">{totalItems === 0 ? '0-0' : `${startIdx + 1}-${endIdx}`} of {totalItems}</span>
          </div>
          <Pagination className="w-auto ml-auto shrink-0">
            <PaginationContent>
              <PaginationItem><PaginationFirst href="#" onClick={(e)=>{e.preventDefault(); setPage(1)}} /></PaginationItem>
              <PaginationItem><PaginationPrevious href="#" onClick={(e)=>{e.preventDefault(); setPage(p=>Math.max(1,p-1))}} /></PaginationItem>
              <PaginationItem><PaginationLink href="#" onClick={(e)=>{e.preventDefault(); setPage(1)}} isActive={currentPage===1}>1</PaginationLink></PaginationItem>
              {currentPage>2 && totalPages>3 && (<PaginationItem><span className="px-2 text-muted-foreground">…</span></PaginationItem>)}
              {totalPages>1 && (<PaginationItem><PaginationLink href="#" isActive={currentPage!==1 && currentPage!==totalPages} onClick={(e)=>e.preventDefault()}>{currentPage!==1 && currentPage!==totalPages ? currentPage : Math.min(2,totalPages)}</PaginationLink></PaginationItem>)}
              {currentPage<totalPages-1 && totalPages>3 && (<PaginationItem><span className="px-2 text-muted-foreground">…</span></PaginationItem>)}
              {totalPages>1 && (<PaginationItem><PaginationLink href="#" onClick={(e)=>{e.preventDefault(); setPage(totalPages)}} isActive={currentPage===totalPages}>{totalPages}</PaginationLink></PaginationItem>)}
              <PaginationItem><PaginationNext href="#" onClick={(e)=>{e.preventDefault(); setPage(p=>Math.min(totalPages,p+1))}} /></PaginationItem>
              <PaginationItem><PaginationLast href="#" onClick={(e)=>{e.preventDefault(); setPage(totalPages)}} /></PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
        <div className="h-28 sm:hidden" />
      </div>

      {/* Desktop: keep Card wrapper as-is */}
      <Card className="hidden sm:block p-6">
        <h3 className="text-lg font-semibold mb-3">Manora Transactions</h3>
        <div className="space-y-2">
          {mnrTransactions.map(tx => (
            <div key={tx.id} className="p-3 rounded-lg border bg-card/50">
              <div className="flex items-center justify-between">
                <div className="font-mono text-sm truncate">{tx.id}</div>
                <Badge variant="secondary" className={
                  tx.type==='buy' ? 'bg-emerald-500/10 text-emerald-600' :
                  tx.type==='sell' ? 'bg-blue-500/10 text-blue-600' :
                  tx.type==='re_token_buy' ? 'bg-purple-500/10 text-purple-600' :
                  'bg-amber-500/10 text-amber-600'
                }>
                  {tx.type.replace('re_token_', '').replace('_', ' ')}
                </Badge>
              </div>
              <div className="mt-1 text-xs text-muted-foreground">{dateFmt.format(new Date(tx.timestamp))}</div>
              <div className="mt-1 text-sm truncate">{tx.from} → {tx.to}</div>
              <div className="mt-1 text-sm font-medium">{tx.amountMnr.toLocaleString()} MNR{tx.amountUsd?` ($${tx.amountUsd.toLocaleString()})`:''}</div>
            </div>
          ))}
          {mnrTransactions.length === 0 && (
            <div className="text-sm text-muted-foreground">No MNR transactions.</div>
          )}
        </div>
      </Card>
    </>
  )
}


