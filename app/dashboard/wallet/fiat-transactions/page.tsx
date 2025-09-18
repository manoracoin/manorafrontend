"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import { ArrowDownLeft, ArrowUpRight, Banknote, ChevronRight, SlidersHorizontal, ArrowUpDown } from "lucide-react"
import { Pagination, PaginationContent, PaginationFirst, PaginationItem, PaginationLast, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { SORT_OPTIONS } from "@/components/explorer/constants"
import BottomSheet from "@/components/ui/BottomSheet"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"

import { fiatTransactions } from "@/components/wallet/fiatData"

export default function FiatTransactionsPage() {
  const router = useRouter()
  const [types, setTypes] = React.useState<Array<'deposit'|'withdraw'|'buy'|'sell'>>([])
  const [page, setPage] = React.useState<number>(1)
  const [pageSize, setPageSize] = React.useState<number>(10)
  const [showBar, setShowBar] = React.useState<boolean>(true)
  const [isFiltersOpen, setIsFiltersOpen] = React.useState<boolean>(false)
  const [showSortDialog, setShowSortDialog] = React.useState<boolean>(false)
  const [sortBy, setSortBy] = React.useState<string>(SORT_OPTIONS[0])
  const [isDesktop, setIsDesktop] = React.useState<boolean>(false)
  const [expanded, setExpanded] = React.useState<Record<string, boolean>>({})

  React.useEffect(() => {
    const mql = window.matchMedia('(min-width: 640px)')
    const listener = (e: MediaQueryListEvent) => setIsDesktop(e.matches)
    setIsDesktop(mql.matches)
    mql.addEventListener ? mql.addEventListener('change', listener) : mql.addListener(listener)
    return () => { mql.removeEventListener ? mql.removeEventListener('change', listener) : mql.removeListener(listener) }
  }, [])

  const filtered = React.useMemo(() => {
    return fiatTransactions.filter(tx =>
      (types.length === 0 ? true : types.includes(tx.type as any))
    )
  }, [types])

  const toggleType = (value: 'deposit'|'withdraw'|'buy'|'sell') => {
    setTypes(prev => prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value])
  }

  const sorted = React.useMemo(() => {
    const arr = [...filtered]
    switch (sortBy) {
      case 'Oldest First':
        return arr.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
      case 'Value: High to Low':
        return arr.sort((a, b) => b.amount - a.amount)
      case 'Value: Low to High':
        return arr.sort((a, b) => a.amount - b.amount)
      default:
        return arr.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    }
  }, [filtered, sortBy])

  React.useEffect(() => { setPage(1) }, [types, pageSize, sortBy])

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

  const totalItems = sorted.length
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
  const currentPage = Math.min(page, totalPages)
  const paginated = React.useMemo(() => sorted.slice((currentPage - 1) * pageSize, currentPage * pageSize), [sorted, currentPage, pageSize])

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

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Back</span>
          </Button>
          <h2 className="text-xl sm:text-3xl font-semibold sm:font-bold tracking-tight">Fiat Transactions</h2>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" aria-label="Sort" onClick={() => setShowSortDialog(true)}>
            <ArrowUpDown className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" aria-label="Filters" onClick={() => setIsFiltersOpen(true)}>
            <SlidersHorizontal className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <Card className="p-0 sm:p-6 border-0 rounded-none bg-transparent sm:border sm:rounded-lg sm:bg-card">
        <div className="space-y-3">
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
                  <div className="hidden sm:grid items-center grid-cols-[0.5fr_1.2fr_1fr_1fr_1fr_0.7fr] gap-2">
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
                    <div className="font-mono text-sm truncate">{tx.id}</div>
                    <div className="text-sm text-muted-foreground">{timeFmt.format(new Date(tx.timestamp))}</div>
                    <div className="text-sm truncate">{tx.from}</div>
                    <div className="text-sm truncate">{tx.to}</div>
                    <div className="text-sm">
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
          {sorted.length === 0 && (
            <div className="text-sm text-muted-foreground">No fiat transactions.</div>
          )}
        </div>
        <div className={`flex items-center justify-between gap-2 pt-2 sm:pt-3 sm:flex-wrap whitespace-nowrap fixed inset-x-0 bottom-20 z-30 border-t bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/60 px-3 sm:px-0 sm:static transform transition-transform duration-200 ${showBar ? 'translate-y-0' : 'translate-y-full'} sm:translate-y-0`}>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Select value={String(pageSize)} onValueChange={(v)=>setPageSize(Number(v))}>
              <SelectTrigger className="w-[72px] h-9"><SelectValue /></SelectTrigger>
              <SelectContent>{[5,10,20,50].map(n => (<SelectItem key={n} value={String(n)}>{n}</SelectItem>))}</SelectContent>
            </Select>
            <span className="hidden sm:inline">{(currentPage - 1) * pageSize + 1}-{Math.min(currentPage * pageSize, totalItems)} of {totalItems}</span>
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
      </Card>

      {/* Filters: BottomSheet on mobile, Drawer (Sheet) on desktop */}
      {isDesktop ? (
        <Sheet open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
          <SheetContent side="right" className="sm:max-w-md w-[90vw] p-0 flex flex-col">
            <SheetHeader className="px-4 pt-4">
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            <div className="min-h-0 overflow-y-auto px-4 pb-4">
              <div className="space-y-3">
                <div>
                  <div className="text-xs mb-1 text-muted-foreground">Type</div>
                  <div className="space-y-2">
                    {(['deposit','withdraw','buy','sell'] as const).map(opt => (
                      <label key={opt} className="flex items-center gap-3">
                        <Checkbox checked={types.includes(opt)} onCheckedChange={() => toggleType(opt)} />
                        <span className="text-sm capitalize">{opt === 'buy' ? 'Buy MNR' : opt === 'sell' ? 'Sell MNR' : opt}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      ) : (
        <BottomSheet open={isFiltersOpen} onOpenChange={setIsFiltersOpen} title="Filters">
          <div className="space-y-3">
            <div>
              <div className="text-xs mb-1 text-muted-foreground">Type</div>
              <div className="space-y-2">
                {(['deposit','withdraw','buy','sell'] as const).map(opt => (
                  <label key={opt} className="flex items-center gap-3">
                    <Checkbox checked={types.includes(opt)} onCheckedChange={() => toggleType(opt)} />
                    <span className="text-sm capitalize">{opt === 'buy' ? 'Buy MNR' : opt === 'sell' ? 'Sell MNR' : opt}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </BottomSheet>
      )}

      {/* Sort: BottomSheet on mobile, Drawer (Sheet) on desktop */}
      {isDesktop ? (
        <Sheet open={showSortDialog} onOpenChange={setShowSortDialog}>
          <SheetContent side="right" className="sm:max-w-md w-[90vw] p-0 flex flex-col">
            <SheetHeader className="px-4 pt-4">
              <SheetTitle>Sort</SheetTitle>
            </SheetHeader>
            <div className="min-h-0 overflow-y-auto px-4 pb-4">
              <RadioGroup value={sortBy} onValueChange={setSortBy} className="gap-3">
                {SORT_OPTIONS.map((option) => (
                  <label key={option} className="flex items-center gap-3 py-1">
                    <RadioGroupItem value={option} />
                    <span className="text-sm">{option}</span>
                  </label>
                ))}
              </RadioGroup>
            </div>
          </SheetContent>
        </Sheet>
      ) : (
        <BottomSheet open={showSortDialog} onOpenChange={setShowSortDialog} title="Sort">
          <RadioGroup value={sortBy} onValueChange={setSortBy} className="gap-3">
            {SORT_OPTIONS.map((option) => (
              <label key={option} className="flex items-center gap-3 py-1">
                <RadioGroupItem value={option} />
                <span className="text-sm">{option}</span>
              </label>
            ))}
          </RadioGroup>
        </BottomSheet>
      )}
    </div>
  )
}


