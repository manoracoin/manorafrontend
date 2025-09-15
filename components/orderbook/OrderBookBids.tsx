"use client"

import { Button } from "@/components/ui/button"
import { useMemo, useState } from "react"
import { Input } from "@/components/ui/input"

export interface OrderItem {
  id: string
  price: number
  amount: number
  user: string
}

interface Props {
  bids: OrderItem[]
  onClick: (order: OrderItem) => void
  defaultVisible?: number
  onCreate?: (order: { price: number; amount: number }) => void
  symbol?: string
}

export default function OrderBookBids({ bids, onClick, defaultVisible = 5, onCreate, symbol }: Props) {
  const nf = new Intl.NumberFormat('en-US')
  const [expanded, setExpanded] = useState(false)
  const visibleBids = useMemo(() => expanded ? bids : bids.slice(0, defaultVisible), [expanded, bids, defaultVisible])
  const [showForm, setShowForm] = useState(false)
  const [price, setPrice] = useState<string>("")
  const [amount, setAmount] = useState<string>("")
  const isValid = !!price && !!amount && Number(price) > 0 && Number(amount) > 0
  const computedTotal = (Number(price) || 0) * (Number(amount) || 0)
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="grid grid-cols-4 text-[11px] uppercase tracking-wide text-muted-foreground bg-muted/30 rounded-md px-3 py-2">
        <span className="text-left">Price</span>
        <span className="text-center">Amount</span>
        <span className="text-center">Total</span>
        <span className="text-right">User</span>
      </div>

      {/* Rows */}
      <div className="space-y-1">
        {visibleBids.map((bid) => (
          <div
            key={bid.id}
            className="grid grid-cols-[1fr,auto] gap-2 p-2 rounded-md border bg-card/50 hover:bg-secondary/50 transition-colors"
          >
            <div className="grid grid-cols-4 items-center text-sm font-mono tabular-nums">
              <span className="text-right text-green-600 pr-2">${bid.price}</span>
              <span className="text-center">{bid.amount}</span>
              <span className="text-center text-muted-foreground">${nf.format(bid.price * bid.amount)}</span>
              <span className="text-right text-xs text-muted-foreground">{bid.user}</span>
            </div>
            <Button
              size="sm"
              variant="secondary"
              className="bg-red-500/10 text-red-600 hover:bg-red-500/20"
              onClick={() => onClick(bid)}
            >
              Sell
            </Button>
          </div>
        ))}
      </div>

      {bids.length > defaultVisible && (
        <div className="pt-1">
          <Button variant="ghost" size="sm" onClick={() => setExpanded((v) => !v)} className="w-full text-muted-foreground hover:text-foreground">
            {expanded ? "Show less" : `Show more (${bids.length - defaultVisible})`}
          </Button>
        </div>
      )}

      {/* Custom buy order */}
      <div className="pt-3 border-t">
        {!showForm ? (
          <Button variant="outline" size="sm" className="w-full" onClick={() => setShowForm(true)}>
            Add custom buy order {symbol ? `for ${symbol}` : ""}
          </Button>
        ) : (
          <div className="space-y-3 rounded-md border bg-muted/20 p-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted-foreground">Price</label>
                <Input value={price} onChange={(e) => setPrice(e.target.value)} type="number" placeholder="250" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Amount</label>
                <Input value={amount} onChange={(e) => setAmount(e.target.value)} type="number" placeholder="100" />
              </div>
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Estimated total</span>
              <span className="font-medium">${nf.format(computedTotal)}</span>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                disabled={!isValid}
                onClick={() => {
                  if (!isValid) return
                  onCreate?.({ price: Number(price), amount: Number(amount) })
                  setPrice("")
                  setAmount("")
                  setShowForm(false)
                }}
              >
                Place Buy Order
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
