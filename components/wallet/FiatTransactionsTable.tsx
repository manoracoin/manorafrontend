"use client"

import { Card } from "@/components/ui/card"
import { ArrowDownLeft, ArrowUpRight, Coins, ArrowLeftRight, Banknote, ChevronRight } from "lucide-react"
import React from "react"
import Image from "next/image"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Pagination, PaginationContent, PaginationFirst, PaginationItem, PaginationLast, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"

import { fiatTransactions } from "@/components/wallet/fiatData"

export default function FiatTransactionsTable() {
  const [page, setPage] = React.useState<number>(1)
  const [pageSize, setPageSize] = React.useState<number>(10)
  const [showBar, setShowBar] = React.useState<boolean>(true)
  const [expanded, setExpanded] = React.useState<Record<string, boolean>>({})

  const totalItems = fiatTransactions.length
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
  const currentPage = Math.min(page, totalPages)
  const startIdx = (currentPage - 1) * pageSize
  const endIdx = Math.min(currentPage * pageSize, totalItems)
  const paginated = React.useMemo(() => fiatTransactions.slice(startIdx, endIdx), [startIdx, endIdx])

  const dateFmt = React.useMemo(() => new Intl.DateTimeFormat('en-US', { dateStyle: 'short', timeStyle: 'short', timeZone: 'UTC' }), [])
  const timeFmt = React.useMemo(() => new Intl.DateTimeFormat(undefined, { hour: '2-digit', minute: '2-digit' }), [])
  const dateKey = (d: Date) => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
  const dayLabel = (d: Date) => {
    const today = new Date()
    const yest = new Date(today)
    yest.setDate(today.getDate()-1)
    const dk = dateKey(d)
    if (dk === dateKey(today)) return 'Today'
    if (dk === dateKey(yest)) return 'Yesterday'
    return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(d)
  }
  const groups = React.useMemo(() => {
    const items = paginated
    const orderKeys: string[] = []
    const keyToData: Record<string, { label: string, items: typeof paginated, net: number }> = {}
    for (const tx of items) {
      const d = new Date(tx.timestamp)
      const k = dateKey(d)
      if (!keyToData[k]) {
        orderKeys.push(k)
        keyToData[k] = { label: dayLabel(d), items: [] as any, net: 0 }
      }
      keyToData[k].items.push(tx)
      const delta = (tx.type === 'deposit' || tx.type === 'sell') ? tx.amount : -tx.amount
      keyToData[k].net += delta
    }
    return orderKeys.map(k => keyToData[k])
  }, [paginated])
  const toggleExpand = (id: string) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }))

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
        <h3 className="text-lg font-semibold mb-3">Fiat Transactions</h3>
        <div className="space-y-2">
          {groups.map((group) => (
            <div key={group.label} className="space-y-2">
              <div className="flex items-center gap-2 px-3 py-1 text-xs uppercase text-muted-foreground">
                <span>{group.label}</span>
                <span className={group.net > 0 ? 'text-green-600' : group.net < 0 ? 'text-red-600' : ''}>
                  {group.net > 0 ? `+$${group.net.toLocaleString()}` : group.net < 0 ? `-$${Math.abs(group.net).toLocaleString()}` : '$0'}
                </span>
              </div>
              {group.items.map((tx) => (
                <div key={tx.id} className="p-3 rounded-lg border bg-card/50">
                  <div className="sm:hidden cursor-pointer" onClick={() => toggleExpand(tx.id)}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {tx.type==='buy' || tx.type==='sell' ? (
                          <div className="flex items-center gap-1">
                            {tx.type==='sell' ? (
                              <div className={`h-7 w-7 rounded-full flex items-center justify-center bg-teal-500/10 text-teal-600`}>
                                <div className="relative h-4 w-4">
                                  <Image src="https://appoostobio.com/uploads/block_images/ec56e1051238fbf784ff56698ec327aa.png" alt="Manora" fill className="object-contain rounded-full" />
                                </div>
                              </div>
                            ) : (
                              <div className={`h-7 w-7 rounded-full flex items-center justify-center bg-emerald-500/10 text-emerald-600`}>
                                <Banknote className="h-4 w-4" />
                              </div>
                            )}
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            {tx.type==='sell' ? (
                              <div className={`h-7 w-7 rounded-full flex items-center justify-center bg-emerald-500/10 text-emerald-600`}>
                                <Banknote className="h-4 w-4" />
                              </div>
                            ) : (
                              <div className={`h-7 w-7 rounded-full flex items-center justify-center bg-teal-500/10 text-teal-600`}>
                                <div className="relative h-4 w-4">
                                  <Image src="https://appoostobio.com/uploads/block_images/ec56e1051238fbf784ff56698ec327aa.png" alt="Manora" fill className="object-contain rounded-full" />
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className={
                            `h-7 w-7 rounded-full flex items-center justify-center ${
                              tx.type==='deposit' ? 'bg-green-500/10 text-green-600' :
                              tx.type==='withdraw' ? 'bg-blue-500/10 text-blue-600' :
                              'bg-emerald-500/10 text-emerald-600'
                            }`
                          }>
                            {tx.type==='deposit' && (<ArrowDownLeft className="h-4 w-4" />)}
                            {tx.type==='withdraw' && (<ArrowUpRight className="h-4 w-4" />)}
                          </div>
                        )}
                        <span className="text-xs text-muted-foreground">{timeFmt.format(new Date(tx.timestamp))}</span>
                      </div>
                      <div className="text-sm font-medium">
                        {tx.type==='buy' ? (
                          <span>
                            <span className="text-red-600">-{`$${tx.amount.toLocaleString()}`}</span>
                            <span> / </span>
                            <span className="text-green-600">+{`${tx.mnrAmount?.toLocaleString()} MNR`}</span>
                          </span>
                        ) : tx.type==='sell' ? (
                          <span>
                            <span className="text-green-600">+{`$${tx.amount.toLocaleString()}`}</span>
                            <span> / </span>
                            <span className="text-red-600">-{`${tx.mnrAmount?.toLocaleString()} MNR`}</span>
                          </span>
                        ) : (
                          <span className={tx.type==='deposit' ? 'text-green-600' : 'text-red-600'}>
                            {tx.type==='deposit' ? `+$${tx.amount.toLocaleString()}` : `-$${tx.amount.toLocaleString()}`}
                          </span>
                        )}
                      </div>
                    </div>
                    {expanded[tx.id] && (
                      <div className="mt-2 space-y-1">
                        <div className="font-mono text-xs break-all">{tx.id}</div>
                        <div className="text-sm truncate">{tx.from} → {tx.to}</div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ))}
          {totalItems === 0 && (
            <div className="text-sm text-muted-foreground">No fiat transactions.</div>
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
        <h3 className="text-lg font-semibold mb-3">Fiat Transactions</h3>
        <div className="space-y-2">
          {fiatTransactions.map(tx => (
            <div key={tx.id} className="p-3 rounded-lg border bg-card/50">
              <div className="flex items-center gap-2">
                {/* Type icon - first column */}
                <div className={
                  `h-7 w-7 rounded-full flex items-center justify-center shrink-0 ${
                    tx.type==='deposit' ? 'bg-green-500/10 text-green-600' :
                    tx.type==='withdraw' ? 'bg-blue-500/10 text-blue-600' :
                    tx.type==='buy' ? 'bg-emerald-500/10 text-emerald-600' :
                    'bg-amber-500/10 text-amber-600'
                  }`
                }>
                  {tx.type==='deposit' && (<ArrowDownLeft className="h-4 w-4" />)}
                  {tx.type==='withdraw' && (<ArrowUpRight className="h-4 w-4" />)}
                  {tx.type==='buy' && (<Coins className="h-4 w-4" />)}
                  {tx.type==='sell' && (<ArrowLeftRight className="h-4 w-4" />)}
                </div>
                <div className="font-mono text-sm truncate">{tx.id}</div>
              </div>
              <div className="mt-1 text-xs text-muted-foreground">{dateFmt.format(new Date(tx.timestamp))}</div>
              <div className="mt-1 text-sm truncate">{tx.from} → {tx.to}</div>
              <div className="mt-1 text-sm font-medium">${tx.amount.toLocaleString()}</div>
            </div>
          ))}
          {fiatTransactions.length === 0 && (
            <div className="text-sm text-muted-foreground">No fiat transactions.</div>
          )}
        </div>
      </Card>
    </>
  )
}


