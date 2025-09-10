import type TronWeb from 'tronweb'
import fs from 'node:fs'
import path from 'node:path'
import axios from 'axios'
import type { SnipeOperation } from './types.js'

export type SunPumpWatcherConfig = {
  sunpumpContract?: string
  watchNewTokens?: boolean
  watchBondingCurve?: boolean
  targets?: Array<{ token: string, maxTrx: string, slippagePercent: number }>
  blacklist?: string[]
  minMarketCap?: string
  maxMarketCap?: string
}

export class SunPumpWatcher {
  private readonly tronWeb: TronWeb
  private readonly logger: any
  private readonly configPath: string
  private config!: SunPumpWatcherConfig
  private isRunning = false

  constructor(args: { tronWeb: TronWeb, logger: any, configPath: string }) {
    this.tronWeb = args.tronWeb
    this.logger = args.logger
    this.configPath = args.configPath
    this.loadConfig()
  }

  private loadConfig() {
    const resolved = path.resolve(process.cwd(), this.configPath)
    const raw = fs.readFileSync(resolved, 'utf-8')
    this.config = JSON.parse(raw)
  }

  async start(onOperation: (op: SnipeOperation) => Promise<void>) {
    this.isRunning = true
    this.logger.info('Starting SunPump watcher...')

    // Strategy 1: static targets list
    if (this.config.targets && this.config.targets.length > 0) {
      for (const t of this.config.targets) {
        if (this.isBlacklisted(t.token)) continue
        const op: SnipeOperation = { 
          kind: 'bonding_curve_buy', 
          tokenAddress: t.token, 
          maxTrx: t.maxTrx, 
          slippagePercent: t.slippagePercent 
        }
        await onOperation(op)
      }
    }

    // Strategy 2: watch for new token creations
    if (this.config.watchNewTokens) {
      await this.watchNewTokenCreations(onOperation)
    }

    // Strategy 3: monitor bonding curve activity
    if (this.config.watchBondingCurve) {
      await this.watchBondingCurveActivity(onOperation)
    }

    // Keep the process alive
    while (this.isRunning) {
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
  }

  private async watchNewTokenCreations(onOperation: (op: SnipeOperation) => Promise<void>) {
    this.logger.info('Watching for new token creations...')
    
    // Poll SunPump API or contract events for new tokens
    setInterval(async () => {
      try {
        const newTokens = await this.getRecentTokens()
        for (const token of newTokens) {
          if (this.isBlacklisted(token.address)) continue
          if (!this.meetsMarketCapCriteria(token)) continue

          const op: SnipeOperation = {
            kind: 'new_token',
            tokenAddress: token.address,
            maxTrx: this.config.targets?.[0]?.maxTrx ?? '100',
            slippagePercent: this.config.targets?.[0]?.slippagePercent ?? 5
          }
          await onOperation(op)
        }
      } catch (err) {
        this.logger.error({ err }, 'error watching new tokens')
      }
    }, 5000) // Check every 5 seconds
  }

  private async watchBondingCurveActivity(onOperation: (op: SnipeOperation) => Promise<void>) {
    this.logger.info('Watching bonding curve activity...')
    
    // Monitor specific tokens for bonding curve opportunities
    if (this.config.targets) {
      setInterval(async () => {
        for (const target of this.config.targets!) {
          if (this.isBlacklisted(target.token)) continue
          
          try {
            const tokenInfo = await this.getTokenInfo(target.token)
            if (tokenInfo && this.meetsMarketCapCriteria(tokenInfo)) {
              const op: SnipeOperation = {
                kind: 'bonding_curve_buy',
                tokenAddress: target.token,
                maxTrx: target.maxTrx,
                slippagePercent: target.slippagePercent
              }
              await onOperation(op)
            }
          } catch (err) {
            this.logger.debug({ err, token: target.token }, 'error checking bonding curve')
          }
        }
      }, 10000) // Check every 10 seconds
    }
  }

  private async getRecentTokens() {
    // This would typically call SunPump API or scan contract events
    // For now, return empty array - implement based on actual SunPump API
    return []
  }

  private async getTokenInfo(tokenAddress: string) {
    try {
      const contract = await this.tronWeb.contract().at(this.config.sunpumpContract || 'TXYZopYRdj2D9XRtbG411XZZ3kM5VkAeBf')
      const result = await contract.getTokenInfo(tokenAddress).call()
      
      return {
        address: tokenAddress,
        marketCap: result.marketCap,
        price: result.price
      }
    } catch (err) {
      return null
    }
  }

  private meetsMarketCapCriteria(token: any): boolean {
    if (!this.config.minMarketCap && !this.config.maxMarketCap) return true
    
    const marketCap = parseFloat(token.marketCap || '0')
    const minCap = this.config.minMarketCap ? parseFloat(this.config.minMarketCap) : 0
    const maxCap = this.config.maxMarketCap ? parseFloat(this.config.maxMarketCap) : Infinity
    
    return marketCap >= minCap && marketCap <= maxCap
  }

  private isBlacklisted(addr: string) {
    return (this.config.blacklist ?? []).some(a => a.toLowerCase() === addr.toLowerCase())
  }

  stop() {
    this.isRunning = false
  }
}
