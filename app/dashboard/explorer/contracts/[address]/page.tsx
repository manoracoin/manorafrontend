"use client"
import React from "react"
import { useParams, useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileCode, ArrowLeft, Copy, Check } from "lucide-react"
import { useI18n } from "@/components/i18n-provider"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { explorerData, ContractEvent, ContractTx, HolderItem } from "@/components/explorer/constants"

// Mock: in futuro preleva ABI/eventi da API/indicizzatore
const contractsMap: Record<string, any> = {
  "0xA1b2...C3d4": { name: "LuxuryDowntownApartment", status: "active", type: "Token", verified: true },
  "0xD5e6...F7g8": { name: "ModernOfficeComplex", status: "active", type: "Governance", verified: true },
  "0x9A0b...1C2d": { name: "WaterfrontResidence", status: "paused", type: "Treasury", verified: false },
}

function useContractAbi(address: string) {
  const [abi, setAbi] = React.useState<string>("[]")
  React.useEffect(() => { explorerData.getContractAbi(address).then(setAbi) }, [address])
  return abi
}

function useContractEvents(address: string) {
  const [items, setItems] = React.useState<ContractEvent[]>([])
  React.useEffect(() => { explorerData.getContractEvents(address).then(setItems) }, [address])
  return items
}

function useContractTxs(address: string) {
  const [items, setItems] = React.useState<ContractTx[]>([])
  React.useEffect(() => { explorerData.getContractTransactions(address).then(setItems) }, [address])
  return items
}

function useHolders(address: string) {
  const [items, setItems] = React.useState<HolderItem[]>([])
  React.useEffect(() => { explorerData.getHolders(address).then(setItems) }, [address])
  return items
}

export default function ContractDetailPage() {
  const { t } = useI18n()
  const router = useRouter()
  const params = useParams<{ address: string }>()
  const address = decodeURIComponent(params.address)
  const data = contractsMap[address] || { name: address, status: "active", type: "Token", verified: false }
  const [copied, setCopied] = React.useState(false)
  const recentEvents = useContractEvents(address)
  const abi = useContractAbi(address)
  const txs = useContractTxs(address)
  const holders = useHolders(address)

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(address)
      setCopied(true)
      setTimeout(() => setCopied(false), 1200)
    } catch {}
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('common.back', 'Back')}
          </Button>
          <h2 className="text-3xl font-bold tracking-tight">{data.name}</h2>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="p-6 md:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600"><FileCode className="h-5 w-5" /></div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{data.name}</span>
                  <Badge variant="secondary" className={
                    data.status === 'active' ? 'bg-green-500/10 text-green-500' :
                    data.status === 'paused' ? 'bg-yellow-500/10 text-yellow-500' :
                    'bg-muted text-foreground'
                  }>{data.status}</Badge>
                </div>
                <div className="text-sm text-muted-foreground">{data.type} • {address}</div>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={onCopy}>{copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}</Button>
          </div>

          <Tabs defaultValue="abi" className="mt-2">
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="abi">ABI</TabsTrigger>
              <TabsTrigger value="events">Events</TabsTrigger>
              <TabsTrigger value="holders">Holders</TabsTrigger>
              <TabsTrigger value="txs">Transactions</TabsTrigger>
            </TabsList>
            <TabsContent value="abi" className="mt-3">
              <pre className="bg-muted p-3 rounded-md overflow-auto text-xs">{abi}</pre>
            </TabsContent>
            <TabsContent value="events" className="mt-3">
              <div className="space-y-2">
                {recentEvents.map(e => (
                  <div key={e.id} className="flex items-center justify-between p-2 rounded-lg border bg-card/50">
                    <div className="space-y-0.5">
                      <div className="font-medium">{e.name}</div>
                      <div className="text-xs text-muted-foreground">{e.tx}</div>
                    </div>
                    <div className="text-xs text-muted-foreground">{new Date(e.time).toLocaleString()}</div>
                  </div>
                ))}
                {recentEvents.length === 0 && (
                  <div className="text-sm text-muted-foreground">No events.</div>
                )}
              </div>
            </TabsContent>
            <TabsContent value="holders" className="mt-3">
              <div className="space-y-2">
                {holders.map(h => (
                  <div key={h.address} className="flex items-center justify-between p-2 rounded-lg border bg-card/50">
                    <span className="font-mono text-sm">{h.address}</span>
                    <span className="text-sm">{h.balance}</span>
                  </div>
                ))}
                {holders.length === 0 && (
                  <div className="text-sm text-muted-foreground">No holders.</div>
                )}
              </div>
            </TabsContent>
            <TabsContent value="txs" className="mt-3">
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
                {txs.length === 0 && (
                  <div className="text-sm text-muted-foreground">No transactions.</div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </Card>

        <Card className="p-6">
          <h3 className="text-sm font-semibold mb-4">{t('contracts.lastEvent')}</h3>
          <div className="space-y-3">
            {recentEvents.map(e => (
              <div key={e.id} className="flex items-center justify-between p-2 rounded-lg border bg-card/50">
                <div className="space-y-0.5">
                  <div className="font-medium">{e.name}</div>
                  <div className="text-xs text-muted-foreground">{e.tx}</div>
                </div>
                <div className="text-xs text-muted-foreground">{new Date(e.time).toLocaleString()}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}


