// Constants for Explorer selects and presets.

export const DEFAULT_SORT_OPTIONS = [
  "Newest First",
  "Oldest First",
  "Value: High to Low",
  "Value: Low to High",
]

// Shared mock data-source for the explorer. Replace with real API later.
export type BlockItem = {
  height: number
  timestamp: string
  transactions: number
  size: string
  status: 'validated' | 'pending'
  hash?: string
  parentHash?: string
  gasUsed?: number
  gasLimit?: number
  proposer?: string
}

export type ContractEvent = {
  id: string | number
  name: string
  tx: string
  time: string
}

export type ContractItem = {
  name: string
  address: string
  status: 'active' | 'paused' | 'archived'
  type: 'Token' | 'Governance' | 'Treasury' | string
  verified: boolean
  lastEvent: string
}

export type ContractTx = {
  id: string
  method: string
  timestamp: string
  from: string
  to: string
  value: string
}

export type HolderItem = {
  address: string
  balance: string
}

export type ExplorerTx = {
  id: string
  timestamp: string
  from: string
  to: string
  method?: string
  value: string
  fee?: string
  status: 'success' | 'failed'
  contract?: string
  type?: string
  amount?: string
}

const MOCK_BLOCKS: BlockItem[] = [
  { height: 1458923, timestamp: '2024-03-21T15:29:45', transactions: 156, size: '1.2 MB', status: 'validated' },
  { height: 1458922, timestamp: '2024-03-21T15:29:30', transactions: 143, size: '1.1 MB', status: 'validated' },
  { height: 1458921, timestamp: '2024-03-21T15:29:15', transactions: 168, size: '1.3 MB', status: 'validated' },
  { height: 1458920, timestamp: '2024-03-21T15:29:00', transactions: 152, size: '1.2 MB', status: 'validated' },
  { height: 1458919, timestamp: '2024-03-21T15:28:45', transactions: 147, size: '1.1 MB', status: 'validated' },
]

const MOCK_EVENTS: Record<string, ContractEvent[]> = {
  '0xA1b2...C3d4': [
    { id: 1, name: 'Transfer', tx: '0xabc...1234', time: '2024-03-21T15:30:00' },
    { id: 2, name: 'Approval', tx: '0xdef...5678', time: '2024-03-21T12:15:00' },
  ],
}

const MOCK_CONTRACTS: ContractItem[] = [
  { name: 'LuxuryDowntownApartment', address: '0xA1b2...C3d4', status: 'active', type: 'Token', verified: true, lastEvent: '2024-03-21T15:28:12' },
  { name: 'ModernOfficeComplex', address: '0xD5e6...F7g8', status: 'active', type: 'Governance', verified: true, lastEvent: '2024-03-21T14:59:02' },
  { name: 'WaterfrontResidence', address: '0x9A0b...1C2d', status: 'paused', type: 'Treasury', verified: false, lastEvent: '2024-03-20T18:41:33' },
]

export const explorerData = {
  async getLatestBlocks(): Promise<BlockItem[]> {
    return Promise.resolve(MOCK_BLOCKS)
  },
  async getBlocks(): Promise<BlockItem[]> {
    return Promise.resolve(MOCK_BLOCKS)
  },
  async getBlockByHeight(height: number): Promise<BlockItem | undefined> {
    const item = MOCK_BLOCKS.find(b => b.height === height)
    return Promise.resolve(item ? { ...item, hash: '0xblock...'+height, parentHash: '0xparent...'+(height-1), gasUsed: 123456, gasLimit: 200000, proposer: 'Validator Alpha' } : undefined)
  },
  async getBlockTransactions(height: number): Promise<ContractTx[]> {
    return Promise.resolve([
      { id: '0xtx...'+height+'01', method: 'transfer', timestamp: '2024-03-21T15:29:45', from: '0xabc...01', to: '0xdef...02', value: '12.8 RLTY' },
      { id: '0xtx...'+height+'02', method: 'mint', timestamp: '2024-03-21T15:29:30', from: '0xabc...03', to: '0xdef...04', value: '1.0 RLTY' },
    ])
  },
  async getContractEvents(address: string): Promise<ContractEvent[]> {
    return Promise.resolve(MOCK_EVENTS[address] || [])
  },
  async getContracts(): Promise<ContractItem[]> {
    return Promise.resolve(MOCK_CONTRACTS)
  },
  async getContractAbi(address: string): Promise<string> {
    // In real app: fetch ABI by address
    return Promise.resolve('[{"type":"function","name":"transfer","inputs":[{"name":"to","type":"address"},{"name":"amount","type":"uint256"}],"outputs":[]}]')
  },
  async getContractTransactions(address: string): Promise<ContractTx[]> {
    return Promise.resolve([
      { id: '0xaaa...111', method: 'transfer', timestamp: '2024-03-21T10:00:00', from: '0xabc...001', to: address, value: '100 RLTY' },
      { id: '0xbbb...222', method: 'approve', timestamp: '2024-03-21T09:40:00', from: address, to: '0xabc...002', value: '—' },
    ])
  },
  async getHolders(address: string): Promise<HolderItem[]> {
    return Promise.resolve([
      { address: '0xholder...01', balance: '1,250' },
      { address: '0xholder...02', balance: '980' },
    ])
  },
  async getTransactions(): Promise<ExplorerTx[]> {
    return Promise.resolve([
      { id: '0x1234...5678', timestamp: '2024-03-20T14:30:00', from: '0xabcd...efgh', to: '0x9876...5432', method: 'mint', value: '$625.00', fee: '$0.12', status: 'success', contract: 'LuxuryDowntownApartment', type: 'mint', amount: '2.5 LDANY' },
      { id: '0x5678...9012', timestamp: '2024-03-20T14:15:00', from: '0x2468...1357', to: '0x1357...2468', method: 'transfer', value: '$324.00', fee: '$0.09', status: 'success', contract: 'ModernOfficeComplex', type: 'transfer', amount: '1.8 MOCSF' },
      { id: '0x9012...3456', timestamp: '2024-03-20T14:00:00', from: '0x8642...9753', to: '0x0000...0000', method: 'burn', value: '$150.00', fee: '$0.04', status: 'failed', contract: 'WaterfrontResidence', type: 'burn', amount: '0.5 WRFMI' },
    ])
  },
}


