"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  ArrowUpRight,
  ArrowDownLeft,
  ChevronUp,
  ChevronDown,
  Clock,
  Building2,
  MapPin,
  Percent,
  Users,
  AlertCircle,
  Coins,
  History,
  Filter,
  CheckCircle2,
  XCircle,
  ChevronRight,
} from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import dynamic from "next/dynamic"
import OrderBookAsks from "@/components/orderbook/OrderBookAsks"
import OrderBookBids from "@/components/orderbook/OrderBookBids"

const CandlestickChart = dynamic(() => import("@/components/charts/CandlestickChart"), { ssr: false })

// Keep sample data aligned with generic investments page
const properties = [
  {
    id: "a9b7c1f4-2d3e-4a1b-9c0d-1234567890ab",
    name: "Luxury Downtown Apartment",
    symbol: "LDANY",
    location: "New York, NY",
    currentPrice: 250,
    change: 3.5,
    volume: 15000,
    marketCap: "12.5M",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop&q=60",
    priceHistory: [240, 245, 242, 248, 250, 247, 251, 250],
    userBalance: 150,
    orderBook: {
      bids: [
        { id: "b1", price: 249, amount: 100, user: "0x7a...3f9", time: "14:30:25" },
        { id: "b2", price: 248, amount: 150, user: "0x8b...4e2", time: "14:29:18" },
        { id: "b3", price: 247, amount: 200, user: "0x9c...5d3", time: "14:28:45" },
        { id: "b4", price: 246, amount: 180, user: "0x1d...6e4", time: "14:27:30" },
        { id: "b5", price: 245, amount: 120, user: "0x2e...7f5", time: "14:26:15" },
        { id: "b6", price: 244, amount: 160, user: "0x3f...8g6", time: "14:25:10" },
        { id: "b7", price: 243, amount: 140, user: "0x4g...9h7", time: "14:24:05" },
      ],
      asks: [
        { id: "a1", price: 251, amount: 120, user: "0x3f...8g6", time: "14:31:40" },
        { id: "a2", price: 252, amount: 180, user: "0x4g...9h7", time: "14:30:55" },
        { id: "a3", price: 253, amount: 140, user: "0x5h...0i8", time: "14:29:50" },
        { id: "a4", price: 254, amount: 160, user: "0x6i...1j9", time: "14:28:35" },
        { id: "a5", price: 255, amount: 130, user: "0x7j...2k0", time: "14:27:20" },
        { id: "a6", price: 256, amount: 110, user: "0x8k...3l1", time: "14:26:05" },
        { id: "a7", price: 257, amount: 100, user: "0x9l...4m2", time: "14:25:00" },
      ]
    }
  },
  {
    id: "b1c2d3e4-5f67-489a-abcd-2345678901bc",
    name: "Modern Office Complex",
    symbol: "MOCSF",
    location: "San Francisco, CA",
    currentPrice: 180,
    change: -1.2,
    volume: 22000,
    marketCap: "18.2M",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=60",
    priceHistory: [182, 181, 179, 180, 178, 179, 180, 180],
    userBalance: 75,
    orderBook: {
      bids: [
        { id: "b6", price: 179, amount: 150, user: "0x8k...3l1", time: "14:32:15" },
        { id: "b7", price: 178, amount: 200, user: "0x9l...4m2", time: "14:31:10" },
        { id: "b8", price: 177, amount: 180, user: "0x0m...5n3", time: "14:30:05" },
        { id: "b9", price: 176, amount: 160, user: "0x1n...6o4", time: "14:29:00" },
        { id: "b10", price: 175, amount: 140, user: "0x2o...7p5", time: "14:27:55" },
      ],
      asks: [
        { id: "a6", price: 181, amount: 160, user: "0x3p...8q6", time: "14:33:30" },
        { id: "a7", price: 182, amount: 140, user: "0x4q...9r7", time: "14:32:25" },
        { id: "a8", price: 183, amount: 170, user: "0x5r...0s8", time: "14:31:20" },
        { id: "a9", price: 184, amount: 150, user: "0x6s...1t9", time: "14:30:15" },
        { id: "a10", price: 185, amount: 130, user: "0x7t...2u0", time: "14:29:10" },
      ]
    }
  },
  {
    id: "c2d3e4f5-6789-4abc-bcde-3456789012cd",
    name: "Waterfront Residence",
    symbol: "WRFMI",
    location: "Miami, FL",
    currentPrice: 300,
    change: 2.1,
    volume: 17500,
    marketCap: "14.3M",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop&q=60",
    priceHistory: [295, 298, 297, 301, 300, 299, 302, 300],
    userBalance: 150,
    orderBook: {
      bids: [
        { id: "b11", price: 299, amount: 120, user: "0x2a...7b9", time: "14:32:35" },
        { id: "b12", price: 298, amount: 180, user: "0x3b...8c0", time: "14:31:22" }
      ],
      asks: [
        { id: "a11", price: 301, amount: 140, user: "0x4c...9d1", time: "14:33:10" },
        { id: "a12", price: 302, amount: 160, user: "0x5d...0e2", time: "14:34:05" }
      ]
    }
  }
]

