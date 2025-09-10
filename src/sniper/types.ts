import type TronWeb from 'tronweb'

export type SnipeOperation =
  | { kind: 'new_token', tokenAddress: string, maxTrx: string, slippagePercent: number }
  | { kind: 'bonding_curve_buy', tokenAddress: string, maxTrx: string, slippagePercent: number }

export type SniperContext = {
  tronWeb: TronWeb
  logger: any
  dryRun: boolean
}

export type SellParams = {
  tokenAddress: string
  amountHuman: string
  slippagePercent: number
}

export type TokenInfo = {
  address: string
  name: string
  symbol: string
  decimals: number
  totalSupply: string
  marketCap: string
  bondingCurvePrice: string
}
