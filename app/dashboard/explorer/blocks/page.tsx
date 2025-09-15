"use client"
import React from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Box, ArrowLeft, Search, ArrowUpDown, SlidersHorizontal, X } from "lucide-react"
import { useI18n } from "@/components/i18n-provider"
import { Input } from "@/components/ui/input"
import { explorerData, BlockItem } from "@/components/explorer/constants"
import BlockMobileRow from "@/components/explorer/lists/BlockMobileRow"
import BlockDetailPanel from "@/components/explorer/BlockDetailPanel"
import SortDialog from "@/components/explorer/SortDialog"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import FiltersDialog from "@/components/explorer/FiltersDialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationFirst,
  PaginationLast,
} from "@/components/ui/pagination"

function useBlocksData() {
  const [items, setItems] = React.useState<BlockItem[]>([])
  React.useEffect(() => { explorerData.getLatestBlocks().then(setItems) }, [])
  return items
}

export default function BlocksPage() {
  const { t } = useI18n()
  const router = useRouter()
  const [searchValue, setSearchValue] = React.useState("")
  const latestBlocks = useBlocksData()
  const [sortBy, setSortBy] = React.useState<string>("Newest First")
  const [showSort, setShowSort] = React.useState(false)
  const [showFilters, setShowFilters] = React.useState(false)
  const [filterFrom, setFilterFrom] = React.useState<string>("")
  const [filterTo, setFilterTo] = React.useState<string>("")
  const [filterMinTxs, setFilterMinTxs] = React.useState<string>("")
  const [page, setPage] = React.useState<number>(1)
  const [detailOpen, setDetailOpen] = React.useState(false)
  const [selectedHeight, setSelectedHeight] = React.useState<number | null>(null)
  const [pageSize, setPageSize] = React.useState<number>(10)

  const sortOptions = [
    "Newest First",
    "Oldest First",
    "Txs: High to Low",
    "Txs: Low to High",
  ]

  const displayedBlocks = React.useMemo(() => {
    const q = searchValue.trim().toLowerCase()
    let items = latestBlocks.filter(b => (q ? String(b.height).includes(q) : true))
    // Apply filters
    const fromNum = filterFrom ? parseInt(filterFrom, 10) : undefined
    const toNum = filterTo ? parseInt(filterTo, 10) : undefined
    const minTxsNum = filterMinTxs ? parseInt(filterMinTxs, 10) : undefined
    items = items.filter(b => {
      if (fromNum !== undefined && b.height < fromNum) return false
      if (toNum !== undefined && b.height > toNum) return false
      if (minTxsNum !== undefined && b.transactions < minTxsNum) return false
      return true
    })
    // Sort
    items = [...items].sort((a, b) => {
      switch (sortBy) {
        case "Oldest First":
          return a.height - b.height
        case "Txs: High to Low":
          return b.transactions - a.transactions
        case "Txs: Low to High":
          return a.transactions - b.transactions
        case "Newest First":
        default:
          return b.height - a.height
      }
    })
    return items
  }, [searchValue, sortBy, filterFrom, filterTo, filterMinTxs, latestBlocks])

  // Reset page when filters/search/sort change
  React.useEffect(() => { setPage(1) }, [searchValue, sortBy, filterFrom, filterTo, filterMinTxs])

  const totalItems = displayedBlocks.length
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
  const currentPage = Math.min(page, totalPages)
  const paginatedBlocks = React.useMemo(() =>
    displayedBlocks.slice((currentPage - 1) * pageSize, currentPage * pageSize)
  , [displayedBlocks, currentPage, pageSize])
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between -mt-2 sm:mt-0">
        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">{t('common.back', 'Back')}</span>
          </Button>
          <h2 className="text-xl sm:text-3xl font-semibold sm:font-bold tracking-tight">{t('explorer.latestBlocks')}</h2>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden sm:block relative w-[280px]">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('header.searchPlaceholder', 'Search...') as string}
              className="pl-8 pr-8"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
            {searchValue && (
              <button
                type="button"
                aria-label="Clear search"
                className="absolute right-2 top-2.5 p-1 rounded-full hover:bg-muted/60"
                onClick={() => setSearchValue("")}
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            )}
          </div>
          <Button variant="outline" size="icon" aria-label="Sort" onClick={() => setShowSort(true)}>
            <ArrowUpDown className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" aria-label="Filters" onClick={() => setShowFilters(true)}>
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Card className="p-0 sm:p-6 border-0 rounded-none bg-transparent sm:border sm:rounded-lg sm:bg-card">
        {/* Header (desktop) */}
        <div className="hidden sm:grid grid-cols-[1.2fr_1fr_0.6fr_0.6fr_0.6fr_0.8fr] px-3 py-2 text-xs uppercase text-muted-foreground">
          <span>{t('explorer.block')}</span>
          <span>{t('explorer.blockTime')}</span>
          <span>{t('explorer.txs')}</span>
          <span>Size</span>
          <span>Conf</span>
          <span>{t('explorer.validated')}</span>
        </div>

        {/* Rows */}
        <div className="space-y-2">
          {paginatedBlocks.map((block) => (
            <div key={block.height} className="p-3 rounded-lg border bg-card/50 cursor-pointer" onClick={() => { setSelectedHeight(block.height); setDetailOpen(true) }}>
              {/* Desktop grid row */}
              <div className="hidden sm:grid items-center grid-cols-[1.2fr_1fr_0.6fr_0.6fr_0.6fr_0.8fr] gap-2">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-500">
                    <Box className="h-5 w-5" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{t('explorer.block')} #{block.height}</span>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">{new Date(block.timestamp).toLocaleString()}</div>
                <div className="text-sm">{block.transactions}</div>
                <div className="text-sm">{block.size}</div>
                <div className="text-sm">{(latestBlocks[0]?.height ?? block.height) - block.height}</div>
                <div>
                  <Badge variant="secondary" className="bg-green-500/10 text-green-500">{t('explorer.validated')}</Badge>
                </div>
              </div>

              {/* Mobile stacked row */}
              <BlockMobileRow block={block} labels={{ block: t('explorer.block'), validated: t('explorer.validated'), txs: t('explorer.txs') }} />
            </div>
          ))}
        </div>
        {/* Pagination controls */}
        <div className="flex items-center justify-between gap-3 pt-4 flex-wrap">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Select value={String(pageSize)} onValueChange={(v) => setPageSize(Number(v))}>
              <SelectTrigger className="w-[90px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[5, 10, 20, 50].map((n) => (
                  <SelectItem key={n} value={String(n)}>{n}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="hidden sm:inline">{(currentPage - 1) * pageSize + 1}-{Math.min(currentPage * pageSize, totalItems)} {t('common.of')} {totalItems}</span>
          </div>

          <Pagination className="w-auto ml-auto">
            <PaginationContent>
              <PaginationItem>
                <PaginationFirst href="#" onClick={(e) => { e.preventDefault(); setPage(1) }} />
              </PaginationItem>
              <PaginationItem>
                <PaginationPrevious onClick={(e) => { e.preventDefault(); setPage((p) => Math.max(1, p - 1)) }} href="#" />
              </PaginationItem>
              {/* Simplified pages */}
              <PaginationItem>
                <PaginationLink href="#" onClick={(e) => { e.preventDefault(); setPage(1) }} isActive={currentPage === 1}>1</PaginationLink>
              </PaginationItem>
              {currentPage > 2 && totalPages > 3 && (
                <PaginationItem>
                  <span className="px-2 text-muted-foreground">…</span>
                </PaginationItem>
              )}
              {totalPages > 1 && (
                <PaginationItem>
                  <PaginationLink href="#" isActive={currentPage !== 1 && currentPage !== totalPages} onClick={(e) => e.preventDefault()}>{currentPage !== 1 && currentPage !== totalPages ? currentPage : Math.min(2, totalPages)}</PaginationLink>
                </PaginationItem>
              )}
              {currentPage < totalPages - 1 && totalPages > 3 && (
                <PaginationItem>
                  <span className="px-2 text-muted-foreground">…</span>
                </PaginationItem>
              )}
              {totalPages > 1 && (
                <PaginationItem>
                  <PaginationLink href="#" onClick={(e) => { e.preventDefault(); setPage(totalPages) }} isActive={currentPage === totalPages}>{totalPages}</PaginationLink>
                </PaginationItem>
              )}
              <PaginationItem>
                <PaginationNext onClick={(e) => { e.preventDefault(); setPage((p) => Math.min(totalPages, p + 1)) }} href="#" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLast href="#" onClick={(e) => { e.preventDefault(); setPage(totalPages) }} />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </Card>

      {/* Sort dialog */}
      <SortDialog
        open={showSort}
        onOpenChange={setShowSort}
        sortBy={sortBy}
        setSortBy={setSortBy}
        options={sortOptions}
      />

      {/* Filters dialog (responsive via component) */}
      <FiltersDialog open={showFilters} onOpenChange={setShowFilters} showDefaultFooter={false}>
        <div className="grid gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <div className="text-xs text-muted-foreground mb-1">From block</div>
              <Input inputMode="numeric" placeholder="e.g. 1458900" value={filterFrom} onChange={(e) => setFilterFrom(e.target.value.replace(/[^0-9]/g, ''))} />
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">To block</div>
              <Input inputMode="numeric" placeholder="e.g. 1458925" value={filterTo} onChange={(e) => setFilterTo(e.target.value.replace(/[^0-9]/g, ''))} />
            </div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-1">Min txs</div>
            <Input inputMode="numeric" placeholder="e.g. 100" value={filterMinTxs} onChange={(e) => setFilterMinTxs(e.target.value.replace(/[^0-9]/g, ''))} />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => { setFilterFrom(""); setFilterTo(""); setFilterMinTxs("") }}>Reset</Button>
            <Button onClick={() => setShowFilters(false)}>Apply</Button>
          </div>
        </div>
      </FiltersDialog>

      {/* Block detail panel (responsive) */}
      <BlockDetailPanel open={detailOpen} onOpenChange={setDetailOpen} height={selectedHeight ?? undefined} />
    </div>
  )
}


