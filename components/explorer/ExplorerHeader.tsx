"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { BarChart3, SlidersHorizontal, ArrowUpDown, Search, X } from "lucide-react"

export interface ExplorerHeaderProps {
  title?: string
  onAnalyticsClick?: () => void
  onFiltersClick?: () => void
  activeFiltersCount?: number
  onSortClick?: () => void
  sortActive?: boolean
  onSearchClick?: () => void
  searchOpen?: boolean
  searchValue?: string
  onSearchChange?: (value: string) => void
  onSearchReset?: () => void
  onSearchSubmit?: () => void
  activeTab?: 'transactions'
  onChangeTab?: (value: 'transactions') => void
}

// ExplorerHeader renders the page title and the actions row.
// Markup and classes are copied 1:1 from the page to avoid any visual change.
export function ExplorerHeader({ title = "Explorer", onAnalyticsClick, onFiltersClick, activeFiltersCount = 0, onSortClick, sortActive = false, onSearchClick, searchOpen = false, searchValue = "", onSearchChange, onSearchReset, onSearchSubmit, activeTab = 'transactions', onChangeTab }: ExplorerHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:gap-2 pt-1">
      {/* Row 1: Title + Tab toggle aligned right (mobile and desktop) */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
          <Link href="/dashboard/node">
            <Button size="sm" variant="outline">Node</Button>
          </Link>
        </div>
        <div className="flex items-center">
          {/* Mobile toggle removed: only Transactions remain */}
          {/* Desktop toggle removed: only Transactions remain */}
        </div>
      </div>
      {/* Row 2: Icons removed on mobile per request */}
      {/* Mobile-only search bar shown below the icons when toggled */}
      {activeTab === 'transactions' && searchOpen && (
        <div className="w-full md:hidden">
          <div className="mt-2 flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by hash, address, or contract..."
                className="pl-8"
                value={searchValue}
                onChange={(e) => onSearchChange?.(e.target.value)}
              />
              {searchValue && (
                <button
                  type="button"
                  aria-label="Clear search"
                  className="absolute right-2 top-2.5 p-1 rounded-full hover:bg-muted/60"
                  onClick={onSearchReset}
                >
                  <X className="h-4 w-4 text-muted-foreground" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ExplorerHeader