const recentTrades = [
  { id: 1, symbol: "LDANY", type: "buy", price: 250, amount: 10, total: 2500, time: "14:30:25" },
  { id: 2, symbol: "MOCSF", type: "sell", price: 180, amount: 15, total: 2700, time: "14:29:18" },
  { id: 3, symbol: "LDANY", type: "buy", price: 249, amount: 5, total: 1245, time: "14:28:45" },
  { id: 4, symbol: "MOCSF", type: "sell", price: 179, amount: 8, total: 1432, time: "14:27:30" },
]

const orderHistory = [
  {
    id: "ord1",
    type: "buy",
    symbol: "LDANY",
    price: 250,
    amount: 10,
    total: 2500,
    status: "completed",
    timestamp: "2024-03-21T14:30:25",
    matchedWith: "0x3f...8g6",
    fee: 25
  },
  {
    id: "ord2",
    type: "sell",
    symbol: "MOCSF",
    price: 180,
    amount: 15,
    total: 2700,
    status: "completed",
    timestamp: "2024-03-21T14:29:18",
    matchedWith: "0x8k...3l1",
    fee: 27
  },
  {
    id: "ord3",
    type: "buy",
    symbol: "LDANY",
    price: 248,
    amount: 5,
    total: 1240,
    status: "cancelled",
    timestamp: "2024-03-21T14:28:45",
    matchedWith: null,
    fee: 0
  },
  {
    id: "ord4",
    type: "sell",
    symbol: "MOCSF",
    price: 182,
    amount: 8,
    total: 1456,
    status: "pending",
    timestamp: "2024-03-21T14:27:30",
    matchedWith: null,
    fee: 0
  }
]

interface OrderDetails {
  id: string
  price: number
  amount: number
  user: string
  time: string
  type: "bid" | "ask"
}

