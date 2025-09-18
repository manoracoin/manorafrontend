export type FiatTx = {
  id: string
  type: 'deposit' | 'withdraw' | 'buy' | 'sell'
  amount: number
  currency: 'USD'
  from: string
  to: string
  timestamp: string
  status: 'success' | 'failed'
  mnrAmount?: number
}

export const fiatTransactions: FiatTx[] = [
  { id: 'ftx_1001', type: 'deposit', amount: 1250, currency: 'USD', from: 'Bank ****3421', to: 'Your Fiat Wallet', timestamp: '2024-03-20T10:30:00', status: 'success' },
  { id: 'ftx_1002', type: 'withdraw', amount: 750, currency: 'USD', from: 'Your Fiat Wallet', to: 'Bank ****3421', timestamp: '2024-03-19T15:45:00', status: 'success' },
  { id: 'ftx_1003', type: 'deposit', amount: 2000, currency: 'USD', from: 'Bank ****9981', to: 'Your Fiat Wallet', timestamp: '2024-03-18T09:15:00', status: 'success' },
  { id: 'ftx_1004', type: 'buy', amount: 500, mnrAmount: 200, currency: 'USD', from: 'Your Fiat Wallet', to: 'MNR Wallet', timestamp: '2024-03-17T12:00:00', status: 'success' },
  { id: 'ftx_1005', type: 'withdraw', amount: 320, currency: 'USD', from: 'Your Fiat Wallet', to: 'Bank ****3421', timestamp: '2024-03-16T16:20:00', status: 'success' },
  { id: 'ftx_1006', type: 'deposit', amount: 980, currency: 'USD', from: 'Bank ****9981', to: 'Your Fiat Wallet', timestamp: '2024-03-15T11:05:00', status: 'success' },
  { id: 'ftx_1007', type: 'buy', amount: 260, mnrAmount: 104, currency: 'USD', from: 'Your Fiat Wallet', to: 'MNR Wallet', timestamp: '2024-03-14T13:50:00', status: 'success' },
  { id: 'ftx_1008', type: 'withdraw', amount: 120, currency: 'USD', from: 'Your Fiat Wallet', to: 'Bank ****9981', timestamp: '2024-03-13T08:40:00', status: 'success' },
  { id: 'ftx_1009', type: 'deposit', amount: 450, currency: 'USD', from: 'Bank ****3421', to: 'Your Fiat Wallet', timestamp: '2024-03-12T18:25:00', status: 'success' },
  { id: 'ftx_1010', type: 'buy', amount: 800, mnrAmount: 320, currency: 'USD', from: 'Your Fiat Wallet', to: 'MNR Wallet', timestamp: '2024-03-11T10:10:00', status: 'success' },
  { id: 'ftx_1011', type: 'withdraw', amount: 210, currency: 'USD', from: 'Your Fiat Wallet', to: 'Bank ****9981', timestamp: '2024-03-10T12:30:00', status: 'success' },
  { id: 'ftx_1012', type: 'deposit', amount: 700, currency: 'USD', from: 'Bank ****3421', to: 'Your Fiat Wallet', timestamp: '2024-03-09T09:00:00', status: 'success' },
  { id: 'ftx_1013', type: 'buy', amount: 150, mnrAmount: 60, currency: 'USD', from: 'Your Fiat Wallet', to: 'MNR Wallet', timestamp: '2024-03-08T14:45:00', status: 'success' },
  { id: 'ftx_1014', type: 'withdraw', amount: 430, currency: 'USD', from: 'Your Fiat Wallet', to: 'Bank ****3421', timestamp: '2024-03-07T17:05:00', status: 'success' },
  { id: 'ftx_1015', type: 'deposit', amount: 1600, currency: 'USD', from: 'Bank ****9981', to: 'Your Fiat Wallet', timestamp: '2024-03-06T07:55:00', status: 'success' },
  { id: 'ftx_1016', type: 'buy', amount: 350, mnrAmount: 140, currency: 'USD', from: 'Your Fiat Wallet', to: 'MNR Wallet', timestamp: '2024-03-05T19:35:00', status: 'success' },
  { id: 'ftx_1017', type: 'sell', amount: 420, mnrAmount: 168, currency: 'USD', from: 'MNR Wallet', to: 'Your Fiat Wallet', timestamp: '2024-03-05T18:15:00', status: 'success' },
  { id: 'ftx_1018', type: 'sell', amount: 260, mnrAmount: 104, currency: 'USD', from: 'MNR Wallet', to: 'Your Fiat Wallet', timestamp: '2024-03-04T16:00:00', status: 'success' },
  { id: 'ftx_1019', type: 'sell', amount: 600, mnrAmount: 240, currency: 'USD', from: 'MNR Wallet', to: 'Your Fiat Wallet', timestamp: '2024-03-03T09:40:00', status: 'success' },
]


