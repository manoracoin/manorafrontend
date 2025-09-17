"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Pagination, PaginationContent, PaginationFirst, PaginationItem, PaginationLast, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"

type FiatTx = {
  id: string
  type: 'deposit' | 'withdraw' | 'buy'
  amount: number
  currency: 'USD'
  from: string
  to: string
  timestamp: string
  status: 'success' | 'failed'
}

const fiatTransactions: FiatTx[] = [
  { id: 'ftx_1001', type: 'deposit', amount: 1250, currency: 'USD', from: 'Bank ****3421', to: 'Your Fiat Wallet', timestamp: '2024-03-20T10:30:00', status: 'success' },
  { id: 'ftx_1002', type: 'withdraw', amount: 750, currency: 'USD', from: 'Your Fiat Wallet', to: 'Bank ****3421', timestamp: '2024-03-19T15:45:00', status: 'success' },
  { id: 'ftx_1003', type: 'deposit', amount: 2000, currency: 'USD', from: 'Bank ****9981', to: 'Your Fiat Wallet', timestamp: '2024-03-18T09:15:00', status: 'success' },
  { id: 'ftx_1004', type: 'buy', amount: 500, currency: 'USD', from: 'Your Fiat Wallet', to: 'Buy MNR (200 MNR)', timestamp: '2024-03-17T12:00:00', status: 'success' },
  { id: 'ftx_1005', type: 'withdraw', amount: 320, currency: 'USD', from: 'Your Fiat Wallet', to: 'Bank ****3421', timestamp: '2024-03-16T16:20:00', status: 'success' },
  { id: 'ftx_1006', type: 'deposit', amount: 980, currency: 'USD', from: 'Bank ****9981', to: 'Your Fiat Wallet', timestamp: '2024-03-15T11:05:00', status: 'success' },
  { id: 'ftx_1007', type: 'buy', amount: 260, currency: 'USD', from: 'Your Fiat Wallet', to: 'Buy MNR (104 MNR)', timestamp: '2024-03-14T13:50:00', status: 'success' },
  { id: 'ftx_1008', type: 'withdraw', amount: 120, currency: 'USD', from: 'Your Fiat Wallet', to: 'Bank ****3421', timestamp: '2024-03-13T08:40:00', status: 'success' },
  { id: 'ftx_1009', type: 'deposit', amount: 450, currency: 'USD', from: 'Bank ****3421', to: 'Your Fiat Wallet', timestamp: '2024-03-12T18:25:00', status: 'success' },
  { id: 'ftx_1010', type: 'buy', amount: 800, currency: 'USD', from: 'Your Fiat Wallet', to: 'Buy MNR (320 MNR)', timestamp: '2024-03-11T10:10:00', status: 'success' },
  { id: 'ftx_1011', type: 'withdraw', amount: 210, currency: 'USD', from: 'Your Fiat Wallet', to: 'Bank ****9981', timestamp: '2024-03-10T12:30:00', status: 'success' },
  { id: 'ftx_1012', type: 'deposit', amount: 700, currency: 'USD', from: 'Bank ****3421', to: 'Your Fiat Wallet', timestamp: '2024-03-09T09:00:00', status: 'success' },
  { id: 'ftx_1013', type: 'buy', amount: 150, currency: 'USD', from: 'Your Fiat Wallet', to: 'Buy MNR (60 MNR)', timestamp: '2024-03-08T14:45:00', status: 'success' },
  { id: 'ftx_1014', type: 'withdraw', amount: 430, currency: 'USD', from: 'Your Fiat Wallet', to: 'Bank ****3421', timestamp: '2024-03-07T17:05:00', status: 'success' },
  { id: 'ftx_1015', type: 'deposit', amount: 1600, currency: 'USD', from: 'Bank ****9981', to: 'Your Fiat Wallet', timestamp: '2024-03-06T07:55:00', status: 'success' },
  { id: 'ftx_1016', type: 'buy', amount: 350, currency: 'USD', from: 'Your Fiat Wallet', to: 'Buy MNR (140 MNR)', timestamp: '2024-03-05T19:35:00', status: 'success' },
]

