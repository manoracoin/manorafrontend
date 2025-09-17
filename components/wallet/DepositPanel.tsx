"use client"

import { useEffect, useState } from "react"
import BottomSheet from "@/components/ui/BottomSheet"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, ExternalLink } from "lucide-react"

export interface DepositPanelProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  depositFiatOnly: boolean
  depositCurrency: string
  depositAmount: string
  setDepositCurrency: (value: string) => void
  setDepositAmount: (value: string) => void
  onContinueToPayment: () => void
}

export default function DepositPanel({
  open,
  onOpenChange,
  depositFiatOnly,
  depositCurrency,
  depositAmount,
  setDepositCurrency,
  setDepositAmount,
  onContinueToPayment,
}: DepositPanelProps) {
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
      <p className="text-sm text-muted-foreground">Choose how you would like to deposit funds to your wallet.</p>
      <div className="space-y-4 py-4">
        <div className="space-y-4">
          {depositFiatOnly ? (
            <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
              <span className="text-sm text-muted-foreground">Currency</span>
              <Badge>USD</Badge>
            </div>
          ) : (
            <Select value={depositCurrency} onValueChange={setDepositCurrency}>
              <SelectTrigger>
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="usd">USD</SelectItem>
                <SelectItem value="mnr">MNR</SelectItem>
              </SelectContent>
            </Select>
          )}

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
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          Cancel
        </Button>
        <Button onClick={onContinueToPayment}>
          Continue to Payment
          <ExternalLink className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </>
  )

  if (!isDesktop) {
    return (
      <BottomSheet open={open} onOpenChange={onOpenChange} title="Deposit Funds">
        {Content}
      </BottomSheet>
    )
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="sm:max-w-md w-[90vw] p-0 flex flex-col">
        <SheetHeader className="px-4 pt-4">
          <SheetTitle>Deposit Funds</SheetTitle>
        </SheetHeader>
        <div className="min-h-0 overflow-y-auto px-4 pb-4">
          {Content}
        </div>
      </SheetContent>
    </Sheet>
  )
}


