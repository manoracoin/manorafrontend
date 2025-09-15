"use client"
import React from "react"
import { useParams, useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Box, ArrowLeft, Copy, Check } from "lucide-react"
import { useI18n } from "@/components/i18n-provider"
import { explorerData, BlockItem, ContractTx } from "@/components/explorer/constants"

function useBlock(height: number) {
  const [block, setBlock] = React.useState<BlockItem | undefined>()
  React.useEffect(() => { explorerData.getBlockByHeight(height).then(setBlock) }, [height])
  return block
}

function useBlockTxs(height: number) {
  const [items, setItems] = React.useState<ContractTx[]>([])
  React.useEffect(() => { explorerData.getBlockTransactions(height).then(setItems) }, [height])
  return items
}

export default function BlockDetailPage() {
  const { t } = useI18n()
  const router = useRouter()
  const params = useParams<{ height: string }>()
  const height = Number(params.height)
  const block = useBlock(height)
  const txs = useBlockTxs(height)
  const [copied, setCopied] = React.useState(false)

  const onCopy = async () => {
    try { await navigator.clipboard.writeText(String(block?.hash || '')); setCopied(true); setTimeout(()=>setCopied(false), 1200) } catch {}
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('common.back', 'Back')}
          </Button>
          <h2 className="text-3xl font-bold tracking-tight">{t('explorer.block')} #{height}</h2>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="p-6 md:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-500"><Box className="h-5 w-5" /></div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Hash</span>
                  {block?.status && (
                    <Badge variant="secondary" className="bg-green-500/10 text-green-500">{block.status}</Badge>
                  )}
                </div>
                <div className="text-sm text-muted-foreground break-all">{block?.hash}</div>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={onCopy}>{copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}</Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div><span className="text-muted-foreground">Parent</span><div className="break-all">{block?.parentHash}</div></div>
            <div><span className="text-muted-foreground">Timestamp</span><div>{block ? new Date(block.timestamp).toLocaleString() : '—'}</div></div>
            <div><span className="text-muted-foreground">Transactions</span><div>{block?.transactions}</div></div>
            <div><span className="text-muted-foreground">Size</span><div>{block?.size}</div></div>
            <div><span className="text-muted-foreground">Gas Used</span><div>{block?.gasUsed}</div></div>
            <div><span className="text-muted-foreground">Gas Limit</span><div>{block?.gasLimit}</div></div>
            <div><span className="text-muted-foreground">Proposer</span><div>{block?.proposer}</div></div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-sm font-semibold mb-4">Transactions</h3>
          <div className="space-y-2">
            {txs.map(tx => (
              <div key={tx.id} className="p-2 rounded-lg border bg-card/50">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm">{tx.id}</span>
                  <span className="text-xs text-muted-foreground">{new Date(tx.timestamp).toLocaleString()}</span>
                </div>
                <div className="mt-1 text-sm text-muted-foreground flex items-center gap-4">
                  <span>Method: {tx.method}</span>
                  <span>From: {tx.from}</span>
                  <span>To: {tx.to}</span>
                  <span>Value: {tx.value}</span>
                </div>
              </div>
            ))}
            {txs.length === 0 && <div className="text-sm text-muted-foreground">No transactions.</div>}
          </div>
        </Card>
      </div>
    </div>
  )
}


