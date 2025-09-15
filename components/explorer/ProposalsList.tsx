"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Plus } from "lucide-react"

export interface ProposalItem {
  id: number
  title: string
  description: string
  contract: string
  // Use string to align with page sample data typing
  status: string
  votes: { for: number; against: number; abstain: number }
  endTime: string
  quorum: number
  creator: string
}

export interface ProposalsListProps {
  items: ProposalItem[]
  selectedContract: string
  selectedProposalStatus: string
  onCreate?: () => void
}

// Stateless list that renders proposals exactly like the original page.
export function ProposalsList({ items, selectedContract, selectedProposalStatus, onCreate }: ProposalsListProps) {
  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div className="flex gap-2 flex-wrap">
          <Badge variant="outline" className="cursor-pointer hover:bg-secondary">
            {selectedContract}
          </Badge>
          {selectedProposalStatus !== "All Status" && (
            <Badge variant="outline" className="cursor-pointer hover:bg-secondary">
              {selectedProposalStatus}
            </Badge>
          )}
        </div>
        <Button onClick={onCreate} className="whitespace-nowrap w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Create Proposal
        </Button>
      </div>

      {items.map((proposal) => (
        <Card key={proposal.id} className="p-6">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <div className="flex flex-wrap items-center gap-2 min-w-0">
                  <h3 className="text-lg font-semibold break-words">{proposal.title}</h3>
                  <Badge variant="secondary">{proposal.contract}</Badge>
                  <Badge
                    variant="secondary"
                    className={cn(
                      proposal.status === "active" && "bg-blue-500/10 text-blue-500",
                      proposal.status === "passed" && "bg-green-500/10 text-green-500",
                      proposal.status === "failed" && "bg-red-500/10 text-red-500"
                    )}
                  >
                    {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {proposal.description}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Created by</p>
                <p className="font-medium">{proposal.creator}</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-8">
              <div className="flex-1">
                <div className="h-2 rounded-full bg-secondary overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full"
                    style={{ width: `${(proposal.votes.for / proposal.quorum) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between text-sm mt-2">
                  <span className="text-muted-foreground">{proposal.votes.for} votes</span>
                  <span className="text-muted-foreground">Quorum: {proposal.quorum}</span>
                </div>
              </div>

              <div className="space-y-1 sm:min-w-[120px]">
                <div className="flex justify-between text-sm">
                  <span className="text-green-500">For</span>
                  <span>{proposal.votes.for}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-red-500">Against</span>
                  <span>{proposal.votes.against}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Abstain</span>
                  <span>{proposal.votes.abstain}</span>
                </div>
              </div>
            </div>

            {proposal.status === "active" && (
              <div className="flex justify-end gap-2">
                <Button variant="outline" className="w-24">Against</Button>
                <Button className="w-24">For</Button>
              </div>
            )}
          </div>
        </Card>
      ))}
    </>
  )
}

export default ProposalsList


