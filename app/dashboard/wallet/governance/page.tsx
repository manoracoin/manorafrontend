"use client"

import { useEffect, useMemo, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Calendar, AlertCircle } from "lucide-react"
import ProposalsList from "@/components/explorer/ProposalsList"

// Clone minimale della sezione Governance da Explorer, senza KPI/blocks/contracts

const proposals = [
  { id: 1, title: "Upgrade Property Management System", description: "Proposal to upgrade the current property management system with enhanced features", contract: "LuxuryDowntownApartment", status: "active", votes: { for: 75, against: 25, abstain: 10 }, endTime: "2024-04-01T00:00:00", quorum: 100, creator: "0xabcd...efgh" },
  { id: 2, title: "Implement New Security Measures", description: "Add additional security features to protect token holders", contract: "ModernOfficeComplex", status: "passed", votes: { for: 120, against: 30, abstain: 5 }, endTime: "2024-03-15T00:00:00", quorum: 100, creator: "0x2468...1357" },
  { id: 3, title: "Quarterly Dividend Distribution", description: "Proposal for Q1 2024 dividend distribution schedule", contract: "WaterfrontResidence", status: "failed", votes: { for: 45, against: 65, abstain: 15 }, endTime: "2024-03-10T00:00:00", quorum: 100, creator: "0x8642...9753" },
]

const contracts = ["All Contracts", "LuxuryDowntownApartment", "ModernOfficeComplex", "WaterfrontResidence"]
const proposalStatus = ["All Status", "active", "passed", "failed"]
const sortOptions = ["Newest First", "Oldest First", "Value: High to Low", "Value: Low to High"]

export default function WalletGovernancePage() {
  const [mounted, setMounted] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedContract, setSelectedContract] = useState("All Contracts")
  const [selectedProposalStatus, setSelectedProposalStatus] = useState("All Status")
  const [sortBy, setSortBy] = useState("Newest First")

  const [showCreateProposalDialog, setShowCreateProposalDialog] = useState(false)
  const [proposalFormData, setProposalFormData] = useState({
    title: "",
    description: "",
    contract: "",
    endTime: "",
    quorum: ""
  })

  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  const filteredProposals = proposals.filter((proposal) => {
    const matchesSearch = proposal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proposal.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesContract = selectedContract === "All Contracts" || proposal.contract === selectedContract
    const matchesStatus = selectedProposalStatus === "All Status" || proposal.status === selectedProposalStatus
    return matchesSearch && matchesContract && matchesStatus
  })

  const resetFilters = () => {
    setSelectedContract("All Contracts")
    setSelectedProposalStatus("All Status")
    setSortBy("Newest First")
    setSearchTerm("")
  }

  const handleCreateProposal = () => {
    // mock submit
    setShowCreateProposalDialog(false)
    setProposalFormData({ title: "", description: "", contract: "", endTime: "", quorum: "" })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Governance</h2>
        <div className="flex gap-2">
          <Input
            placeholder="Search proposals"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-56"
          />
          <Select value={selectedContract} onValueChange={setSelectedContract}>
            <SelectTrigger className="w-48"><SelectValue placeholder="Contract" /></SelectTrigger>
            <SelectContent>
              {contracts.map(c => (<SelectItem key={c} value={c}>{c}</SelectItem>))}
            </SelectContent>
          </Select>
          <Select value={selectedProposalStatus} onValueChange={setSelectedProposalStatus}>
            <SelectTrigger className="w-40"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              {proposalStatus.map(s => (<SelectItem key={s} value={s}>{s}</SelectItem>))}
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-44"><SelectValue placeholder="Sort" /></SelectTrigger>
            <SelectContent>
              {sortOptions.map(o => (<SelectItem key={o} value={o}>{o}</SelectItem>))}
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={resetFilters}>Reset</Button>
        </div>
      </div>

      <Card className="p-6">
        <Tabs value="governance" className="space-y-6">
          <TabsContent value="governance" className="space-y-4">
            <ProposalsList
              items={filteredProposals}
              selectedContract={selectedContract}
              selectedProposalStatus={selectedProposalStatus}
              onCreate={() => setShowCreateProposalDialog(true)}
            />
          </TabsContent>
        </Tabs>
      </Card>

      <Dialog open={showCreateProposalDialog} onOpenChange={setShowCreateProposalDialog}>
        <DialogContent className="max-w-lg w-[95vw]">
          <DialogHeader>
            <DialogTitle>Create New Proposal</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Title</h4>
              <Input placeholder="Enter proposal title" value={proposalFormData.title} onChange={(e) => setProposalFormData(prev => ({ ...prev, title: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Description</h4>
              <Textarea placeholder="Enter proposal description" value={proposalFormData.description} onChange={(e) => setProposalFormData(prev => ({ ...prev, description: e.target.value }))} className="min-h-[100px]" />
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Contract</h4>
              <Select value={proposalFormData.contract} onValueChange={(value) => setProposalFormData(prev => ({ ...prev, contract: value }))}>
                <SelectTrigger><SelectValue placeholder="Select contract" /></SelectTrigger>
                <SelectContent>
                  {contracts.filter(c => c !== "All Contracts").map(contract => (
                    <SelectItem key={contract} value={contract}>{contract}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="text-sm font-medium">End Date</h4>
                <div className="relative">
                  <Calendar className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input type="datetime-local" className="pl-8" value={proposalFormData.endTime} onChange={(e) => setProposalFormData(prev => ({ ...prev, endTime: e.target.value }))} />
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Quorum</h4>
                <Input type="number" placeholder="Enter quorum" value={proposalFormData.quorum} onChange={(e) => setProposalFormData(prev => ({ ...prev, quorum: e.target.value }))} />
              </div>
            </div>
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>Once created, proposals cannot be modified. Please review all details carefully.</AlertDescription>
            </Alert>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateProposalDialog(false)}>Cancel</Button>
            <Button onClick={handleCreateProposal}>Create Proposal</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}


