import type TronWeb from 'tronweb'
import { loadEnvironment } from '../lib/config.js'
import type { SellParams, SniperContext, SnipeOperation } from './types.js'

export class Sniper {
  private readonly tronWeb: TronWeb
  private readonly logger: any
  private readonly dryRun: boolean
  private readonly env = loadEnvironment()

  constructor(ctx: SniperContext) {
    this.tronWeb = ctx.tronWeb
    this.logger = ctx.logger
    this.dryRun = ctx.dryRun
  }

  async buyNewToken(op: Extract<SnipeOperation, { kind: 'new_token' }>) {
    return this.buyCommon(op.tokenAddress, op.maxTrx, op.slippagePercent)
  }

  async buyOnBondingCurve(op: Extract<SnipeOperation, { kind: 'bonding_curve_buy' }>) {
    return this.buyCommon(op.tokenAddress, op.maxTrx, op.slippagePercent)
  }

  private async buyCommon(tokenAddress: string, maxTrx: string, slippagePercent: number) {
    try {
      // Get token info from SunPump contract
      const tokenInfo = await this.getTokenInfo(tokenAddress)
      if (!tokenInfo) {
        throw new Error('Token not found on SunPump')
      }

      const amountTrx = this.tronWeb.toSun(maxTrx)
      const slippageBips = slippagePercent * 100

      this.logger.info({ 
        tokenAddress, 
        tokenSymbol: tokenInfo.symbol,
        amountTrx: maxTrx, 
        slippagePercent,
        currentPrice: tokenInfo.bondingCurvePrice 
      }, 'buy')

      if (this.dryRun) {
        this.logger.info('DRY RUN: Would execute buy transaction')
        return { hash: 'dry-run' }
      }

      // Call SunPump buy function
      const contract = await this.tronWeb.contract().at(this.env.SUNPUMP_CONTRACT)
      const result = await contract.buy(tokenAddress).send({
        feeLimit: 100_000_000, // 100 TRX fee limit
        callValue: amountTrx,
        shouldPollResponse: true
      })

      this.logger.info({ hash: result, tokenAddress }, 'buy sent')
      return { hash: result }
    } catch (err) {
      this.logger.error({ err, tokenAddress }, 'buy failed')
      throw err
    }
  }

  async sellViaSunSwap(params: SellParams) {
    try {
      const tokenInfo = await this.getTokenInfo(params.tokenAddress)
      if (!tokenInfo) {
        throw new Error('Token not found')
      }

      // Get token balance
      let amount: string
      if (params.amountHuman.toUpperCase() === 'ALL') {
        const balance = await this.getTokenBalance(params.tokenAddress)
        amount = balance
      } else {
        // Convert human amount to token units
        const decimals = tokenInfo.decimals
        const multiplier = Math.pow(10, decimals)
        amount = (parseFloat(params.amountHuman) * multiplier).toString()
      }

      this.logger.info({ 
        tokenAddress: params.tokenAddress,
        amount: params.amountHuman,
        slippagePercent: params.slippagePercent 
      }, 'sell')

      if (this.dryRun) {
        this.logger.info('DRY RUN: Would execute sell transaction')
        return { hash: 'dry-run' }
      }

      // Approve SunSwap router to spend tokens
      await this.approveToken(params.tokenAddress, this.env.SUNSWAP_ROUTER, amount)

      // Execute swap via SunSwap
      const contract = await this.tronWeb.contract().at(this.env.SUNSWAP_ROUTER)
      const result = await contract.swapExactTokensForTrx(
        amount,
        this.calculateMinOutput(amount, params.slippagePercent),
        [params.tokenAddress, this.env.TRX_ADDRESS],
        this.tronWeb.address.fromPrivateKey(this.env.PRIVATE_KEY).base58,
        Math.floor(Date.now() / 1000) + 300 // 5 min deadline
      ).send({
        feeLimit: 50_000_000, // 50 TRX fee limit
        shouldPollResponse: true
      })

      this.logger.info({ hash: result, tokenAddress: params.tokenAddress }, 'sell sent')
      return { hash: result }
    } catch (err) {
      this.logger.error({ err, tokenAddress: params.tokenAddress }, 'sell failed')
      throw err
    }
  }

  private async getTokenInfo(tokenAddress: string) {
    try {
      const contract = await this.tronWeb.contract().at(this.env.SUNPUMP_CONTRACT)
      const result = await contract.getTokenInfo(tokenAddress).call()
      
      return {
        address: tokenAddress,
        name: result.name,
        symbol: result.symbol,
        decimals: result.decimals,
        totalSupply: result.totalSupply,
        marketCap: result.marketCap,
        bondingCurvePrice: result.price
      }
    } catch (err) {
      this.logger.debug({ err, tokenAddress }, 'failed to get token info')
      return null
    }
  }

  private async getTokenBalance(tokenAddress: string): Promise<string> {
    const contract = await this.tronWeb.contract().at(tokenAddress)
    const balance = await contract.balanceOf(this.tronWeb.address.fromPrivateKey(this.env.PRIVATE_KEY).base58).call()
    return balance.toString()
  }

  private async approveToken(tokenAddress: string, spender: string, amount: string) {
    const contract = await this.tronWeb.contract().at(tokenAddress)
    const result = await contract.approve(spender, amount).send({
      feeLimit: 20_000_000, // 20 TRX fee limit
      shouldPollResponse: true
    })
    this.logger.info({ hash: result, tokenAddress, spender }, 'approved')
    return result
  }

  private calculateMinOutput(amount: string, slippagePercent: number): string {
    const slippageBips = slippagePercent * 100
    const amountBig = BigInt(amount)
    const slippageBig = BigInt(slippageBips)
    const minOutput = amountBig - (amountBig * slippageBig) / BigInt(10000)
    return minOutput.toString()
  }
}
