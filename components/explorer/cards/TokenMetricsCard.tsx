"use client"

import { Card } from "@/components/ui/card"
import { Coins } from "lucide-react"

type TokenMetricsCardProps = {
  title: string
  priceLabel: string
  supplyLabel: string
  price: string
  totalSupply: string
}

export default function TokenMetricsCard({ title, priceLabel, supplyLabel, price, totalSupply }: TokenMetricsCardProps) {
  return (
    <Card className="p-4 min-h-[160px] bg-gradient-to-br from-emerald-500 to-teal-600 text-white border-none relative w-full min-w-full sm:min-w-0 snap-start">
      <Coins className="h-20 w-20 absolute -bottom-3 -right-2 opacity-20 pointer-events-none" />
      <div className="text-base sm:text-lg leading-snug font-bold tracking-tight">{title}</div>
      <div className="mt-3 grid grid-cols-2 gap-4">
        <div>
          <div className="opacity-90 text-sm">{priceLabel}</div>
          <div className="text-3xl font-bold tracking-tight">{price}</div>
        </div>
        <div>
          <div className="opacity-90 text-sm">{supplyLabel}</div>
          <div className="text-3xl font-bold tracking-tight">{totalSupply}</div>
        </div>
      </div>
    </Card>
  )
}