// Explorer page mocks/opzioni centralizzati (copiati 1:1 dalla pagina)
export const EXPLORER_TRANSACTIONS: ExplorerTx[] = [
  {
    id: "0x1234...5678",
    type: "mint",
    from: "0xabcd...efgh",
    to: "0x9876...5432",
    amount: "2.5 LDANY",
    value: "$625.00",
    timestamp: "2024-03-20T14:30:00",
    status: "success",
    contract: "LuxuryDowntownApartment",
    method: "mint",
    fee: "$0.12"
  },
  {
    id: "0x5678...9012",
    type: "transfer",
    from: "0x2468...1357",
    to: "0x1357...2468",
    amount: "1.8 MOCSF",
    value: "$324.00",
    timestamp: "2024-03-20T14:15:00",
    status: "success",
    contract: "ModernOfficeComplex",
    method: "transfer",
    fee: "$0.09"
  },
  {
    id: "0x9012...3456",
    type: "burn",
    from: "0x8642...9753",
    to: "0x0000...0000",
    amount: "0.5 WRFMI",
    value: "$150.00",
    timestamp: "2024-03-20T14:00:00",
    status: "failed",
    contract: "WaterfrontResidence",
    method: "burn",
    fee: "$0.04"
  }
]

export const LATEST_BLOCKS: BlockItem[] = [
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
]

export const ACTIVE_SMART_CONTRACTS: ContractItem[] = [
  {
    name: "LuxuryDowntownApartment",
    address: "0xA1b2...C3d4",
    status: "active",
    type: "Token",
    verified: true,
    lastEvent: "2024-03-21T15:28:12"
  },
  {
    name: "ModernOfficeComplex",
    address: "0xD5e6...F7g8",
    status: "active",
    type: "Governance",
    verified: true,
    lastEvent: "2024-03-21T14:59:02"
  },
  {
    name: "WaterfrontResidence",
    address: "0x9A0b...1C2d",
    status: "paused",
    type: "Treasury",
    verified: false,
    lastEvent: "2024-03-20T18:41:33"
  }
]

export const KPIS = {
  latestBlock: 2847592,
  tps: 2450,
  avgGasFee: "$2.45",
  tokenPrice: "$3,245",
  activeNodes: 4523,
  totalTransactions: 1234567,
}

export const NETWORK_HEALTH = {
  blockTime: "12.5s",
  difficulty: "15.2T",
  hashRate: "892 TH/s",
  pendingTxs: 12847,
}

export const TOKEN_METRICS = {
  symbol: "RLTY",
  price: "$2.45",
  change24h: "+8.4% (24h)",
  marketCap: "$2.45M",
  totalSupply: "1M RLTY",
  circulating: "750k RLTY",
  volume24h: "$156k",
}

export const TOP_VALIDATORS = [
  { name: "Validator Alpha", blocks: 2450, uptime: "98.7%" },
  { name: "Node Beta", blocks: 1890, uptime: "97.2%" },
  { name: "Gamma Pool", blocks: 1567, uptime: "96.8%" },
]

export const PROPOSALS = [
  {
    id: 1,
    title: "Upgrade Property Management System",
    description: "Proposal to upgrade the current property management system with enhanced features",
    contract: "LuxuryDowntownApartment",
    status: "active",
    votes: {
      for: 75,
      against: 25,
      abstain: 10
    },
    endTime: "2024-04-01T00:00:00",
    quorum: 100,
    creator: "0xabcd...efgh"
  },
  {
    id: 2,
    title: "Implement New Security Measures",
    description: "Add additional security features to protect token holders",
    contract: "ModernOfficeComplex",
    status: "passed",
    votes: {
      for: 120,
      against: 30,
      abstain: 5
    },
    endTime: "2024-03-15T00:00:00",
    quorum: 100,
    creator: "0x2468...1357"
  },
  {
    id: 3,
    title: "Quarterly Dividend Distribution",
    description: "Proposal for Q1 2024 dividend distribution schedule",
    contract: "WaterfrontResidence",
    status: "failed",
    votes: {
      for: 45,
      against: 65,
      abstain: 15
    },
    endTime: "2024-03-10T00:00:00",
    quorum: 100,
    creator: "0x8642...9753"
  }
]

export const CONTRACTS = [
  "All Contracts",
  "LuxuryDowntownApartment",
  "ModernOfficeComplex",
  "WaterfrontResidence"
]

export const TRANSACTION_TYPES = ["All Types", "mint", "transfer", "burn"]
export const TRANSACTION_STATUS = ["All Status", "success", "failed"]
export const PROPOSAL_STATUS = ["All Status", "active", "passed", "failed"]

export const SORT_OPTIONS = DEFAULT_SORT_OPTIONS

