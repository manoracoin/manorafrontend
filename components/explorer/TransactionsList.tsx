"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { ArrowDownLeft, ArrowUpRight, ChevronDown, ChevronRight, ChevronUp, Clock, XCircle } from "lucide-react"
import { useI18n } from "@/components/i18n-provider"
import { Button } from "@/components/ui/button"

// Transaction type used locally to mirror the page's sample data.
export interface TransactionItem {
  id: string
  // Use string to match widened literals from the page's sample data
  type: string
  from: string
  to: string
  amount: string
  value: string
  timestamp: string
  // Use string to match widened literals from the page's sample data
  status: string
  contract: string
  // Optional extended fields
  blockNumber?: number | string
  method?: string
  fee?: string
}

export interface TransactionsListProps {
  items: TransactionItem[]
}

// Stateless list that renders transactions exactly as in the page.
export function TransactionsList({ items }: TransactionsListProps) {
  const { t } = useI18n()
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})
  const toggle = (id: string) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }))
  return (
    <>
      {items.map((tx) => (
        <div
          key={tx.id}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 p-3 sm:p-4 rounded-lg border bg-card/50 hover:bg-secondary/50 transition-colors overflow-hidden"
        >
          <div className="flex items-center gap-3 sm:gap-4">
            <div className={cn(
              "p-2 rounded-full",
              tx.type === "mint" && "bg-green-500/10 text-green-500",
              tx.type === "transfer" && "bg-blue-500/10 text-blue-500",
              tx.type === "burn" && "bg-red-500/10 text-red-500"
            )}>
              {tx.type === "mint" ? (
                <ArrowDownLeft className="h-4 w-4 sm:h-5 sm:w-5" />
              ) : tx.type === "transfer" ? (
                <ArrowUpRight className="h-4 w-4 sm:h-5 sm:w-5" />
              ) : (
                <XCircle className="h-4 w-4 sm:h-5 sm:w-5" />
              )}
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-medium text-sm sm:text-base truncate max-w-[160px] sm:max-w-none">{tx.id}</p>
                <Badge variant="secondary" className="hidden sm:inline-flex">{tx.contract}</Badge>
                {tx.status === "success" ? (
                  <Badge variant="secondary" className="hidden sm:inline-flex bg-green-500/10 text-green-500">
                    Success
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="hidden sm:inline-flex bg-red-500/10 text-red-500">
                    Failed
                  </Badge>
                )}
              </div>
              <div className={cn(
                "items-center gap-2 text-sm text-muted-foreground mt-1",
                expanded[tx.id] ? "flex" : "hidden",
                "sm:flex"
              )}>
                <span>{t('explorer.from')}: {tx.from}</span>
                <ChevronRight className="h-4 w-4" />
                <span>{t('explorer.to')}: {tx.to}</span>
                <span className="hidden sm:inline">•</span>
                <span className="hidden sm:inline">{t('explorer.block')}{' '}#{tx.blockNumber ?? '—'}</span>
                <span className="hidden sm:inline">•</span>
                <span className="hidden sm:inline">{t('explorer.method')}: {tx.method ?? '—'}</span>
              </div>
            </div>
          </div>
          <div className="text-left sm:text-right">
            {/* Prima riga mobile: amount + data + toggle allineati a destra */}
            <div className="sm:hidden flex items-center justify-end gap-2">
              <p className="font-medium text-sm">{tx.amount}</p>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {new Date(tx.timestamp).toLocaleString()}
              </div>
              <Button variant="ghost" size="sm" className="h-7 px-2 text-muted-foreground -mr-2" onClick={() => toggle(tx.id)}>
                {expanded[tx.id] ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
                <span className="sr-only">{expanded[tx.id] ? t('explorer.showLess') : t('explorer.showMore')}</span>
              </Button>
            </div>

            {/* Desktop: amount e data/ora sulla stessa riga; value sotto */}
            <div className="hidden sm:flex items-center justify-end gap-3">
              <p className="font-medium">{tx.amount}</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {new Date(tx.timestamp).toLocaleString()}
              </div>
            </div>
            <p className="hidden sm:block text-sm text-muted-foreground">{tx.value}</p>
            <p className="hidden sm:block text-xs text-muted-foreground">{t('explorer.fee')}: {tx.fee ?? '—'}</p>
          </div>
        </div>
      ))}
    </>
  )
}

export default TransactionsList


