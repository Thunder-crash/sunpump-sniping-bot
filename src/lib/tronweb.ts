import TronWeb from 'tronweb'
import type { Environment } from './config.js'

export function createTronWeb(env: Environment) {
  const fullNode = env.TRON_NETWORK === 'mainnet' 
    ? 'https://api.trongrid.io'
    : env.TRON_NETWORK === 'shasta'
    ? 'https://api.shasta.trongrid.io'
    : 'https://api.nileex.io'

  const solidityNode = fullNode
  const eventServer = fullNode

  const tronWeb = new TronWeb({
    fullHost: fullNode,
    solidityNode,
    eventServer,
    privateKey: env.PRIVATE_KEY
  })

  if (env.TRON_API_KEY) {
    tronWeb.setHeader({ 'TRON-PRO-API-KEY': env.TRON_API_KEY })
  }

  return tronWeb
}