export default function InvestmentsByIdPage() {
  const params = useParams<{ id: string }>()
  const requestedId = params?.id

  const initialProperty = useMemo(() => {
    const byId = properties.find(p => p.id.toString() === String(requestedId))
    return byId ?? properties[0]
  }, [requestedId])

  const [selectedProperty, setSelectedProperty] = useState(initialProperty)
  const [orderType, setOrderType] = useState<"buy" | "sell">("buy")
  const [amount, setAmount] = useState("")
  const [price, setPrice] = useState(initialProperty.currentPrice.toString())
  const [selectedOrder, setSelectedOrder] = useState<OrderDetails | null>(null)
  const [showOrderDialog, setShowOrderDialog] = useState(false)
  const [orderAmount, setOrderAmount] = useState("")
  const [selectedTimeframe, setSelectedTimeframe] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")

  // Keep state in sync if the route id changes
  useEffect(() => {
    const next = properties.find(p => p.id.toString() === String(requestedId))
    if (next) {
      setSelectedProperty(next)
      setPrice(next.currentPrice.toString())
    } else {
      setSelectedProperty(properties[0])
      setPrice(properties[0].currentPrice.toString())
    }
  }, [requestedId])

  const nf = new Intl.NumberFormat('en-US')

  // Token selector rimosso: la proprietà selezionata è determinata dalla route

  const handleOrder = () => {
    console.log("Order placed:", {
      type: orderType,
      property: selectedProperty.symbol,
      amount,
      price
    })
  }

  const handleOrderClick = (order: OrderDetails) => {
    setSelectedOrder(order)
    setOrderType(order.type === "ask" ? "buy" : "sell")
    setPrice(order.price.toString())
    setOrderAmount("")
    setShowOrderDialog(true)
  }

  const handleOrderConfirm = () => {
    if (!selectedOrder) return

    console.log("Order matched:", {
      type: orderType,
      property: selectedProperty.symbol,
      amount: orderAmount,
      price: selectedOrder.price,
      matchedWith: selectedOrder.id
    })

    setShowOrderDialog(false)
    setSelectedOrder(null)
    setOrderAmount("")
  }

  const filteredOrderHistory = orderHistory.filter(order => {
    if (selectedTimeframe !== "all") {
      const orderDate = new Date(order.timestamp)
      const now = new Date()
      const daysDiff = (now.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24)
      switch (selectedTimeframe) {
        case "24h":
          if (daysDiff > 1) return false
          break
        case "7d":
          if (daysDiff > 7) return false
          break
        case "30d":
          if (daysDiff > 30) return false
          break
      }
    }
    if (selectedStatus !== "all" && order.status !== selectedStatus) {
      return false
    }
    return true
  })

  return (
    <div className="space-y-6">
      <Tabs defaultValue="trading" className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/dashboard/wallet">
              <Button variant="outline">Back to Wallet</Button>
            </Link>
          </div>
          <TabsList className="ml-auto">
            <TabsTrigger value="trading">
              <Coins className="h-4 w-4 mr-2" />
              Trading
            </TabsTrigger>
            <TabsTrigger value="history">
              <History className="h-4 w-4 mr-2" />
              Order History
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="trading" className="space-y-6 mt-6">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-3 space-y-6">
              <Card className="p-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-lg overflow-hidden">
                    <img 
                      src={selectedProperty.image} 
                      alt={selectedProperty.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold">{selectedProperty.name}</h3>
                    <p className="text-sm text-muted-foreground flex items-center">
                      <MapPin className="h-3 w-3 mr-1" />
                      {selectedProperty.location}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Price</span>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">${selectedProperty.currentPrice}</span>
                      <Badge 
                        variant="secondary" 
                        className={selectedProperty.change > 0 ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"}
                      >
                        {selectedProperty.change > 0 ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                        {Math.abs(selectedProperty.change)}%
                      </Badge>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Volume</span>
                    <span className="font-medium">{nf.format(selectedProperty.volume)}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Market Cap</span>
                    <span className="font-medium">${selectedProperty.marketCap}</span>
                  </div>
                </div>
              </Card>

              {/* Market stats moved under property info */}
              <Card className="p-4">
                <h3 className="font-semibold mb-4">Market Statistics</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">24h High</span>
                    <span className="font-medium">${(selectedProperty.currentPrice * 1.05).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">24h Low</span>
                    <span className="font-medium">${(selectedProperty.currentPrice * 0.95).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">24h Volume</span>
                    <span className="font-medium">{nf.format(selectedProperty.volume)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Circulating Supply</span>
                    <span className="font-medium">50,000</span>
                  </div>
                </div>
              </Card>

              {/* Recent trades moved under property info */}
              <Card className="p-4">
                <h3 className="font-semibold mb-4">Recent Trades</h3>
                <div className="space-y-3">
                  {recentTrades.map((trade) => (
                    <div key={trade.id} className="flex items-center justify-between text-sm">
                      <div>
                        <span className={trade.type === "buy" ? "text-green-500" : "text-red-500"}>
                          {trade.type === "buy" ? "Buy" : "Sell"}
                        </span>
                        <span className="text-muted-foreground ml-2">{trade.symbol}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">${trade.price}</div>
                        <div className="text-xs text-muted-foreground">{trade.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Market activity moved under property info */}
              <Card className="p-4">
                <h3 className="font-semibold mb-4">Market Activity</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Last updated: Just now</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Active traders: 156</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Percent className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Daily volatility: 2.3%</span>
                  </div>
                </div>
              </Card>
            </div>

            {/* right column now keeps only Order Book above */}
            <div className="col-span-6 space-y-6">
              <Card className="p-4 h-[400px] overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Price Chart</h3>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">1H</Button>
                    <Button variant="outline" size="sm">1D</Button>
                    <Button variant="outline" size="sm">1W</Button>
                    <Button variant="outline" size="sm">1M</Button>
                    <Button variant="outline" size="sm">1Y</Button>
                  </div>
                </div>
                <CandlestickChart height={320} />
              </Card>

              <Card className="p-4">
                <div className="flex gap-2 mb-4">
                  <Button 
                    variant={orderType === "buy" ? "default" : "outline"}
                    className="flex-1"
                    onClick={() => setOrderType("buy")}
                  >
                    Buy
                  </Button>
                  <Button 
                    variant={orderType === "sell" ? "default" : "outline"}
                    className="flex-1"
                    onClick={() => setOrderType("sell")}
                  >
                    Sell
                  </Button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Price</label>
                    <Input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="Enter price per token"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Amount</label>
                    <Input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="Enter amount of tokens"
                    />
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex justify-between mb-2 text-sm">
                      <span className="text-muted-foreground">Total Cost</span>
                      <span className="font-medium">
                        ${nf.format((parseFloat(price) || 0) * (parseFloat(amount) || 0))}
                      </span>
                    </div>

                    <Button 
                      className="w-full"
                      onClick={handleOrder}
                    >
                      {orderType === "buy" ? (
                        <>
                          <ArrowDownLeft className="mr-2 h-4 w-4" />
                          Buy {selectedProperty.symbol}
                        </>
                      ) : (
                        <>
                          <ArrowUpRight className="mr-2 h-4 w-4" />
                          Sell {selectedProperty.symbol}
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </Card>
            </div>

            <div className="col-span-3 space-y-6">
              <Card className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Order Book • Sell</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <Badge variant="secondary" className="px-2 py-0.5 text-xs">
                      {selectedProperty.orderBook.asks.length} Active Orders
                    </Badge>
                  </div>
                </div>
                <OrderBookAsks
                  asks={selectedProperty.orderBook.asks}
                  currentPrice={selectedProperty.currentPrice}
                  symbol={selectedProperty.symbol}
                  onClick={(o) => handleOrderClick({ ...o, type: "ask" })}
                  onCreate={({ price, amount }) => {
                    // Inserisce l'ordine creato in cima alla lista (demo client-side)
                    const newOrder = { id: `a-new-${Date.now()}`, price, amount, user: "you" }
                    const updated = { ...selectedProperty }
                    updated.orderBook = {
                      ...updated.orderBook,
                      asks: [{ ...newOrder }, ...updated.orderBook.asks],
                    }
                    setSelectedProperty(updated as any)
                  }}
                />
              </Card>

              {/* removed current price box */}

              <Card className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Order Book • Buy</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <Badge variant="secondary" className="px-2 py-0.5 text-xs">
                      {selectedProperty.orderBook.bids.length} Active Orders
                    </Badge>
                  </div>
                </div>
                <OrderBookBids
                  bids={selectedProperty.orderBook.bids}
                  symbol={selectedProperty.symbol}
                  onClick={(o) => handleOrderClick({ ...o, type: "bid" })}
                  onCreate={({ price, amount }) => {
                    const newOrder = { id: `b-new-${Date.now()}`, price, amount, user: "you" }
                    const updated = { ...selectedProperty }
                    updated.orderBook = {
                      ...updated.orderBook,
                      bids: [{ ...newOrder }, ...updated.orderBook.bids],
                    }
                    setSelectedProperty(updated as any)
                  }}
                />
              </Card>
 
              {/* right column now keeps only Order Book above */}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-6 mt-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <h3 className="font-semibold">Filters</h3>
              </div>
              <div className="flex gap-4">
                <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select timeframe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="24h">Last 24 Hours</SelectItem>
                    <SelectItem value="7d">Last 7 Days</SelectItem>
                    <SelectItem value="30d">Last 30 Days</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              {filteredOrderHistory.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-4 rounded-lg border bg-card/50"
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-full ${
                      order.type === "buy" 
                        ? "bg-green-500/10 text-green-500" 
                        : "bg-red-500/10 text-red-500"
                    }`}>
                      {order.type === "buy" ? (
                        <ArrowDownLeft className="h-5 w-5" />
                      ) : (
                        <ArrowUpRight className="h-5 w-5" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">
                          {order.type === "buy" ? "Buy" : "Sell"} {order.symbol}
                        </p>
                        <Badge variant="secondary" className={
                          order.status === "completed" ? "bg-green-500/ 10 text-green-500" :
                          order.status === "pending" ? "bg-blue-500/10 text-blue-500" :
                          "bg-red-500/10 text-red-500"
                        }>
                          {order.status === "completed" ? (
                            <div className="flex items-center gap-1">
                              <CheckCircle2 className="h-3 w-3" />
                              <span>Completed</span>
                            </div>
                          ) : order.status === "pending" ? (
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>Pending</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1">
                              <XCircle className="h-3 w-3" />
                              <span>Cancelled</span>
                            </div>
                          )}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                        <span>{new Intl.DateTimeFormat('en-US', { timeZone: 'UTC', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).format(new Date(order.timestamp))}</span>
                        {order.matchedWith && (
                          <>
                            <ChevronRight className="h-4 w-4" />
                            <span>Matched with: {order.matchedWith}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="space-y-1">
                      <p className="font-medium">${nf.format(order.total)}</p>
                      <p className="text-sm text-muted-foreground">
                        {order.amount} tokens @ ${order.price}
                      </p>
                      {order.fee > 0 && (
                        <p className="text-xs text-muted-foreground">
                          Fee: ${order.fee}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={showOrderDialog} onOpenChange={setShowOrderDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {orderType === "buy" ? "Buy from" : "Sell to"} Order
            </DialogTitle>
            <DialogDescription>
              Match with an existing {orderType === "buy" ? "sell" : "buy"} order
            </DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Order Price</span>
                  <span className="font-medium">${selectedOrder.price}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Available Amount</span>
                  <span className="font-medium">{selectedOrder.amount} tokens</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Order Placed</span>
                  <span className="font-medium">{selectedOrder.time}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">User</span>
                  <span className="font-mono text-sm">{selectedOrder.user}</span>
                </div>
              </div>

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Enter the amount you want to {orderType}. Maximum available: {selectedOrder.amount} tokens
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <label className="text-sm font-medium">Amount to {orderType}</label>
                <Input
                  type="number"
                  value={orderAmount}
                  onChange={(e) => setOrderAmount(e.target.value)}
                  placeholder={`Enter amount (max: ${selectedOrder.amount})`}
                />
              </div>

              <div className="rounded-lg border p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Price per token</span>
                  <span className="font-medium">${selectedOrder.price}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Amount</span>
                  <span className="font-medium">{orderAmount || 0} tokens</span>
                </div>
                <div className="pt-2 border-t">
                  <div className="flex justify-between font-medium">
                    <span>Total {orderType === "buy" ? "Cost" : "Receive"}</span>
                    <span>${nf.format((parseFloat(orderAmount) || 0) * selectedOrder.price)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowOrderDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleOrderConfirm}
              disabled={!orderAmount || parseFloat(orderAmount) <= 0 || parseFloat(orderAmount) > (selectedOrder?.amount || 0)}
            >
              Confirm {orderType === "buy" ? "Purchase" : "Sale"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}


