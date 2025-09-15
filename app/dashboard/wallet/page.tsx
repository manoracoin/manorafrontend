"use client"

import { useState, useMemo, useCallback } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  DollarSign,
  Coins,
  QrCode,
  Copy,
  ExternalLink,
  AlertCircle,
  CreditCard,
  Building,
  Building2,
  Landmark,
  Info,
  CheckCircle2,
  MapPin,
  Percent,
} from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from "next/navigation"

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
  const [showDepositDialog, setShowDepositDialog] = useState(false)
  const [showPaymentDialog, setShowPaymentDialog] = useState(false)
  const [showWithdrawDialog, setShowWithdrawDialog] = useState(false)
  const [showWithdrawConfirmDialog, setShowWithdrawConfirmDialog] = useState(false)
  const [walletAddress] = useState("0x1234567890abcdef1234567890abcdef12345678")
  const [depositAmount, setDepositAmount] = useState("")
  const [depositCurrency, setDepositCurrency] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("credit-card")
  const [withdrawAmount, setWithdrawAmount] = useState("")
  const [withdrawCurrency, setWithdrawCurrency] = useState("")
  const [withdrawMethod, setWithdrawMethod] = useState("bank")
  const [withdrawDestination, setWithdrawDestination] = useState("")

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

  // Event handlers
  const handleCopyAddress = useCallback(() => {
    navigator.clipboard.writeText(walletAddress)
  }, [walletAddress])

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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Wallet</h2>
        <div className="flex gap-2">
          <Button onClick={() => setShowDepositDialog(true)}>
            <ArrowDownLeft className="mr-2 h-4 w-4" />
            Deposit
          </Button>
          <Button onClick={() => setShowWithdrawDialog(true)}>
            <ArrowUpRight className="mr-2 h-4 w-4" />
            Withdraw
          </Button>
          <Link href="/dashboard/wallet/governance">
            <Button variant="outline">
              Governance
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-muted-foreground" />
              <h3 className="text-lg font-semibold">Fiat Balance</h3>
            </div>
            <Badge variant="secondary">USD</Badge>
          </div>
          <p className="text-3xl font-bold">$4,500.00</p>
          <p className="text-sm text-muted-foreground mt-1">Available for withdrawal</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Coins className="h-5 w-5 text-muted-foreground" />
              <h3 className="text-lg font-semibold">Crypto Balance</h3>
            </div>
            <Badge variant="secondary">MNR</Badge>
          </div>
          <p className="text-3xl font-bold">1,600 MNR</p>
          <p className="text-sm text-muted-foreground mt-1">≈ $4,000.00 USD</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-muted-foreground" />
              <h3 className="text-lg font-semibold">Real Estate Tokens</h3>
            </div>
            <Badge variant="secondary">Total Value</Badge>
          </div>
          <p className="text-3xl font-bold">${totalTokenValue.toLocaleString()}</p>
          <p className="text-sm text-muted-foreground mt-1">Across {tokenizedProperties.length} properties</p>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Wallet Address</h3>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={handleCopyAddress}>
              <Copy className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <QrCode className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-2 p-4 bg-secondary/50 rounded-lg">
          <code className="text-sm flex-1">{walletAddress}</code>
          <Badge variant="secondary">MNR Network</Badge>
        </div>
      </Card>

      <Card>
        <Tabs defaultValue="tokens" className="custom-tabs">
          <div className="flex items-center justify-between p-6 border-b">
            <h3 className="text-lg font-semibold">Assets & History</h3>
            <TabsList>
              <TabsTrigger value="tokens">
                <Building2 className="h-4 w-4 mr-2" />
                <span>Real Estate Tokens</span>
              </TabsTrigger>
              <TabsTrigger value="all">
                <Clock className="h-4 w-4 mr-2" />
                <span>Transaction History</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="tokens" className="p-6">
            <div className="space-y-6">
              {tokenizedProperties.map((property) => (
                <div
                  onClick={() => router.push(`/dashboard/investments/${property.id}`)}
                  key={property.id}
                  className="flex flex-col md:flex-row gap-6 p-4 rounded-lg border bg-card/50 hover:bg-secondary/40 transition-colors cursor-pointer"
                >
                  <div className="relative w-full md:w-48 h-32 rounded-lg overflow-hidden">
                    <img
                      src={property.image}
                      alt={property.name}
                      className="object-cover w-full h-full"
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
                        <p className="font-semibold">${(property.ownedTokens * property.tokenPrice).toLocaleString()}</p>
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
          </TabsContent>

          <TabsContent value="all" className="p-6">
            <div className="space-y-4">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 rounded-lg border bg-card/50"
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-full ${
                      transaction.type === "receive" 
                        ? "bg-green-500/10 text-green-500" 
                        : "bg-blue-500/10 text-blue-500"
                    }`}>
                      {transaction.type === "receive" ? (
                        <ArrowDownLeft className="h-5 w-5" />
                      ) : (
                        <ArrowUpRight className="h-5 w-5" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">
                        {transaction.type === "receive" ? "Received" : "Sent"} {transaction.cryptoAmount} {transaction.cryptoCurrency}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {new Date(transaction.date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      {transaction.type === "receive" ? "+" : "-"} ${transaction.amount.toFixed(2)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {transaction.type === "receive" ? "From: " : "To: "}
                      {transaction.type === "receive" ? transaction.from : transaction.to}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </Card>

      {/* Deposit Dialog */}
      <Dialog open={showDepositDialog} onOpenChange={setShowDepositDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Deposit Funds</DialogTitle>
            <DialogDescription>
              Choose how you would like to deposit funds to your wallet.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-4">
              <Select value={depositCurrency} onValueChange={setDepositCurrency}>
                <SelectTrigger>
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="usd">USD</SelectItem>
                  <SelectItem value="mnr">MNR</SelectItem>
                </SelectContent>
              </Select>

              <Input
                type="number"
                placeholder="Enter amount"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                className="col-span-2"
              />

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Minimum deposit amount: $100 or 40 MNR
                </AlertDescription>
              </Alert>
            </div>
          </div>
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setShowDepositDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleContinueToPayment}>
              Continue to Payment
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Payment Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Payment Details</DialogTitle>
            <DialogDescription>
              Select your preferred payment method and enter your details.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-medium mb-3">Amount to Deposit</h4>
              <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg">
                <span className="text-sm text-muted-foreground">Total Amount</span>
                <span className="text-lg font-semibold">
                  {depositCurrency === "usd" ? "$" : ""}{depositAmount} {depositCurrency?.toUpperCase()}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-medium">Payment Method</h4>
              <RadioGroup
                value={paymentMethod}
                onValueChange={setPaymentMethod}
                className="grid grid-cols-3 gap-4"
              >
                <Label
                  htmlFor="credit-card"
                  className={`flex flex-col items-center justify-center rounded-lg border-2 p-4 cursor-pointer hover:bg-secondary/50 ${
                    paymentMethod === "credit-card" ? "border-primary" : "border-transparent"
                  }`}
                >
                  <RadioGroupItem value="credit-card" id="credit-card" className="sr-only" />
                  <CreditCard className="h-6 w-6 mb-2" />
                  <span className="text-sm">Credit Card</span>
                </Label>
                <Label
                  htmlFor="bank-transfer"
                  className={`flex flex-col items-center justify-center rounded-lg border-2 p-4 cursor-pointer hover:bg-secondary/50 ${
                    paymentMethod === "bank-transfer" ? "border-primary" : "border-transparent"
                  }`}
                >
                  <RadioGroupItem value="bank-transfer" id="bank-transfer" className="sr-only" />
                  <Building className="h-6 w-6 mb-2" />
                  <span className="text-sm">Bank Transfer</span>
                </Label>
                <Label
                  htmlFor="wire-transfer"
                  className={`flex flex-col items-center justify-center rounded-lg border-2 p-4 cursor-pointer hover:bg-secondary/50 ${
                    paymentMethod === "wire-transfer" ? "border-primary" : "border-transparent"
                  }`}
                >
                  <RadioGroupItem value="wire-transfer" id="wire-transfer" className="sr-only" />
                  <Landmark className="h-6 w-6 mb-2" />
                  <span className="text-sm">Wire Transfer</span>
                </Label>
              </RadioGroup>
            </div>

            {paymentMethod === "credit-card" && (
              <div className="space-y-4">
                <Input placeholder="Card Number" />
                <div className="grid grid-cols-2 gap-4">
                  <Input placeholder="MM/YY" />
                  <Input placeholder="CVC" />
                </div>
                <Input placeholder="Cardholder Name" />
              </div>
            )}

            {paymentMethod === "bank-transfer" && (
              <div className="space-y-4">
                <Input placeholder="Account Number" />
                <Input placeholder="Routing Number" />
                <Input placeholder="Account Holder Name" />
              </div>
            )}

            {paymentMethod === "wire-transfer" && (
              <div className="space-y-4">
                <Input placeholder="SWIFT/BIC Code" />
                <Input placeholder="IBAN" />
                <Input placeholder="Bank Name" />
                <Input placeholder="Account Holder Name" />
              </div>
            )}

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Your payment information is encrypted and secure. We never store your full payment details.
              </AlertDescription>
            </Alert>
          </div>
          <div className="flex justify-between mt-6">
            <Button variant="outline" onClick={() => {
              setShowPaymentDialog(false)
              setShowDepositDialog(true)
            }}>
              Back
            </Button>
            <Button onClick={handlePaymentSubmit}>
              Complete Payment
              <ArrowUpRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Withdraw Dialog */}
      <Dialog open={showWithdrawDialog} onOpenChange={setShowWithdrawDialog}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Withdraw Funds</DialogTitle>
            <DialogDescription>
              Enter the amount and destination for your withdrawal.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Currency</Label>
                  <Select value={withdrawCurrency} onValueChange={setWithdrawCurrency}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="usd">USD</SelectItem>
                      <SelectItem value="mnr">MNR</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Amount</Label>
                  <Input
                    type="number"
                    placeholder="Enter amount"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Withdrawal Method</Label>
                <RadioGroup
                  value={withdrawMethod}
                  onValueChange={setWithdrawMethod}
                  className="grid grid-cols-2 gap-4"
                >
                  <Label
                    htmlFor="bank"
                    className={`flex items-center justify-center rounded-lg border-2 p-4 cursor-pointer hover:bg-secondary/50 ${
                      withdrawMethod === "bank" ? "border-primary" : "border-transparent"
                    }`}
                  >
                    <RadioGroupItem value="bank" id="bank" className="sr-only" />
                    <Building className="h-6 w-6 mr-2" />
                    <span>Bank Account</span>
                  </Label>
                  <Label
                    htmlFor="crypto"
                    className={`flex items-center justify-center rounded-lg border-2 p-4 cursor-pointer hover:bg-secondary/50 ${
                      withdrawMethod === "crypto" ? "border-primary" : "border-transparent"
                    }`}
                  >
                    <RadioGroupItem value="crypto" id="crypto" className="sr-only" />
                    <Wallet className="h-6 w-6 mr-2" />
                    <span>Crypto Wallet</span>
                  </Label>
                </RadioGroup>
              </div>

              {withdrawMethod === "bank" && (
                <div className="space-y-4">
                  <Input placeholder="Bank Account Number" />
                  <Input placeholder="Routing Number" />
                  <Input placeholder="Account Holder Name" />
                  <Input placeholder="Bank Name" />
                </div>
              )}

              {withdrawMethod === "crypto" && (
                <div className="space-y-4">
                  <Input 
                    placeholder="Wallet Address" 
                    value={withdrawDestination}
                    onChange={(e) => setWithdrawDestination(e.target.value)}
                  />
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      Make sure to enter the correct wallet address. Transactions cannot be reversed.
                    </AlertDescription>
                  </Alert>
                </div>
              )}

              <div className="rounded-lg border p-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Amount</span>
                  <span>{withdrawCurrency === "usd" ? "$" : ""}{withdrawAmount || "0"} {withdrawCurrency?.toUpperCase()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Fee</span>
                  <span>{withdrawCurrency === "usd" ? "$" : ""}{withdrawFee} {withdrawCurrency?.toUpperCase()}</span>
                </div>
                <div className="pt-2 border-t">
                  <div className="flex justify-between font-medium">
                    <span>You will receive</span>
                    <span>{withdrawCurrency === "usd" ? "$" : ""}{totalWithdraw} {withdrawCurrency?.toUpperCase()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-between mt-6">
            <Button variant="outline" onClick={() => setShowWithdrawDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleWithdrawSubmit}>
              Continue
              <ArrowUpRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Withdraw Confirmation Dialog */}
      <Dialog open={showWithdrawConfirmDialog} onOpenChange={setShowWithdrawConfirmDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Withdrawal</DialogTitle>
            <DialogDescription>
              Please review the withdrawal details below.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div className="rounded-lg border p-4 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Amount</span>
                  <span className="font-medium">
                    {withdrawCurrency === "usd" ? "$" : ""}{withdrawAmount} {withdrawCurrency?.toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Fee</span>
                  <span className="font-medium">
                    {withdrawCurrency === "usd" ? "$" : ""}{withdrawFee} {withdrawCurrency?.toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">You will receive</span>
                  <span className="font-medium">
                    {withdrawCurrency === "usd" ? "$" : ""}{totalWithdraw} {withdrawCurrency?.toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="pt-4 border-t">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Destination</span>
                  <span className="font-medium">
                    {withdrawMethod === "crypto" 
                      ? `${withdrawDestination.slice(0, 6)}...${withdrawDestination.slice(-4)}`
                      : "Bank Account"}
                  </span>
                </div>
              </div>
            </div>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                This action cannot be undone. Please make sure all details are correct.
              </AlertDescription>
            </Alert>
          </div>
          <div className="flex justify-between mt-6">
            <Button variant="outline" onClick={() => {
              setShowWithdrawConfirmDialog(false)
              setShowWithdrawDialog(true)
            }}>
              Back
            </Button>
            <Button onClick={handleWithdrawConfirm}>
              Confirm Withdrawal
              <CheckCircle2 className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}