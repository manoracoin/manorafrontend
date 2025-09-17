"use client"

import { useEffect, useState } from "react"
import BottomSheet from "@/components/ui/BottomSheet"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { AlertCircle, Info, Wallet, Building, ArrowUpRight } from "lucide-react"

export interface WithdrawPanelProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  withdrawFiatOnly: boolean
  withdrawCurrency: string
  setWithdrawCurrency: (value: string) => void
  withdrawAmount: string
  setWithdrawAmount: (value: string) => void
  withdrawMethod: string
  setWithdrawMethod: (value: string) => void
  withdrawDestination: string
  setWithdrawDestination: (value: string) => void
  withdrawFee: number
  totalWithdraw: number
  onContinue: () => void
}

export default function WithdrawPanel({
  open,
  onOpenChange,
  withdrawFiatOnly,
  withdrawCurrency,
  setWithdrawCurrency,
  withdrawAmount,
  setWithdrawAmount,
  withdrawMethod,
  setWithdrawMethod,
  withdrawDestination,
  setWithdrawDestination,
  withdrawFee,
  totalWithdraw,
  onContinue,
}: WithdrawPanelProps) {
  const [isDesktop, setIsDesktop] = useState(false)
  useEffect(() => {
    const mql = window.matchMedia('(min-width: 640px)')
    const listener = (e: MediaQueryListEvent) => setIsDesktop(e.matches)
    setIsDesktop(mql.matches)
    mql.addEventListener ? mql.addEventListener('change', listener) : mql.addListener(listener)
    return () => { mql.removeEventListener ? mql.removeEventListener('change', listener) : mql.removeListener(listener) }
  }, [])

  const Content = (
    <>
      <p className="text-sm text-muted-foreground">Enter the amount and destination for your withdrawal.</p>
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Currency</Label>
              {withdrawFiatOnly ? (
                <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                  <span className="text-sm text-muted-foreground">Currency</span>
                  <Badge>USD</Badge>
                </div>
              ) : (
                <Select value={withdrawCurrency} onValueChange={setWithdrawCurrency}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="usd">USD</SelectItem>
                    <SelectItem value="mnr">MNR</SelectItem>
                  </SelectContent>
                </Select>
              )}
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
            {withdrawFiatOnly ? (
              <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                <span className="text-sm text-muted-foreground">Method</span>
                <Badge>Bank Account</Badge>
              </div>
            ) : (
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
            )}
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
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          Cancel
        </Button>
        <Button onClick={onContinue}>
          Continue
          <ArrowUpRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </>
  )

  if (!isDesktop) {
    return (
      <BottomSheet open={open} onOpenChange={onOpenChange} title="Withdraw Funds">
        {Content}
      </BottomSheet>
    )
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="sm:max-w-md w-[90vw] p-0 flex flex-col">
        <SheetHeader className="px-4 pt-4">
          <SheetTitle>Withdraw Funds</SheetTitle>
        </SheetHeader>
        <div className="min-h-0 overflow-y-auto px-4 pb-4">
          {Content}
        </div>
      </SheetContent>
    </Sheet>
  )
}


