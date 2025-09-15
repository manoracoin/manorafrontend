"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import FormDialog from "@/components/common/FormDialog"
import { Search, Vote, FileText, Users, Calendar, AlertCircle, ArrowUpDown, SlidersHorizontal, BarChart3, X, Box, FileCode, ArrowDownLeft, ArrowUpRight, XCircle, Activity, Coins } from "lucide-react"
import Link from "next/link"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, PaginationFirst, PaginationLast } from "@/components/ui/pagination"
import SortDialog from "@/components/explorer/SortDialog"
import ExplorerHeader from "@/components/explorer/ExplorerHeader"
import FiltersDialog from "@/components/explorer/FiltersDialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import FiltersPanel from "@/components/explorer/FiltersPanel"
// TransactionsList no longer used; inline table below
import ProposalsList from "@/components/explorer/ProposalsList"
import { useI18n } from "@/components/i18n-provider"
import LatestBlockCard from "@/components/explorer/cards/LatestBlockCard"
import TokenMetricsCard from "@/components/explorer/cards/TokenMetricsCard"
import SmartContractsSummaryCard from "@/components/explorer/cards/SmartContractsSummaryCard"
import NetworkHealthCard from "@/components/explorer/cards/NetworkHealthCard"
import TopValidatorsList from "@/components/explorer/TopValidatorsList"
import TransactionRow from "@/components/explorer/TransactionRow"
import BlocksList from "@/components/explorer/lists/BlocksList"
import ContractsList from "@/components/explorer/lists/ContractsList"

import {
  EXPLORER_TRANSACTIONS as transactions,
  LATEST_BLOCKS as latestBlocks,
  ACTIVE_SMART_CONTRACTS as activeSmartContracts,
  KPIS as kpis,
  NETWORK_HEALTH as networkHealth,
  TOKEN_METRICS as tokenMetrics,
  TOP_VALIDATORS as topValidators,
  PROPOSALS as proposals,
  CONTRACTS as contracts,
  TRANSACTION_TYPES as transactionTypes,
  TRANSACTION_STATUS as transactionStatus,
  PROPOSAL_STATUS as proposalStatus,
  SORT_OPTIONS as sortOptions,
} from "@/components/explorer/constants"

