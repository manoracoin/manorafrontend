"use client"

import { useState, useMemo, useCallback, useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowUpRight, ArrowDownLeft, Copy, Percent, DollarSign, Coins, Building2, QrCode, Camera, Download, Upload, SlidersHorizontal, Calendar as CalendarIcon, X } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import QRCode from "react-qr-code"
import { useI18n } from "@/components/i18n-provider"
import LatestBlockCard from "@/components/explorer/cards/LatestBlockCard"
import TradeMnrPanel from "@/components/wallet/TradeMnrPanel"
import DepositPanel from "@/components/wallet/DepositPanel"
import PaymentPanel from "@/components/wallet/PaymentPanel"
import WithdrawPanel from "@/components/wallet/WithdrawPanel"
import WithdrawConfirmPanel from "@/components/wallet/WithdrawConfirmPanel"
import BottomSheet from "@/components/ui/BottomSheet"
import FiatTransactionsTable from "@/components/wallet/FiatTransactionsTable"
import { SORT_OPTIONS } from "@/components/explorer/constants"
import ManoraTransactionsTable from "@/components/wallet/ManoraTransactionsTable"
import CameraScanner from "@/components/common/CameraScanner"
import WalletHeaderCard from "@/components/wallet/WalletHeaderCard"

// Move data outside component to prevent recreation on each render
const tokenizedProperties = [
  {
    id: "a9b7c1f4-2d3e-4a1b-9c0d-1234567890ab",
    name: "Luxury Downtown Apartment",
    location: "New York, NY",
    tokenSymbol: "LDANY",
    totalTokens: 1000,
    ownedTokens: 100,
    tokenPrice: 250,
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop&q=60",
    appreciation: "+15%",
    monthlyYield: "8.5%"
  },
  {
    id: "b1c2d3e4-5f67-489a-abcd-2345678901bc",
    name: "Modern Office Complex",
    location: "San Francisco, CA",
    tokenSymbol: "MOCSF",
    totalTokens: 2000,
    ownedTokens: 250,
    tokenPrice: 180,
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=60",
    appreciation: "+12%",
    monthlyYield: "7.2%"
  },
  {
    id: "c2d3e4f5-6789-4abc-bcde-3456789012cd",
    name: "Waterfront Residence",
    location: "Miami, FL",
    tokenSymbol: "WRFMI",
    totalTokens: 1500,
    ownedTokens: 150,
    tokenPrice: 300,
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop&q=60",
    appreciation: "+18%",
    monthlyYield: "9.1%"
  }
]

const transactions = [
  {
    id: 1,
    type: "receive",
    amount: 1250.00,
    currency: "USD",
    cryptoAmount: 500,
    cryptoCurrency: "MNR",
    from: "0x1234...5678",
    to: "Your Wallet",
    date: "2024-03-20T10:30:00",
    status: "completed"
  },
  {
    id: 2,
    type: "send",
    amount: 750.00,
    currency: "USD",
    cryptoAmount: 300,
    cryptoCurrency: "MNR",
    from: "Your Wallet",
    to: "0x8765...4321",
    date: "2024-03-19T15:45:00",
    status: "completed"
  },
  {
    id: 3,
    type: "receive",
    amount: 2000.00,
    currency: "USD",
    cryptoAmount: 800,
    cryptoCurrency: "MNR",
    from: "0x9876...5432",
    to: "Your Wallet",
    date: "2024-03-18T09:15:00",
    status: "completed"
  }
]