export default function FiatTransactionsPage() {
  const router = useRouter()
  const [searchValue, setSearchValue] = React.useState("")
  const [type, setType] = React.useState<string>('all')
  const [page, setPage] = React.useState<number>(1)
  const [pageSize, setPageSize] = React.useState<number>(10)
  const [showBar, setShowBar] = React.useState<boolean>(true)

  const filtered = React.useMemo(() => {
    const q = searchValue.trim().toLowerCase()
    return fiatTransactions.filter(tx =>
      (type === 'all' ? true : tx.type === (type as any)) &&
      (q ? tx.id.toLowerCase().includes(q) || tx.from.toLowerCase().includes(q) || tx.to.toLowerCase().includes(q) : true)
    )
  }, [searchValue, type])

  React.useEffect(() => { setPage(1) }, [searchValue, type, pageSize])

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
      <div className="flex items-center gap-3 justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Back</span>
          </Button>
          <h2 className="text-xl sm:text-3xl font-semibold sm:font-bold tracking-tight">Fiat Transactions</h2>
        </div>
        <div className="hidden sm:flex items-center gap-2">
          <div className="relative w-[260px]">
            <Input placeholder="Search..." className="pl-3 pr-3" value={searchValue} onChange={(e)=>setSearchValue(e.target.value)} />
          </div>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger className="w-[140px]"><SelectValue placeholder="Type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              <SelectItem value="deposit">Deposit</SelectItem>
              <SelectItem value="withdraw">Withdraw</SelectItem>
              <SelectItem value="buy">Buy MNR</SelectItem>
              <SelectItem value="sell">Sell MNR</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className="p-0 sm:p-6 border-0 rounded-none bg-transparent sm:border sm:rounded-lg sm:bg-card">
        <div className="hidden sm:grid grid-cols-[1.2fr_1fr_1fr_1fr_0.8fr_0.7fr] px-3 py-2 text-xs uppercase text-muted-foreground">
          <span>Tx</span>
          <span>Time</span>
          <span>From</span>
          <span>To</span>
          <span>Type</span>
          <span>Amount</span>
        </div>
        <div className="space-y-2">
          {paginated.map((tx) => (
            <div key={tx.id} className="p-3 rounded-lg border bg-card/50">
              <div className="hidden sm:grid items-center grid-cols-[1.2fr_1fr_1fr_1fr_0.8fr_0.7fr] gap-2">
                <div className="font-mono text-sm truncate">{tx.id}</div>
                <div className="text-sm text-muted-foreground">{new Date(tx.timestamp).toLocaleString()}</div>
                <div className="text-sm truncate">{tx.from}</div>
                <div className="text-sm truncate">{tx.to}</div>
                <div className="text-sm">
                  <Badge variant="secondary" className={tx.type==='deposit'?'bg-green-500/10 text-green-600':tx.type==='withdraw'?'bg-blue-500/10 text-blue-600':tx.type==='buy'?'bg-emerald-500/10 text-emerald-600':'bg-amber-500/10 text-amber-600'}>
                    {tx.type}
                  </Badge>
                </div>
                <div className="text-sm">${tx.amount.toLocaleString()}</div>
              </div>
              <div className="sm:hidden">
                <div className="flex items-center justify-between">
                  <div className="font-mono text-sm">{tx.id}</div>
                  <Badge variant="secondary" className={tx.type==='deposit'?'bg-green-500/10 text-green-600':tx.type==='withdraw'?'bg-blue-500/10 text-blue-600':tx.type==='buy'?'bg-emerald-500/10 text-emerald-600':'bg-amber-500/10 text-amber-600'}>
                    {tx.type}
                  </Badge>
                </div>
                <div className="mt-1 text-xs text-muted-foreground">{new Date(tx.timestamp).toLocaleString()}</div>
                <div className="mt-1 text-sm truncate">{tx.from} → {tx.to}</div>
                <div className="mt-1 text-sm font-medium">${tx.amount.toLocaleString()}</div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
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
    </div>
  )
}