export default function ExplorerPage() {
  const { t } = useI18n()
  const searchParams = useSearchParams()
  const [mounted, setMounted] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedContract, setSelectedContract] = useState("All Contracts")
  const [selectedTxType, setSelectedTxType] = useState("All Types")
  const [selectedTxStatus, setSelectedTxStatus] = useState("All Status")
  const [selectedProposalStatus, setSelectedProposalStatus] = useState("All Status")
  const [sortBy, setSortBy] = useState("Newest First")
  const [dateRange, setDateRange] = useState("all")
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)
  const [showSortDialog, setShowSortDialog] = useState(false)
  const [showMobileSearch, setShowMobileSearch] = useState(false)
  const [tabValue, setTabValue] = useState<'transactions'>('transactions')
  const [showCreateProposalDialog, setShowCreateProposalDialog] = useState(false)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [proposalFormData, setProposalFormData] = useState({
    title: "",
    description: "",
    contract: "",
    endTime: "",
    quorum: ""
  })
  const [showBlocksDialog, setShowBlocksDialog] = useState(false)
  const [showContractsDialog, setShowContractsDialog] = useState(false)
  const [quickTx, setQuickTx] = useState("")
  const [quickBlock, setQuickBlock] = useState("")
  const [quickAddress, setQuickAddress] = useState("")

  useEffect(() => {
    setMounted(true)
  }, [])

  // Governance moved to Wallet: force transactions tab regardless of query
  useEffect(() => {
    setTabValue('transactions')
  }, [])

  // Reset pagina quando cambiano filtri o ricerca (deve stare prima di qualsiasi return)
  useEffect(() => {
    setPage(1)
  }, [searchTerm, selectedContract, selectedTxType, selectedTxStatus])

  if (!mounted) {
    return null
  }

  // Simple health computation for the Network Health badge
  const healthStatus = (() => {
    const blockSeconds = parseFloat(String(networkHealth.blockTime).replace(/[^0-9.]/g, ''))
    const pending = Number(networkHealth.pendingTxs)
    const healthy = (!isNaN(blockSeconds) ? blockSeconds <= 15 : true) && pending < 20000
    return healthy
      ? { label: 'Live', className: 'bg-green-500' }
      : { label: 'Degraded', className: 'bg-yellow-500 text-black' }
  })()

  const filteredTransactions = transactions.filter(tx => {
    const matchesSearch = tx.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tx.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tx.to.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesContract = selectedContract === "All Contracts" || tx.contract === selectedContract
    const matchesType = selectedTxType === "All Types" || tx.type === selectedTxType
    const matchesStatus = selectedTxStatus === "All Status" || tx.status === selectedTxStatus

    return matchesSearch && matchesContract && matchesType && matchesStatus
  })

  const totalItems = filteredTransactions.length
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
  const currentPage = Math.min(page, totalPages)
  const paginatedTransactions = filteredTransactions.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const filteredProposals = proposals.filter(proposal => {
    const matchesSearch = proposal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         proposal.description.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesContract = selectedContract === "All Contracts" || proposal.contract === selectedContract
    const matchesStatus = selectedProposalStatus === "All Status" || proposal.status === selectedProposalStatus

    return matchesSearch && matchesContract && matchesStatus
  })

  const resetFilters = () => {
    setSelectedContract("All Contracts")
    setSelectedTxType("All Types")
    setSelectedTxStatus("All Status")
    setSelectedProposalStatus("All Status")
    setDateRange("all")
    setSortBy("Newest First")
  }

  const handleCreateProposal = () => {
    // In a real app, this would submit the proposal to the blockchain
    console.log("Creating proposal:", proposalFormData)
    setShowCreateProposalDialog(false)
    setProposalFormData({
      title: "",
      description: "",
      contract: "",
      endTime: "",
      quorum: ""
    })
  }

  const hasActiveFilters = selectedContract !== "All Contracts" ||
                          selectedTxType !== "All Types" ||
                          selectedTxStatus !== "All Status" ||
                          selectedProposalStatus !== "All Status" ||
                          dateRange !== "all"

  return (
    <div className="space-y-6 min-w-0 max-w-full overflow-x-hidden">
      <ExplorerHeader
        onFiltersClick={() => setIsFiltersOpen((v) => !v)}
        onSortClick={() => setShowSortDialog(true)}
        onSearchClick={() => setShowMobileSearch((v) => !v)}
        searchOpen={showMobileSearch}
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        onSearchReset={() => setSearchTerm("")}
        onSearchSubmit={() => {/* search already applies via state; keep for UX parity */}}
        activeFiltersCount={[selectedContract !== "All Contracts", selectedTxType !== "All Types", selectedTxStatus !== "All Status", selectedProposalStatus !== "All Status"].filter(Boolean).length}
        sortActive={sortBy !== "Newest First"}
        activeTab={tabValue}
        onChangeTab={() => setTabValue('transactions')}
      />

      {tabValue === 'transactions' && (
        <div className="flex gap-3 overflow-x-auto overflow-y-hidden snap-x snap-mandatory sm:grid sm:gap-4 sm:grid-cols-2 lg:grid-cols-4 sm:overflow-x-hidden sm:snap-none">
          <LatestBlockCard label={t('explorer.kpi.latestBlock')} value={kpis.latestBlock} />
          <TokenMetricsCard title="MANORA Token" priceLabel="Price" supplyLabel="Total Supply" price={tokenMetrics.price} totalSupply={tokenMetrics.totalSupply} />
          <SmartContractsSummaryCard title="Smart Contracts" activeLabel="Active" verifiedLabel="Verified" activeCount={activeSmartContracts.length} verifiedCount={activeSmartContracts.filter(c => c.verified).length} />
          <NetworkHealthCard
            title={t('explorer.networkHealth')}
            statusBadge={healthStatus}
            blockTimeLabel={t('explorer.blockTime')}
            pendingTxsLabel={t('explorer.pendingTxs')}
            difficultyLabel={t('explorer.networkDifficulty')}
            hashRateLabel={t('explorer.hashRate')}
            blockTime={networkHealth.blockTime}
            pendingTxs={networkHealth.pendingTxs}
            difficulty={networkHealth.difficulty}
            hashRate={networkHealth.hashRate}
          />
          {/* Mobile-only: Top Validators moved into top carousel */}
          <Card className="p-6 bg-gradient-to-br from-amber-500 to-amber-600 text-white border-none w-full min-w-full snap-start sm:hidden">
            <TopValidatorsList title={t('explorer.topValidators')} validators={topValidators} />
          </Card>
        </div>
      )}


      <Card className="p-0 sm:p-6 w-full border-none rounded-none bg-transparent shadow-none sm:border sm:rounded-lg sm:bg-card">
        <Tabs value={tabValue} onValueChange={() => setTabValue('transactions')} className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            {/* Left spacer kept for layout symmetry; toggle moved to header */}
            <div className="w-full sm:w-auto" />
          </div>

          {/* Mobile: extra icon set removed (keep header icons only) */}

          {/* Desktop filters panel; hidden trigger because top bar controls it */}
          <FiltersPanel
            isOpen={isFiltersOpen}
            onOpenChange={setIsFiltersOpen}
            hasActiveFilters={hasActiveFilters}
            onReset={resetFilters}
            hideTrigger
            hideReset
            hideHeader
            contracts={contracts}
            transactionTypes={transactionTypes}
            transactionStatus={transactionStatus}
            proposalStatus={proposalStatus}
            selectedContract={selectedContract}
            setSelectedContract={setSelectedContract}
            selectedTxType={selectedTxType}
            setSelectedTxType={setSelectedTxType}
            selectedTxStatus={selectedTxStatus}
            setSelectedTxStatus={setSelectedTxStatus}
            selectedProposalStatus={selectedProposalStatus}
            setSelectedProposalStatus={setSelectedProposalStatus}
            dateRange={dateRange}
            setDateRange={setDateRange}
          />

          {/* Mobile: open filters inside dialog with the same content */}
          <div className="sm:hidden">
            <FiltersDialog open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
              <FiltersPanel
                isOpen
                onOpenChange={() => {}}
                hasActiveFilters={hasActiveFilters}
                onReset={resetFilters}
                hideTrigger
                forceSingleColumn
                contracts={contracts}
                transactionTypes={transactionTypes}
                transactionStatus={transactionStatus}
                proposalStatus={proposalStatus}
                selectedContract={selectedContract}
                setSelectedContract={setSelectedContract}
                selectedTxType={selectedTxType}
                setSelectedTxType={setSelectedTxType}
                selectedTxStatus={selectedTxStatus}
                setSelectedTxStatus={setSelectedTxStatus}
                selectedProposalStatus={selectedProposalStatus}
                setSelectedProposalStatus={setSelectedProposalStatus}
                dateRange={dateRange}
                setDateRange={setDateRange}
              />
            </FiltersDialog>
                </div>

          <TabsContent value="transactions" className="space-y-6">
            {/* Latest Blocks above Smart Contracts on mobile; two columns from sm up */}
            <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2">
              <Card className="p-0 sm:p-6 w-full border-none rounded-none bg-transparent sm:border sm:rounded-lg sm:bg-card">
                <div className="flex items-center justify-between px-0 pt-3 pb-2 sm:p-0 sm:mb-4">
                  <h3 className="text-lg font-semibold">{t('explorer.latestBlocks')}</h3>
                  <Link href="/dashboard/explorer/blocks">
                    <Button variant="outline" size="sm">
                      {t('explorer.viewAll')}
                    </Button>
                  </Link>
                </div>
                <BlocksList items={latestBlocks.slice(0, 3)} labels={{ title: t('explorer.block'), validated: t('explorer.validated'), txs: t('explorer.txs') }} />
              </Card>

              <Card className="p-0 sm:p-6 w-full border-none rounded-none bg-transparent sm:border sm:rounded-lg sm:bg-card">
                <div className="flex items-center justify-between px-0 pt-3 pb-2 sm:p-0 sm:mb-4">
                  <h3 className="text-lg font-semibold">Smart Contracts</h3>
                  <Link href="/dashboard/explorer/contracts">
                    <Button variant="outline" size="sm">
                      {t('explorer.viewAll')}
                    </Button>
                  </Link>
                </div>
                <ContractsList items={activeSmartContracts.slice(0, 3)} labels={{ contractType: t('explorer.contractType'), verified: t('explorer.verified') }} />
              </Card>
                </div>

                {/* Recent Transactions header with View all */}
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-base font-semibold">{t('explorer.recentTransactions')}</h3>
                  <Link href="/dashboard/explorer/transactions">
                    <Button variant="outline" size="sm">{t('explorer.viewAll')}</Button>
                  </Link>
                </div>

                {/* Two-column row: transactions list + top validators card */}
                <div className="grid gap-6 md:grid-cols-3">
                  <div className="md:col-span-2 space-y-3">
                    {paginatedTransactions.map((tx) => (
                      <TransactionRow
                        key={tx.id}
                        id={tx.id}
                        type={tx.type}
                        contract={tx.contract}
                        status={tx.status}
                        from={tx.from}
                        to={tx.to}
                        method={(tx as any).method}
                        amount={tx.amount}
                        value={tx.value}
                        timestamp={tx.timestamp}
                        labels={{ from: t('explorer.from'), to: t('explorer.to'), method: t('explorer.method') }}
                      />
                    ))}
                  </div>

                  {/* Top Validators card with avatars; hidden on mobile as moved up */}
                  <Card className="p-6 bg-gradient-to-br from-amber-500 to-amber-600 text-white border-none hidden sm:block">
                    <TopValidatorsList title={t('explorer.topValidators')} validators={topValidators} />
                  </Card>
                </div>

            {/* Pagination removed for compact card; handled in View all */}

            {/* Side panels moved below in cascade */}
            {/* Side panels removed per request */}
          </TabsContent>

          {/* Governance tab removed: moved under Wallet */}
        </Tabs>
      </Card>

      {/* View all blocks */}
      <Dialog open={showBlocksDialog} onOpenChange={setShowBlocksDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{t('explorer.latestBlocks')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 max-h-[70vh] overflow-y-auto">
            <BlocksList items={latestBlocks} labels={{ title: t('explorer.block'), validated: t('explorer.validated'), txs: t('explorer.txs') }} />
          </div>
        </DialogContent>
      </Dialog>

      {/* View all active contracts */}
      <Dialog open={showContractsDialog} onOpenChange={setShowContractsDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{t('explorer.activeContracts')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 max-h-[70vh] overflow-y-auto">
            <ContractsList items={activeSmartContracts} labels={{ contractType: t('explorer.contractType'), verified: t('explorer.verified') }} />
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Proposal Dialog (using reusable wrapper) */}
      <FormDialog
        open={showCreateProposalDialog}
        onOpenChange={setShowCreateProposalDialog}
        title="Create New Proposal"
        className="max-w-lg w-[95vw]"
        footer={(
          <>
            <Button variant="outline" onClick={() => setShowCreateProposalDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateProposal}>
              Create Proposal
            </Button>
          </>
        )}
      >
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Title</h4>
              <Input
                placeholder="Enter proposal title"
                value={proposalFormData.title}
                onChange={(e) => setProposalFormData(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium">Description</h4>
              <Textarea
                placeholder="Enter proposal description"
                value={proposalFormData.description}
                onChange={(e) => setProposalFormData(prev => ({ ...prev, description: e.target.value }))}
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium">Contract</h4>
              <Select
                value={proposalFormData.contract}
                onValueChange={(value) => setProposalFormData(prev => ({ ...prev, contract: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select contract" />
                </SelectTrigger>
                <SelectContent>
                  {contracts.filter(c => c !== "All Contracts").map(contract => (
                    <SelectItem key={contract} value={contract}>{contract}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="text-sm font-medium">End Date</h4>
                <div className="relative">
                  <Calendar className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="datetime-local"
                    className="pl-8"
                    value={proposalFormData.endTime}
                    onChange={(e) => setProposalFormData(prev => ({ ...prev, endTime: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium">Quorum</h4>
                <Input
                  type="number"
                  placeholder="Enter quorum"
                  value={proposalFormData.quorum}
                  onChange={(e) => setProposalFormData(prev => ({ ...prev, quorum: e.target.value }))}
                />
              </div>
            </div>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Once created, proposals cannot be modified. Please review all details carefully.
              </AlertDescription>
            </Alert>
          </div>
      </FormDialog>

      {/* Mobile sort dialog */}
      <div className="sm:hidden">
        <SortDialog
          open={showSortDialog}
          onOpenChange={setShowSortDialog}
          sortBy={sortBy}
          setSortBy={setSortBy}
          options={sortOptions}
        />
      </div>
    </div>
  )
}