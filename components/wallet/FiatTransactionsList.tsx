"use client"

import React from "react"
import Image from "next/image"
import { ArrowDownLeft, ArrowUpRight, Banknote, ChevronRight } from "lucide-react"
import type { FiatTx } from "@/components/wallet/fiatData"

export default function FiatTransactionsList({
  transactions,
}: {
  transactions: FiatTx[]
}) {
  const [expanded, setExpanded] = React.useState<Record<string, boolean>>({})

  const timeFmt = React.useMemo(() => new Intl.DateTimeFormat(undefined, { hour: '2-digit', minute: '2-digit' }), [])
  const dateKey = (d: Date) => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
  const dayLabel = (d: Date) => {
    const today = new Date()
    const yest = new Date(today)
    yest.setDate(today.getDate()-1)
    const dk = dateKey(d)
    if (dk === dateKey(today)) return 'Today'
    if (dk === dateKey(yest)) return 'Yesterday'
    return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(d)
  }

  const groups = React.useMemo(() => {
    const items = transactions
    const orderKeys: string[] = []
    const keyToData: Record<string, { label: string, items: typeof items, net: number }> = {}
    for (const tx of items) {
      const d = new Date(tx.timestamp)
      const k = dateKey(d)
      if (!keyToData[k]) {
        orderKeys.push(k)
        keyToData[k] = { label: dayLabel(d), items: [] as any, net: 0 }
      }
      keyToData[k].items.push(tx)
      const delta = (tx.type === 'deposit' || tx.type === 'sell') ? tx.amount : -tx.amount
      keyToData[k].net += delta
    }
    return orderKeys.map(k => keyToData[k])
  }, [transactions])

  const toggleExpand = (id: string) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }))

  return (
    <div className="space-y-2">
      {groups.map((group) => (
        <div key={group.label} className="space-y-2">
          <div className="flex items-center gap-2 px-3 py-1 text-xs uppercase text-muted-foreground">
            <span>{group.label}</span>
            <span className={group.net > 0 ? 'text-green-600' : group.net < 0 ? 'text-red-600' : ''}>
              {group.net > 0 ? `+$${group.net.toLocaleString()}` : group.net < 0 ? `-$${Math.abs(group.net).toLocaleString()}` : '$0'}
            </span>
          </div>
          {group.items.map((tx) => (
            <div key={tx.id} className="p-3 rounded-lg bg-card/50">
              <div className="cursor-pointer" onClick={() => toggleExpand(tx.id)}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {tx.type==='buy' || tx.type==='sell' ? (
                      <div className="flex items-center gap-1">
                        {tx.type==='sell' ? (
                          <div className={`h-7 w-7 rounded-full flex items-center justify-center bg-teal-500/10 text-teal-600`}>
                            <div className="relative h-4 w-4">
                              <Image src="https://appoostobio.com/uploads/block_images/ec56e1051238fbf784ff56698ec327aa.png" alt="Manora" fill className="object-contain rounded-full" />
                            </div>
                          </div>
                        ) : (
                          <div className={`h-7 w-7 rounded-full flex items-center justify-center bg-emerald-500/10 text-emerald-600`}>
                            <Banknote className="h-4 w-4" />
                          </div>
                        )}
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        {tx.type==='sell' ? (
                          <div className={`h-7 w-7 rounded-full flex items-center justify-center bg-emerald-500/10 text-emerald-600`}>
                            <Banknote className="h-4 w-4" />
                          </div>
                        ) : (
                          <div className={`h-7 w-7 rounded-full flex items-center justify-center bg-teal-500/10 text-teal-600`}>
                            <div className="relative h-4 w-4">
                              <Image src="https://appoostobio.com/uploads/block_images/ec56e1051238fbf784ff56698ec327aa.png" alt="Manora" fill className="object-contain rounded-full" />
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className={
                        `h-7 w-7 rounded-full flex items-center justify-center ${
                          tx.type==='deposit' ? 'bg-green-500/10 text-green-600' :
                          tx.type==='withdraw' ? 'bg-blue-500/10 text-blue-600' :
                          'bg-emerald-500/10 text-emerald-600'
                        }`
                      }>
                        {tx.type==='deposit' && (<ArrowDownLeft className="h-4 w-4" />)}
                        {tx.type==='withdraw' && (<ArrowUpRight className="h-4 w-4" />)}
                      </div>
                    )}
                    <span className="text-xs text-muted-foreground">{timeFmt.format(new Date(tx.timestamp))}</span>
                  </div>
                  <div className="text-sm font-medium">
                    {tx.type==='buy' ? (
                      <span>
                        <span className="text-red-600">-{`$${tx.amount.toLocaleString()}`}</span>
                        <span> / </span>
                        <span className="text-green-600">+{`${tx.mnrAmount?.toLocaleString()} MNR`}</span>
                      </span>
                    ) : tx.type==='sell' ? (
                      <span>
                        <span className="text-green-600">+{`$${tx.amount.toLocaleString()}`}</span>
                        <span> / </span>
                        <span className="text-red-600">-{`${tx.mnrAmount?.toLocaleString()} MNR`}</span>
                      </span>
                    ) : (
                      <span className={tx.type==='deposit' ? 'text-green-600' : 'text-red-600'}>
                        {tx.type==='deposit' ? `+$${tx.amount.toLocaleString()}` : `-$${tx.amount.toLocaleString()}`}
                      </span>
                    )}
                  </div>
                </div>
                {expanded[tx.id] && (
                  <div className="mt-2 space-y-1">
                    <div className="font-mono text-xs break-all">{tx.id}</div>
                    <div className="text-sm truncate">{tx.from} → {tx.to}</div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ))}
      {transactions.length === 0 && (
        <div className="text-sm text-muted-foreground">No fiat transactions.</div>
      )}
    </div>
  )
}


