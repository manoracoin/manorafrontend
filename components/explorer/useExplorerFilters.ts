"use client"

import { useMemo, useState } from "react"

// useExplorerFilters centralizes Explorer's filter state and helpers
// without altering any business logic or default values.
export function useExplorerFilters() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedContract, setSelectedContract] = useState("All Contracts")
  const [selectedTxType, setSelectedTxType] = useState("All Types")
  const [selectedTxStatus, setSelectedTxStatus] = useState("All Status")
  const [selectedProposalStatus, setSelectedProposalStatus] = useState("All Status")
  const [sortBy, setSortBy] = useState("Newest First")
  const [dateRange, setDateRange] = useState("all")
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)

  const hasActiveFilters = useMemo(() => {
    return (
      selectedContract !== "All Contracts" ||
      selectedTxType !== "All Types" ||
      selectedTxStatus !== "All Status" ||
      selectedProposalStatus !== "All Status" ||
      dateRange !== "all"
    )
  }, [selectedContract, selectedTxType, selectedTxStatus, selectedProposalStatus, dateRange])

  const resetFilters = () => {
    setSelectedContract("All Contracts")
    setSelectedTxType("All Types")
    setSelectedTxStatus("All Status")
    setSelectedProposalStatus("All Status")
    setDateRange("all")
  }

  return {
    searchTerm, setSearchTerm,
    selectedContract, setSelectedContract,
    selectedTxType, setSelectedTxType,
    selectedTxStatus, setSelectedTxStatus,
    selectedProposalStatus, setSelectedProposalStatus,
    sortBy, setSortBy,
    dateRange, setDateRange,
    isFiltersOpen, setIsFiltersOpen,
    hasActiveFilters, resetFilters,
  }
}

export default useExplorerFilters


