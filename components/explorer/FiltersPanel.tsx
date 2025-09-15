"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ChevronDown, ChevronUp, Filter } from "lucide-react"
import { cn } from "@/lib/utils"

// FiltersPanel encapsulates the collapsible filters toolbar used in Explorer.
// It receives the filter state and callbacks from the parent to avoid duplicating logic.
// Styling and layout are copied 1:1 from the original page to ensure no visual changes.
export interface FiltersPanelProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  hasActiveFilters: boolean
  onReset: () => void
  // When true, hides the internal trigger; useful when an external button toggles the panel
  hideTrigger?: boolean
  // When true, forces single-column layout even on desktop (useful inside dialogs)
  forceSingleColumn?: boolean
  // When true, hides the Reset button (desktop page already has reset elsewhere)
  hideReset?: boolean
  // When true, hides the header row (icon/title/active/reset/toggle)
  hideHeader?: boolean

  contracts: string[]
  transactionTypes: string[]
  transactionStatus: string[]
  proposalStatus: string[]

  selectedContract: string
  setSelectedContract: (value: string) => void
  selectedTxType: string
  setSelectedTxType: (value: string) => void
  selectedTxStatus: string
  setSelectedTxStatus: (value: string) => void
  selectedProposalStatus: string
  setSelectedProposalStatus: (value: string) => void
  dateRange: string
  setDateRange: (value: string) => void
}

export function FiltersPanel(props: FiltersPanelProps) {
  const activeCount = [
    props.selectedContract !== "All Contracts",
    props.selectedTxType !== "All Types",
    props.selectedTxStatus !== "All Status",
    props.selectedProposalStatus !== "All Status",
  ].filter(Boolean).length

  return (
    <Collapsible open={props.isOpen} onOpenChange={props.onOpenChange}>
      {/* Header bar: icon + title + active badge + reset + toggle */}
      {!props.hideHeader && (
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <h3 className="font-medium">Filters</h3>
            {(props.hasActiveFilters || activeCount > 0) && (
              <Badge variant="secondary" className="ml-2">
                {activeCount} active
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2 ml-auto">
            {!props.hideReset && (props.hasActiveFilters || activeCount > 0) && (
              <Button
                variant="destructive"
                size="sm"
                className="rounded-full px-3 py-1"
                onClick={props.onReset}
              >
                Reset
              </Button>
            )}
            {!props.hideTrigger && (
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm">
                  {props.isOpen ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
            )}
          </div>
        </div>
      )}

      {/* Content: responsive grid of filter controls */}
      <CollapsibleContent className="space-y-4">
        <div className={cn("grid gap-4", props.forceSingleColumn ? "grid-cols-1" : "grid-cols-1 md:grid-cols-3") }>
          {/* Contract selector */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Contract</h4>
            <Select value={props.selectedContract} onValueChange={props.setSelectedContract}>
              <SelectTrigger>
                <SelectValue placeholder="Select contract" />
              </SelectTrigger>
              <SelectContent>
                {props.contracts.map((contract) => (
                  <SelectItem key={contract} value={contract}>
                    {contract}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Transaction type selector */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Transaction Type</h4>
            <Select value={props.selectedTxType} onValueChange={props.setSelectedTxType}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {props.transactionTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Transaction status selector */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Transaction Status</h4>
            <Select value={props.selectedTxStatus} onValueChange={props.setSelectedTxStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {props.transactionStatus.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Proposal status selector */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Proposal Status</h4>
            <Select value={props.selectedProposalStatus} onValueChange={props.setSelectedProposalStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {props.proposalStatus.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date range selector (kept simple to mirror current behavior) */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Date Range</h4>
            <Select value={props.dateRange} onValueChange={props.setDateRange}>
              <SelectTrigger>
                <SelectValue placeholder="Select date range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="24h">Last 24 Hours</SelectItem>
                <SelectItem value="7d">Last 7 Days</SelectItem>
                <SelectItem value="30d">Last 30 Days</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}

export default FiltersPanel


