"use client"

import { useEffect, useMemo, useState } from "react"
import BottomSheet from "@/components/ui/BottomSheet"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Coins, AlertCircle, DollarSign } from "lucide-react"

export interface TradeMnrPanelProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: 'buy' | 'sell'
  mnrAmount: string
  setMnrAmount: (value: string) => void
  rateUsdPerMnr: number
  onConfirm: () => void
}

export default function TradeMnrPanel({ open, onOpenChange, mode, mnrAmount, setMnrAmount, rateUsdPerMnr, onConfirm }: TradeMnrPanelProps) {
  const [isDesktop, setIsDesktop] = useState(false)
  useEffect(() => {
    const mql = window.matchMedia('(min-width: 640px)')
    const listener = (e: MediaQueryListEvent) => setIsDesktop(e.matches)
    setIsDesktop(mql.matches)
    mql.addEventListener ? mql.addEventListener('change', listener) : mql.addListener(listener)
    return () => { mql.removeEventListener ? mql.removeEventListener('change', listener) : mql.removeListener(listener) }
  }, [])

  const usdEquivalent = useMemo(() => {
    const mnr = parseFloat(mnrAmount || "0")
    return isFinite(mnr) ? mnr * rateUsdPerMnr : 0
  }, [mnrAmount, rateUsdPerMnr])

  const title = mode === 'buy' ? 'Buy MNR (use Fiat Wallet)' : 'Sell MNR (to Fiat Wallet)'
  const confirmLabel = mode === 'buy' ? 'Buy MNR' : 'Sell MNR'

  const Content = (
    <>
      <p className="text-sm text-muted-foreground">
        {mode === 'buy' ? 'Convert USD from your Fiat Wallet into MNR.' : 'Convert your MNR into USD and credit the Fiat Wallet.'}
      </p>
      <div className="space-y-4 mt-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <span className="text-sm text-muted-foreground">Amount (MNR)</span>
            <Input type="number" placeholder="Enter MNR" value={mnrAmount} onChange={(e) => setMnrAmount(e.target.value)} />
          </div>
          <div className="space-y-2">
            <span className="text-sm text-muted-foreground">{mode==='buy' ? 'You will pay' : 'You will receive'} (USD)</span>
            <div className="p-3 rounded-lg border bg-secondary/40">
              <div className="flex items-center justify-between">
                <div className="font-semibold">${usdEquivalent.toFixed(2)}</div>
                <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 flex items-center"><DollarSign className="h-4 w-4 mr-1" />USD</Badge>
              </div>
              <div className="text-xs text-muted-foreground mt-1">Rate: ${rateUsdPerMnr} / MNR</div>
            </div>
          </div>
        </div>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            This is a demo flow. Balances are not updated server-side.
          </AlertDescription>
        </Alert>
      </div>
      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
        <Button onClick={onConfirm}>{confirmLabel}</Button>
      </div>
    </>
  )

  if (!isDesktop) {
    return (
      <BottomSheet open={open} onOpenChange={onOpenChange} title={title}>
        {Content}
      </BottomSheet>
    )
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="sm:max-w-md w-[90vw] p-0 flex flex-col">
        <SheetHeader className="px-4 pt-4">
          <SheetTitle>{title}</SheetTitle>
        </SheetHeader>
        <div className="min-h-0 overflow-y-auto px-4 pb-4">
          {Content}
        </div>
      </SheetContent>
    </Sheet>
  )
}


