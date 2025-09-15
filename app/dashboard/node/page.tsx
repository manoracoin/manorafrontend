"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Server,
  Activity,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Network,
  Cpu,
  HardDrive,
  MemoryStick as Memory,
  Gauge,
  Users,
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  BarChart3,
  Shield,
  Power,
  RefreshCw,
  Settings,
  Terminal,
  Info
} from "lucide-react"

// Sample data - In a real app, this would come from an API
const nodeInfo = {
  id: "node_01a2b3c4",
  status: "active",
  version: "v1.2.3",
  uptime: "99.98%",
  lastSeen: "2024-03-21T15:30:00",
  networkLatency: "45ms",
  peers: 128,
  blocksValidated: 1458923,
  stakingAmount: "250,000 MNR",
  rewards: "12,500 MNR",
  performance: {
    cpu: 45,
    memory: 62,
    disk: 38,
    network: 55
  },
  recentBlocks: [
    {
      height: 1458923,
      timestamp: "2024-03-21T15:29:45",
      transactions: 156,
      size: "1.2 MB",
      status: "validated"
    },
    {
      height: 1458922,
      timestamp: "2024-03-21T15:29:30",
      transactions: 143,
      size: "1.1 MB",
      status: "validated"
    },
    {
      height: 1458921,
      timestamp: "2024-03-21T15:29:15",
      transactions: 168,
      size: "1.3 MB",
      status: "validated"
    }
  ],
  recentEvents: [
    {
      id: 1,
      type: "info",
      message: "New block validated #1458923",
      timestamp: "2024-03-21T15:29:45"
    },
    {
      id: 2,
      type: "warning",
      message: "High network latency detected",
      timestamp: "2024-03-21T15:28:30"
    },
    {
      id: 3,
      type: "success",
      message: "Staking rewards distributed",
      timestamp: "2024-03-21T15:27:15"
    }
  ]
}

export default function NodePage() {
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = () => {
    setIsRefreshing(true)
    // Simulate refresh
    setTimeout(() => {
      setIsRefreshing(false)
    }, 1000)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-1 w-full">
          <div className="flex items-center gap-3 justify-between sm:justify-start">
            <div className="flex items-center gap-3">
              <h2 className="text-3xl font-bold tracking-tight">Validator Node</h2>
              <Link href="/dashboard/explorer">
                <Button size="sm" variant="outline">Explorer</Button>
              </Link>
            </div>
            {/* Desktop actions on the right */}
            <div className="hidden sm:flex items-center gap-2">
              <Button variant="outline" onClick={handleRefresh}>
                <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
                Refresh
              </Button>
              <Button variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button variant="outline">
                <Terminal className="h-4 w-4 mr-2" />
                Console
              </Button>
            </div>
          </div>
          <p className="hidden sm:block text-muted-foreground">
            Monitor and manage your validator node
          </p>
          {/* Mobile actions row (icons only) */}
          <div className="mt-2 flex items-center gap-2 sm:hidden">
            <Button variant="outline" size="icon" aria-label="Refresh" onClick={handleRefresh}>
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
            </Button>
            <Button variant="outline" size="icon" aria-label="Settings">
              <Settings className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" aria-label="Console">
              <Terminal className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Node Status Overview */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Server className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Node ID</p>
              <p className="font-mono text-xl">{nodeInfo.id}</p>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <Badge 
              variant="secondary" 
              className="bg-green-500/10 text-green-500"
            >
              <Activity className="h-3 w-3 mr-1" />
              Active
            </Badge>
            <Badge variant="secondary">v{nodeInfo.version}</Badge>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Staking Amount</p>
              <p className="text-xl font-bold">{nodeInfo.stakingAmount}</p>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-muted-foreground">Total Rewards</p>
            <p className="font-medium">{nodeInfo.rewards}</p>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Network className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Network Status</p>
              <div className="flex items-center gap-2">
                <p className="text-xl font-bold">{nodeInfo.peers}</p>
                <p className="text-sm text-muted-foreground">peers</p>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-muted-foreground">Latency</p>
            <p className="font-medium">{nodeInfo.networkLatency}</p>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Activity className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Uptime</p>
              <p className="text-xl font-bold">{nodeInfo.uptime}</p>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-muted-foreground">Last Seen</p>
            <p className="font-medium">
              {new Date(nodeInfo.lastSeen).toLocaleString()}
            </p>
          </div>
        </Card>
      </div>

      {/* Performance Metrics */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-6">System Performance</h3>
        <div className="grid gap-6 md:grid-cols-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">CPU Usage</span>
              <span className="font-medium">{nodeInfo.performance.cpu}%</span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary rounded-full"
                style={{ width: `${nodeInfo.performance.cpu}%` }}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Memory Usage</span>
              <span className="font-medium">{nodeInfo.performance.memory}%</span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary rounded-full"
                style={{ width: `${nodeInfo.performance.memory}%` }}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Disk Usage</span>
              <span className="font-medium">{nodeInfo.performance.disk}%</span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary rounded-full"
                style={{ width: `${nodeInfo.performance.disk}%` }}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Network Usage</span>
              <span className="font-medium">{nodeInfo.performance.network}%</span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary rounded-full"
                style={{ width: `${nodeInfo.performance.network}%` }}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Recent Activity */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Blocks</h3>
          <div className="space-y-4">
            {nodeInfo.recentBlocks.map((block) => (
              <div 
                key={block.height}
                className="flex items-center justify-between p-4 rounded-lg border bg-card/50"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Block #{block.height}</span>
                    <Badge variant="secondary" className="bg-green-500/10 text-green-500">
                      Validated
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{block.transactions} txs</span>
                    <span>{block.size}</span>
                  </div>
                </div>
                <div className="text-right text-sm text-muted-foreground">
                  {new Date(block.timestamp).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Events</h3>
          <div className="space-y-4">
            {nodeInfo.recentEvents.map((event) => (
              <div 
                key={event.id}
                className="flex items-start gap-4 p-4 rounded-lg border bg-card/50"
              >
                <div className={`p-2 rounded-full flex-shrink-0 ${
                  event.type === "success" ? "bg-green-500/10 text-green-500" :
                  event.type === "warning" ? "bg-yellow-500/10 text-yellow-500" :
                  "bg-blue-500/10 text-blue-500"
                }`}>
                  {event.type === "success" ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : event.type === "warning" ? (
                    <AlertCircle className="h-4 w-4" />
                  ) : (
                    <Info className="h-4 w-4" />
                  )}
                </div>
                <div className="flex-1 space-y-1">
                  <p className="font-medium">{event.message}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(event.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}