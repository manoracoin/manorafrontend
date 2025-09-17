"use client"

import { useEffect, useState } from "react"
import BottomSheet from "@/components/ui/BottomSheet"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2 } from "lucide-react"

export interface WithdrawConfirmPanelProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  withdrawCurrency: string
  withdrawAmount: string
  withdrawFee: number
  totalWithdraw: number
  withdrawMethod: string
  withdrawDestination: string
  onBack: () => void
  onConfirm: () => void
}

export default function WithdrawConfirmPanel({
  open,
  onOpenChange,
  withdrawCurrency,
  withdrawAmount,
  withdrawFee,
  totalWithdraw,
  withdrawMethod,
  withdrawDestination,
  onBack,
  onConfirm,
}: WithdrawConfirmPanelProps) {
  const [isDesktop, setIsDesktop] = useState(false)
  useEffect(() => {
    const mql = window.matchMedia('(min-width: 640px)')
    const listener = (e: MediaQueryListEvent) => setIsDesktop(e.matches)
    setIsDesktop(mql.matches)
    mql.addEventListener ? mql.addEventListener('change', listener) : mql.addListener(listener)
    return () => { mql.removeEventListener ? mql.removeEventListener('change', listener) : mql.removeListener(listener) }
  }, [])

  const Summary = (
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
  )

  const Footer = (
    <div className="flex justify-between mt-6">
      <Button variant="outline" onClick={onBack}>
        Back
      </Button>
      <Button onClick={onConfirm}>
        Confirm Withdrawal
        <CheckCircle2 className="ml-2 h-4 w-4" />
      </Button>
    </div>
  )

  if (!isDesktop) {
    return (
      <BottomSheet open={open} onOpenChange={onOpenChange} title="Confirm Withdrawal">
        {Summary}
        {Footer}
      </BottomSheet>
    )
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="sm:max-w-md w-[90vw] p-0 flex flex-col">
        <SheetHeader className="px-4 pt-4">
          <SheetTitle>Confirm Withdrawal</SheetTitle>
        </SheetHeader>
        <div className="min-h-0 overflow-y-auto px-4 pb-4">
          {Summary}
          {Footer}
        </div>
      </SheetContent>
    </Sheet>
  )
}


