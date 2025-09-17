"use client"

import { useEffect, useState } from "react"
import BottomSheet from "@/components/ui/BottomSheet"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { AlertCircle, Building, Landmark, CreditCard, ArrowUpRight } from "lucide-react"

export interface PaymentPanelProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  depositCurrency: string
  depositAmount: string
  paymentMethod: string
  setPaymentMethod: (value: string) => void
  onBack: () => void
  onSubmit: () => void
}

export default function PaymentPanel({
  open,
  onOpenChange,
  depositCurrency,
  depositAmount,
  paymentMethod,
  setPaymentMethod,
  onBack,
  onSubmit,
}: PaymentPanelProps) {
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
      <p className="text-sm text-muted-foreground">Select your preferred payment method and enter your details.</p>
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
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onSubmit}>
          Complete Payment
          <ArrowUpRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </>
  )

  if (!isDesktop) {
    return (
      <BottomSheet open={open} onOpenChange={onOpenChange} title="Payment Details">
        {Content}
      </BottomSheet>
    )
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="sm:max-w-md w-[90vw] p-0 flex flex-col">
        <SheetHeader className="px-4 pt-4">
          <SheetTitle>Payment Details</SheetTitle>
        </SheetHeader>
        <div className="min-h-0 overflow-y-auto px-4 pb-4">
          {Content}
        </div>
      </SheetContent>
    </Sheet>
  )
}


