"use client"
import React from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, ArrowLeft, ArrowUpDown, SlidersHorizontal, X } from "lucide-react"
import { useI18n } from "@/components/i18n-provider"
import { Input } from "@/components/ui/input"
import SortDialog from "@/components/explorer/SortDialog"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import FiltersDialog from "@/components/explorer/FiltersDialog"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import {
  Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, PaginationFirst, PaginationLast,
} from "@/components/ui/pagination"
import { explorerData, ExplorerTx } from "@/components/explorer/constants"
import TransactionMobileRow from "@/components/explorer/lists/TransactionMobileRow"

function useTxData() {
  const [items, setItems] = React.useState<ExplorerTx[]>([])
  React.useEffect(() => { explorerData.getTransactions().then(setItems) }, [])
  return items
}

export default function TransactionsPage() {
  const { t } = useI18n()
  const router = useRouter()
  const [searchValue, setSearchValue] = React.useState("")
  const [sortBy, setSortBy] = React.useState<string>("Newest First")
  const [showSort, setShowSort] = React.useState(false)
  const [showFilters, setShowFilters] = React.useState(false)
  const [status, setStatus] = React.useState<string>('any')
  const [type, setType] = React.useState<string>('any')
  const [page, setPage] = React.useState<number>(1)
  const [pageSize, setPageSize] = React.useState<number>(10)
  const [showBar, setShowBar] = React.useState<boolean>(true)
  const txs = useTxData()

  const sortOptions = ["Newest First", "Oldest First", "Value: High to Low", "Value: Low to High"]

  const filtered = React.useMemo(() => {
    const q = searchValue.trim().toLowerCase()
    let items = txs.filter(tx =>
      (q ? tx.id.toLowerCase().includes(q) || tx.from.toLowerCase().includes(q) || tx.to.toLowerCase().includes(q) : true)
      && (status === 'any' ? true : tx.status === status)
      && (type === 'any' ? true : tx.type === type)
    )
    items = [...items].sort((a, b) => {
      switch (sortBy) {
        case "Oldest First":
          return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        case "Value: High to Low":
          return (parseFloat(b.value.replace(/[^0-9.]/g, '')) || 0) - (parseFloat(a.value.replace(/[^0-9.]/g, '')) || 0)
        case "Value: Low to High":
          return (parseFloat(a.value.replace(/[^0-9.]/g, '')) || 0) - (parseFloat(b.value.replace(/[^0-9.]/g, '')) || 0)
        case "Newest First":
        default:
          return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      }
    })
    return items
  }, [txs, searchValue, status, type, sortBy])

  React.useEffect(() => { setPage(1) }, [searchValue, status, type, sortBy])

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

  const totalItems = filtered.length
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
  const currentPage = Math.min(page, totalPages)
  const paginated = React.useMemo(() => filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize), [filtered, currentPage, pageSize])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between -mt-2 sm:mt-0">
        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">{t('common.back')}</span>
          </Button>
          <h2 className="text-xl sm:text-3xl font-semibold sm:font-bold tracking-tight">{t('explorer.recentTransactions')}</h2>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden sm:block relative w-[280px]">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder={t('header.searchPlaceholder')} className="pl-8 pr-8" value={searchValue} onChange={(e) => setSearchValue(e.target.value)} />
            {searchValue && (
              <button type="button" aria-label="Clear search" className="absolute right-2 top-2.5 p-1 rounded-full hover:bg-muted/60" onClick={() => setSearchValue("")}>
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            )}
          </div>
          <Button variant="outline" size="icon" aria-label="Sort" onClick={() => setShowSort(true)}><ArrowUpDown className="h-4 w-4" /></Button>
          <Button variant="outline" size="icon" aria-label="Filters" onClick={() => setShowFilters(true)}><SlidersHorizontal className="h-4 w-4" /></Button>
        </div>
      </div>

      <Card className="p-0 sm:p-6 border-0 rounded-none bg-transparent sm:border sm:rounded-lg sm:bg-card">
        <div className="hidden sm:grid grid-cols-[1.2fr_1fr_1fr_1fr_0.8fr_0.7fr_0.6fr_0.7fr] px-3 py-2 text-xs uppercase text-muted-foreground">
          <span>Tx</span>
          <span>Time</span>
          <span>{t('explorer.from')}</span>
          <span>{t('explorer.to')}</span>
          <span>{t('explorer.method')}</span>
          <span>Value</span>
          <span>{t('explorer.fee')}</span>
          <span>Status</span>
        </div>
        <div className="space-y-2">
          {paginated.map((tx) => (
            <div key={tx.id} className="p-3 rounded-lg border bg-card/50">
              <div className="hidden sm:grid items-center grid-cols-[1.2fr_1fr_1fr_1fr_0.8fr_0.7fr_0.6fr_0.7fr] gap-2">
                <div className="font-mono text-sm truncate">{tx.id}</div>
                <div className="text-sm text-muted-foreground">{new Date(tx.timestamp).toLocaleString()}</div>
                <div className="text-sm truncate">{tx.from}</div>
                <div className="text-sm truncate">{tx.to}</div>
                <div className="text-sm">{tx.method ?? '—'}</div>
                <div className="text-sm">{tx.value}</div>
                <div className="text-sm">{tx.fee ?? '—'}</div>
                <div>
                  <Badge variant="secondary" className={tx.status === 'success' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}>
                    {tx.status === 'success' ? 'Success' : 'Failed'}
                  </Badge>
                </div>
              </div>
              <TransactionMobileRow tx={tx} labels={{ from: t('explorer.from'), to: t('explorer.to') }} />
            </div>
          ))}
        </div>
        <div className={`flex items-center justify-between gap-2 pt-2 sm:pt-3 sm:flex-wrap whitespace-nowrap fixed inset-x-0 bottom-20 z-30 border-t bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/60 px-3 sm:px-0 sm:static transform transition-transform duration-200 ${showBar ? 'translate-y-0' : 'translate-y-full'} sm:translate-y-0`}>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Select value={String(pageSize)} onValueChange={(v) => setPageSize(Number(v))}>
              <SelectTrigger className="w-[72px] h-9"><SelectValue /></SelectTrigger>
              <SelectContent>{[5,10,20,50].map(n => (<SelectItem key={n} value={String(n)}>{n}</SelectItem>))}</SelectContent>
            </Select>
            <span className="hidden sm:inline">{(currentPage - 1) * pageSize + 1}-{Math.min(currentPage * pageSize, totalItems)} {t('common.of')} {totalItems}</span>
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

      <SortDialog open={showSort} onOpenChange={setShowSort} sortBy={sortBy} setSortBy={setSortBy} options={sortOptions} />
      <FiltersDialog open={showFilters} onOpenChange={setShowFilters} showDefaultFooter={false}>
        <div className="grid gap-4">
          <div>
            <div className="text-xs text-muted-foreground mb-1">Status</div>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger><SelectValue placeholder="Any" /></SelectTrigger>
              <SelectContent><SelectItem value="any">Any</SelectItem><SelectItem value="success">Success</SelectItem><SelectItem value="failed">Failed</SelectItem></SelectContent>
            </Select>
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-1">Type</div>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger><SelectValue placeholder="Any" /></SelectTrigger>
              <SelectContent><SelectItem value="any">Any</SelectItem><SelectItem value="mint">mint</SelectItem><SelectItem value="transfer">transfer</SelectItem><SelectItem value="burn">burn</SelectItem></SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={()=>{setStatus('any'); setType('any')}}>Reset</Button>
            <Button onClick={()=>setShowFilters(false)}>Apply</Button>
          </div>
        </div>
      </FiltersDialog>
    </div>
  )
}