export default function WalletPage() {
  // State management
  const router = useRouter()
  const { locale } = useI18n()
  const [showDepositDialog, setShowDepositDialog] = useState(false)
  const [showPaymentDialog, setShowPaymentDialog] = useState(false)
  const [showWithdrawDialog, setShowWithdrawDialog] = useState(false)
  const [showWithdrawConfirmDialog, setShowWithdrawConfirmDialog] = useState(false)
  const [walletAddress] = useState("0x1234567890abcdef1234567890abcdef12345678")
  const [depositAmount, setDepositAmount] = useState("")
  const [depositCurrency, setDepositCurrency] = useState("")
  const [depositFiatOnly, setDepositFiatOnly] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("credit-card")
  const [withdrawAmount, setWithdrawAmount] = useState("")
  const [withdrawCurrency, setWithdrawCurrency] = useState("")
  const [withdrawMethod, setWithdrawMethod] = useState("bank")
  const [withdrawFiatOnly, setWithdrawFiatOnly] = useState(false)
  const [withdrawDestination, setWithdrawDestination] = useState("")
  const [showTradeMnr, setShowTradeMnr] = useState<{mode:'buy'|'sell'}|null>(null)
  const [tradeMnrAmount, setTradeMnrAmount] = useState("")
  const rateUsdPerMnr = 2.5
  const manoraTokens = 1600
  const [showQrDialog, setShowQrDialog] = useState(false)
  const [showScanner, setShowScanner] = useState(false)
  // Mobile filters/sort state (reuse from fiat-transactions)
  const [types, setTypes] = useState<Array<'deposit'|'withdraw'|'buy'|'sell'>>([])
  const [showBar, setShowBar] = useState<boolean>(true)
  const [showSortDialog, setShowSortDialog] = useState<boolean>(false)
  const [isFiltersOpen, setIsFiltersOpen] = useState<boolean>(false)
  const [sortBy, setSortBy] = useState<string>(SORT_OPTIONS[0])
  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined)
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined)
  const [showFromCal, setShowFromCal] = useState<boolean>(false)
  const [showToCal, setShowToCal] = useState<boolean>(false)

  // Memoized calculations
  const totalTokenValue = useMemo(() => {
    return tokenizedProperties.reduce((total, property) => {
      return total + (property.ownedTokens * property.tokenPrice)
    }, 0)
  }, [])

  const withdrawFee = useMemo(() => {
    if (!withdrawAmount) return 0
    const amount = parseFloat(withdrawAmount)
    if (withdrawCurrency === "usd") {
      return (amount * 0.01) + 2 // 1% + $2
    }
    return amount * 0.001 // 0.1% for MNR
  }, [withdrawAmount, withdrawCurrency])

  const totalWithdraw = useMemo(() => {
    if (!withdrawAmount) return 0
    const amount = parseFloat(withdrawAmount)
    return amount - withdrawFee
  }, [withdrawAmount, withdrawFee])

  // Bilancio totale in USD (fiat + MNR convertito + real estate)
  const totalUsdBalance = useMemo(() => {
    return 4500 + manoraTokens * rateUsdPerMnr + totalTokenValue
  }, [totalTokenValue, manoraTokens, rateUsdPerMnr])

  // Dati per grafico andamento wallet: oscillazioni marcate (percentuali su base)
  const walletTrendData = useMemo(() => {
    const perc = [-0.20, 0.10, -0.11, 0.03, -0.18, 0.08, -0.14, 0.05, -0.22, 0.12, -0.10, 0.06]
    const base = totalUsdBalance
    return perc.map((p, i) => ({ idx: i, value: Math.round(base * (1 + p)) }))
  }, [totalUsdBalance])

  // Event handlers
  const [walletUrl, setWalletUrl] = useState("")
  useEffect(() => {
    const base = typeof window !== 'undefined' ? window.location.origin : ''
    const shortId = walletAddress.slice(0, 8)
    if (base) setWalletUrl(`${base}/wallet/${shortId}`)
  }, [walletAddress])

  const handleCopyAddress = useCallback(() => {
    navigator.clipboard.writeText(walletAddress)
  }, [walletAddress])

  const handleCopyUrl = useCallback(() => {
    navigator.clipboard.writeText(walletUrl)
  }, [walletUrl])

  const handleContinueToPayment = useCallback(() => {
    setShowDepositDialog(false)
    setShowPaymentDialog(true)
  }, [])

  const handlePaymentSubmit = useCallback(() => {
    setShowPaymentDialog(false)
  }, [])

  const handleWithdrawSubmit = useCallback(() => {
    setShowWithdrawDialog(false)
    setShowWithdrawConfirmDialog(true)
  }, [])

  const handleWithdrawConfirm = useCallback(() => {
    setShowWithdrawConfirmDialog(false)
  }, [])

  // Responsive switching è gestito dentro i pannelli estratti

  // Track active card on mobile via scroll position
  const [activeCard, setActiveCard] = useState<number>(0)
  const scrollerRef = useRef<HTMLDivElement | null>(null)
  const scrollRafRef = useRef<number | null>(null)
  const updateActiveFromScroll = useCallback(() => {
    const container = scrollerRef.current
    if (!container) return
    const center = container.scrollLeft + container.clientWidth / 2
    const items = Array.from(container.querySelectorAll('[data-snap-item]')) as HTMLElement[]
    let nearest = 0
    let minDist = Infinity
    items.forEach((el, idx) => {
      const elCenter = el.offsetLeft + el.offsetWidth / 2
      const dist = Math.abs(elCenter - center)
      if (dist < minDist) {
        minDist = dist
        nearest = idx
      }
    })
    setActiveCard(nearest)
  }, [])

  const onMobileScroll = useCallback(() => {
    if (scrollRafRef.current) cancelAnimationFrame(scrollRafRef.current)
    scrollRafRef.current = requestAnimationFrame(updateActiveFromScroll)
  }, [updateActiveFromScroll])

  useEffect(() => {
    updateActiveFromScroll()
    const container = scrollerRef.current
    if (!container) return
    container.addEventListener('scroll', onMobileScroll, { passive: true })
    return () => container.removeEventListener('scroll', onMobileScroll)
  }, [onMobileScroll, updateActiveFromScroll])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Wallet</h2>
        <div className="inline-flex sm:hidden items-center gap-1">
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground" aria-label="Open Camera Scanner" onClick={() => setShowScanner(true)}>
            <Camera className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground" aria-label="Show Wallet QR" onClick={() => setShowQrDialog(true)}>
            <QrCode className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Mobile: riga scrollabile con 3 "schede" (header+grafico, MNR, RE) */}
      <div
        ref={scrollerRef}
        className="flex gap-3 overflow-x-auto overflow-y-hidden snap-x snap-mandatory sm:hidden [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        onScroll={onMobileScroll}
      >
        <div id="fiat-card" data-snap-item className="snap-center shrink-0 w-full min-w-[85%]">
          <WalletHeaderCard
            centerLabel="Fiat Wallet"
            value={totalUsdBalance}
            locale={locale}
            chartData={walletTrendData}
            gradientStart="#7dd3fc"
            gradientEnd="#38bdf8"
            formatValue={(v, loc) => new Intl.NumberFormat(loc === 'ar' ? 'ar' : 'en-US', { style: 'currency', currency: 'USD' }).format(v)}
            leftAction={(
              <Button
                size="icon"
                variant="secondary"
                className="rounded-full h-9 w-9 bg-sky-400/10 text-sky-400 hover:bg-sky-400/20"
                aria-label="Deposit"
                onClick={() => { setDepositCurrency('usd'); setDepositFiatOnly(true); setShowDepositDialog(true) }}
              >
                <Download className="h-5 w-5" />
              </Button>
            )}
            rightAction={(
              <Button
                size="icon"
                variant="secondary"
                className="rounded-full h-9 w-9 bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20"
                aria-label="Withdraw"
                onClick={() => { setWithdrawCurrency('usd'); setWithdrawMethod('bank'); setWithdrawFiatOnly(true); setShowWithdrawDialog(true) }}
              >
                <Upload className="h-5 w-5" />
              </Button>
            )}
          />
        </div>

        <div id="mnr-card" data-snap-item className="snap-center shrink-0 w-full min-w-full">
          <WalletHeaderCard
            centerLabel="Manora Wallet"
            value={manoraTokens}
            locale={locale}
            chartData={walletTrendData}
            gradientStart="#34d399"
            gradientEnd="#0d9488"
            valueAdornment={(
              <span className="inline-flex items-center justify-center h-7 w-7 rounded-full bg-teal-500/10">
                <span className="relative block h-5 w-5">
                  <Image src="https://appoostobio.com/uploads/block_images/ec56e1051238fbf784ff56698ec327aa.png" alt="Manora" fill className="object-contain rounded-full" />
                </span>
              </span>
            )}
            leftAction={(
              <Button
                size="icon"
                variant="secondary"
                className="rounded-full h-9 w-9 bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20"
                aria-label="Buy MNR"
                onClick={() => setShowTradeMnr({mode:'buy'})}
              >
                <ArrowDownLeft className="h-5 w-5" />
              </Button>
            )}
            rightAction={(
              <Button
                size="icon"
                variant="secondary"
                className="rounded-full h-9 w-9 bg-rose-500/10 text-rose-600 hover:bg-rose-500/20"
                aria-label="Sell MNR"
                onClick={() => setShowTradeMnr({mode:'sell'})}
              >
                <ArrowUpRight className="h-5 w-5" />
              </Button>
            )}
          />
        </div>

        <div id="re-card" data-snap-item className="snap-center shrink-0 w-full min-w-[85%]">
          <WalletHeaderCard
            centerLabel="Real Estate Wallet"
            value={totalTokenValue}
            locale={locale}
            chartData={walletTrendData}
            gradientStart="#fb7185"
            gradientEnd="#f97316"
            formatValue={(v, loc) => new Intl.NumberFormat(loc === 'ar' ? 'ar' : 'en-US', { style: 'currency', currency: 'USD' }).format(v)}
          />
        </div>
      </div>

      {/* Indicatori di pagina (mobile) */}
      <div className="sm:hidden flex items-center justify-center gap-2 mt-2">
        {[0,1,2].map((i) => (
          <span
            key={i}
            className={`h-1.5 rounded-full transition-all ${activeCard === i ? 'bg-sky-400 w-4' : 'bg-muted-foreground/30 w-1.5'}`}
          />
        ))}
      </div>

      {/* Toolbar Mobile sotto card Fiat: titolo + azioni */}
      {activeCard === 0 && (
        <div className="sm:hidden flex items-center justify-between mt-4 px-1">
          <h3 className="text-lg font-semibold">Fiat Transactions</h3>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" aria-label="Sort" onClick={() => setShowSortDialog(true)}>
              <ArrowUpRight className="h-5 w-5 rotate-90" />
            </Button>
            <Button variant="ghost" size="icon" aria-label="Filters" onClick={() => setIsFiltersOpen(true)}>
              <SlidersHorizontal className="h-5 w-5" />
            </Button>
          </div>
        </div>
      )}

      {/* Desktop: griglia 3 colonne */}
      <div className="hidden sm:grid sm:gap-4 sm:grid-cols-3">
        <LatestBlockCard
          // @ts-ignore ids used only for mobile observer
          id="fiat-card"
          label="Fiat Wallet"
          value={4500}
          subtitle="Available for withdrawal"
          locale={locale}
          gradientClassName="bg-gradient-to-br from-sky-500 to-blue-600"
          icon={DollarSign}
          rightElement={<Badge variant="secondary" className="bg-white/20 text-white border-white/30">USD</Badge>}
          footerElement={
            <div className="flex gap-2">
              <Button size="sm" variant="secondary" className="bg-white/20 hover:bg-white/30 border-white/30" onClick={() => { setDepositCurrency('usd'); setDepositFiatOnly(true); setShowDepositDialog(true) }}>
                Deposit
              </Button>
              <Button size="sm" variant="secondary" className="bg-white/20 hover:bg-white/30 border-white/30" onClick={() => { setWithdrawCurrency('usd'); setWithdrawMethod('bank'); setWithdrawFiatOnly(true); setShowWithdrawDialog(true) }}>
                Withdraw
              </Button>
              <Link href="/dashboard/wallet/fiat-transactions" className="hidden sm:block">
                <Button size="sm" variant="secondary" className="bg-white/20 hover:bg-white/30 border-white/30">
                  History
                </Button>
              </Link>
            </div>
          }
        />
        <LatestBlockCard
          id="mnr-card"
          label="Manora Wallet"
          value={manoraTokens}
          subtitle="MNR"
          locale={locale}
          gradientClassName="bg-gradient-to-br from-emerald-500 to-teal-600"
          icon={Coins}
          footerElement={
            <div className="flex gap-2">
              <Button size="sm" variant="secondary" className="bg-white/20 hover:bg-white/30 border-white/30" onClick={() => setShowTradeMnr({mode:'buy'})}>Buy</Button>
              <Button size="sm" variant="secondary" className="bg-white/20 hover:bg-white/30 border-white/30" onClick={() => setShowTradeMnr({mode:'sell'})}>Sell</Button>
              <Link href="/dashboard/wallet/manora-transactions" className="hidden sm:block">
                <Button size="sm" variant="secondary" className="bg-white/20 hover:bg-white/30 border-white/30">History</Button>
              </Link>
            </div>
          }
        />
        <LatestBlockCard
          id="re-card"
          label="Real Estate Wallet"
          value={totalTokenValue}
          subtitle={`Across ${tokenizedProperties.length} properties`}
          locale={locale}
          gradientClassName="bg-gradient-to-br from-rose-500 to-orange-500"
          icon={Building2}
        />
      </div>

      {/* Mobile-only: conditional content shown under active card */}
      <div className="sm:hidden">
        {activeCard === 0 && (
          <FiatTransactionsTable showTitle={false} types={types} sortBy={sortBy} />
        )}
        {activeCard === 1 && (
          <ManoraTransactionsTable />
        )}
        {activeCard === 2 && (
          <div className="-mx-4">
            <h3 className="text-lg font-semibold mb-3 px-4">Real Estate Tokens</h3>
            <div className="space-y-2">
              {tokenizedProperties.map((property) => (
                <div
                  onClick={() => router.push(`/dashboard/investments/${property.id}`)}
                  key={property.id}
                  className="flex flex-col gap-6 p-4 border-t bg-card/50 hover:bg-secondary/40 transition-colors cursor-pointer first:border-t-0"
                >
                  <div className="relative w-full h-32 rounded-lg overflow-hidden">
                    <Image
                      src={property.image}
                      alt={property.name}
                      fill
                      unoptimized
                      className="object-cover"
                      sizes="100vw"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="font-semibold">{property.name}</div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div><span className="text-muted-foreground">Symbol</span><div>{property.tokenSymbol}</div></div>
                      <div><span className="text-muted-foreground">Owned</span><div>{property.ownedTokens} / {property.totalTokens}</div></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="hidden sm:grid gap-6 md:grid-cols-4">
        <div className="md:col-span-3">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-6">Real Estate Tokens</h3>
            <div className="space-y-6">
              {tokenizedProperties.map((property) => (
                <div
                  onClick={() => router.push(`/dashboard/investments/${property.id}`)}
                  key={property.id}
                  className="flex flex-col md:flex-row gap-6 p-4 rounded-lg border bg-card/50 hover:bg-secondary/40 transition-colors cursor-pointer"
                >
                  <div className="relative w-full md:w-48 h-32 rounded-lg overflow-hidden">
                    <Image
                      src={property.image}
                      alt={property.name}
                      fill
                      unoptimized
                      className="object-cover"
                      sizes="(min-width: 768px) 12rem, 100vw"
                    />
                  </div>
                  <div className="flex-1 space-y-4">
                    <div>
                      <h4 className="text-lg font-semibold">
                        {property.name}
                      </h4>
                      <div className="mt-1">
                        <Link href={`/dashboard/properties/${property.id}`} className="text-sm text-primary hover:underline" onClick={(e) => e.stopPropagation()}>
                          View property details
                        </Link>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Token Symbol</p>
                        <p className="font-semibold">{property.tokenSymbol}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Owned Tokens</p>
                        <p className="font-semibold">{property.ownedTokens} / {property.totalTokens}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Token Price</p>
                        <p className="font-semibold">${property.tokenPrice}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Total Value</p>
                        <p className="font-semibold">${(property.ownedTokens * property.tokenPrice).toLocaleString(locale === 'ar' ? 'ar' : 'en-US')}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant="secondary" className="bg-green-500/10 text-green-500">
                        <ArrowUpRight className="h-4 w-4 mr-1" />
                        {property.appreciation} Appreciation
                      </Badge>
                      <Badge variant="secondary" className="bg-blue-500/10 text-blue-500">
                        <Percent className="h-4 w-4 mr-1" />
                        {property.monthlyYield} Monthly Yield
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
        <div className="md:col-span-1">
          <Card className="p-6 hidden sm:block">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Wallet Access</h3>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Wallet URL</span>
                  <Button variant="outline" size="sm" className="h-8" onClick={handleCopyUrl}>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                </div>
                <div className="p-3 rounded-lg bg-secondary/50 border">
                  <p className="text-sm break-all">{walletUrl}</p>
                </div>
              </div>
              <div className="flex flex-col items-center">
                <div className="p-3 rounded-lg border bg-background">
                  <QRCode value={walletUrl} size={180} style={{ height: "auto", maxWidth: "100%", width: "180px" }} />
                </div>
                <p className="text-xs text-muted-foreground mt-2">QR Code for quick wallet access</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Mobile Filters & Sort sheets, reusing components */}
      <BottomSheet open={isFiltersOpen} onOpenChange={setIsFiltersOpen} title="Filters">
        <div className="space-y-5">
          <div>
            <div className="text-xs mb-1 text-muted-foreground">Type</div>
            <div className="grid grid-cols-2 gap-2">
              {(['deposit','withdraw','buy','sell'] as const).map(opt => (
                <button
                  key={opt}
                  className={`text-sm px-3 py-2 rounded-lg border ${types.includes(opt) ? 'bg-primary/10 border-primary/30 text-primary' : 'bg-card border-border/50'}`}
                  onClick={() => setTypes(prev => prev.includes(opt) ? prev.filter(v => v !== opt) : [...prev, opt])}
                >
                  {opt === 'buy' ? 'Buy MNR' : opt === 'sell' ? 'Sell MNR' : opt}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="text-xs mb-1 text-muted-foreground">Date range</div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-xs text-muted-foreground mb-1">From</div>
                <div className="flex items-center gap-2">
                  <button className="flex-1 text-left px-3 py-2 rounded-lg border bg-card border-border/50 inline-flex items-center gap-2" onClick={() => { setShowFromCal(v=>!v); setShowToCal(false) }}>
                    <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                    <span>{dateFrom ? new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(dateFrom) : 'Select date'}</span>
                  </button>
                  {dateFrom && (
                    <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setDateFrom(undefined)}>
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                {showFromCal && (
                  <div className="mt-2 inline-block rounded-lg border p-2 bg-card overflow-hidden">
                    <Calendar
                      mode="single"
                      selected={dateFrom}
                      onSelect={(d:any) => { if (!d) return; if (dateTo && d > dateTo) setDateTo(d); setDateFrom(d); setShowFromCal(false) }}
                      numberOfMonths={1}
                    />
                  </div>
                )}
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">To</div>
                <div className="flex items-center gap-2">
                  <button className="flex-1 text-left px-3 py-2 rounded-lg border bg-card border-border/50 inline-flex items-center gap-2" onClick={() => { setShowToCal(v=>!v); setShowFromCal(false) }}>
                    <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                    <span>{dateTo ? new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(dateTo) : 'Select date'}</span>
                  </button>
                  {dateTo && (
                    <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setDateTo(undefined)}>
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                {showToCal && (
                  <div className="mt-2 inline-block rounded-lg border p-2 bg-card overflow-hidden">
                    <Calendar
                      mode="single"
                      selected={dateTo}
                      onSelect={(d:any) => { if (!d) return; if (dateFrom && d < dateFrom) setDateFrom(d); setDateTo(d); setShowToCal(false) }}
                      numberOfMonths={1}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <Button variant="destructive" onClick={() => { setTypes([]); setDateFrom(undefined); setDateTo(undefined); }}>Reset</Button>
            <Button onClick={() => setIsFiltersOpen(false)}>Apply</Button>
          </div>
        </div>
      </BottomSheet>
      <BottomSheet open={showSortDialog} onOpenChange={setShowSortDialog} title="Sort">
        <div className="grid gap-2">
          {SORT_OPTIONS.map((option) => (
            <button
              key={option}
              className={`text-sm px-3 py-2 rounded-lg border text-left ${sortBy===option ? 'bg-primary/10 border-primary/30 text-primary' : 'bg-card border-border/50'}`}
              onClick={() => setSortBy(option)}
            >
              {option}
            </button>
          ))}
        </div>
      </BottomSheet>

      <DepositPanel
        open={showDepositDialog}
        onOpenChange={(open) => { setShowDepositDialog(open); if (!open) setDepositFiatOnly(false) }}
        depositFiatOnly={depositFiatOnly}
        depositCurrency={depositCurrency}
        depositAmount={depositAmount}
        setDepositCurrency={setDepositCurrency}
        setDepositAmount={setDepositAmount}
        onContinueToPayment={handleContinueToPayment}
      />

      <PaymentPanel
        open={showPaymentDialog}
        onOpenChange={setShowPaymentDialog}
        depositCurrency={depositCurrency}
        depositAmount={depositAmount}
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
        onBack={() => { setShowPaymentDialog(false); setShowDepositDialog(true) }}
        onSubmit={handlePaymentSubmit}
      />

      <WithdrawPanel
        open={showWithdrawDialog}
        onOpenChange={(open) => { setShowWithdrawDialog(open); if (!open) setWithdrawFiatOnly(false) }}
        withdrawFiatOnly={withdrawFiatOnly}
        withdrawCurrency={withdrawCurrency}
        setWithdrawCurrency={setWithdrawCurrency}
        withdrawAmount={withdrawAmount}
        setWithdrawAmount={setWithdrawAmount}
        withdrawMethod={withdrawMethod}
        setWithdrawMethod={setWithdrawMethod}
        withdrawDestination={withdrawDestination}
        setWithdrawDestination={setWithdrawDestination}
        withdrawFee={withdrawFee}
        totalWithdraw={totalWithdraw}
        onContinue={handleWithdrawSubmit}
      />

      <WithdrawConfirmPanel
        open={showWithdrawConfirmDialog}
        onOpenChange={setShowWithdrawConfirmDialog}
        withdrawCurrency={withdrawCurrency}
        withdrawAmount={withdrawAmount}
        withdrawFee={withdrawFee}
        totalWithdraw={totalWithdraw}
        withdrawMethod={withdrawMethod}
        withdrawDestination={withdrawDestination}
        onBack={() => { setShowWithdrawConfirmDialog(false); setShowWithdrawDialog(true) }}
        onConfirm={handleWithdrawConfirm}
      />

      {showTradeMnr && (
        <TradeMnrPanel
          open={!!showTradeMnr}
          onOpenChange={(o)=>{ if(!o){ setShowTradeMnr(null); setTradeMnrAmount("") } }}
          mode={showTradeMnr.mode}
          mnrAmount={tradeMnrAmount}
          setMnrAmount={setTradeMnrAmount}
          rateUsdPerMnr={rateUsdPerMnr}
          onConfirm={()=>{ setShowTradeMnr(null); setTradeMnrAmount("") }}
        />
      )}

      {/* Wallet QR - visible via dialog only on mobile */}
      <BottomSheet open={showQrDialog} onOpenChange={setShowQrDialog} title="Wallet QR">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <QrCode className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Scan to access wallet</span>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Wallet URL</span>
              <Button variant="outline" size="sm" className="h-8" onClick={handleCopyUrl}>
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
            </div>
            <div className="p-3 rounded-lg bg-secondary/50 border">
              <p className="text-sm break-all">{walletUrl}</p>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="p-3 rounded-lg border bg-background">
              <QRCode value={walletUrl} size={200} style={{ height: "auto", maxWidth: "100%", width: "200px" }} />
            </div>
          </div>
        </div>
      </BottomSheet>

      {/* Camera Scanner (mobile) */}
      <CameraScanner open={showScanner} onOpenChange={setShowScanner} title="Scan" onResult={(text)=>{ console.log('Scanned:', text) }} />

    </div>
  )
}