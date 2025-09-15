// Shared types for the Explorer feature (kept minimal and flexible)

export type TransactionStatus = string
export type TransactionType = string

export interface TransactionItem {
  id: string
  type: TransactionType
  from: string
  to: string
  amount: string
  value: string
  timestamp: string
  status: TransactionStatus
  contract: string
}

export interface ProposalItem {
  id: number
  title: string
  description: string
  contract: string
  status: string
  votes: { for: number; against: number; abstain: number }
  endTime: string
  quorum: number
  creator: string
}


