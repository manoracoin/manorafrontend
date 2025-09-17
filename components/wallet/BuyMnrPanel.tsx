"use client"

import { useEffect, useMemo, useState } from "react"
import BottomSheet from "@/components/ui/BottomSheet"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Coins, AlertCircle } from "lucide-react"

export interface BuyMnrPanelProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  usdAmount: string
  setUsdAmount: (value: string) => void
  rateUsdPerMnr: number
  onConfirm: () => void
}

export default function BuyMnrPanel({ open, onOpenChange, usdAmount, setUsdAmount, rateUsdPerMnr, onConfirm }: BuyMnrPanelProps) {
  const [isDesktop, setIsDesktop] = useState(false)
  useEffect(() => {
    const mql = window.matchMedia('(min-width: 640px)')
    const listener = (e: MediaQueryListEvent) => setIsDesktop(e.matches)
    setIsDesktop(mql.matches)
    mql.addEventListener ? mql.addEventListener('change', listener) : mql.addListener(listener)
    return () => { mql.removeEventListener ? mql.removeEventListener('change', listener) : mql.removeListener(listener) }
  }, [])

  const mnrToReceive = useMemo(() => {
    const usd = parseFloat(usdAmount || "0")
    if (!rateUsdPerMnr || rateUsdPerMnr <= 0) return 0
    return usd / rateUsdPerMnr
  }, [usdAmount, rateUsdPerMnr])

  const Content = (
    <>
      <p className="text-sm text-muted-foreground">Convert your USD balance into MNR at the current rate.</p>
      <div className="space-y-4 mt-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <span className="text-sm text-muted-foreground">Amount (USD)</span>
            <Input type="number" placeholder="Enter USD amount" value={usdAmount} onChange={(e) => setUsdAmount(e.target.value)} />
          </div>
          <div className="space-y-2">
            <span className="text-sm text-muted-foreground">You receive (MNR)</span>
            <div className="p-3 rounded-lg border bg-secondary/40">
              <div className="flex items-center justify-between">
                <div className="font-semibold">{mnrToReceive.toFixed(4)}</div>
                <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600"><Coins className="h-4 w-4 mr-1" />MNR</Badge>
              </div>
              <div className="text-xs text-muted-foreground mt-1">Rate: ${rateUsdPerMnr} / MNR</div>
            </div>
          </div>
        </div>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Review the amount before confirming. Conversion includes no additional fees in this demo.
          </AlertDescription>
        </Alert>
      </div>
      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
        <Button onClick={onConfirm}>Buy MNR</Button>
      </div>
    </>
  )

  if (!isDesktop) {
    return (
      <BottomSheet open={open} onOpenChange={onOpenChange} title="Buy MNR">
        {Content}
      </BottomSheet>
    )
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="sm:max-w-md w-[90vw] p-0 flex flex-col">
        <SheetHeader className="px-4 pt-4">
          <SheetTitle>Buy MNR</SheetTitle>
        </SheetHeader>
        <div className="min-h-0 overflow-y-auto px-4 pb-4">
          {Content}
        </div>
      </SheetContent>
    </Sheet>
  )
}


