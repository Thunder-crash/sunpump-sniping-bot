import dotenv from 'dotenv'

dotenv.config()

export type Environment = {
  TRON_NETWORK: 'mainnet' | 'shasta' | 'nile'
  TRON_API_KEY?: string
  PRIVATE_KEY: string
  LOG_LEVEL: 'info' | 'debug' | 'error'
  SUNPUMP_CONTRACT: string
  SUNSWAP_ROUTER: string
  TRX_ADDRESS: string
  USDT_ADDRESS: string
}

export function loadEnvironment(): Environment {
  const {
    TRON_NETWORK = 'mainnet',
    TRON_API_KEY,
    PRIVATE_KEY,
    LOG_LEVEL = 'info',
    SUNPUMP_CONTRACT = 'TXYZopYRdj2D9XRtbG411XZZ3kM5VkAeBf',
    SUNSWAP_ROUTER = 'TKzxdSv2FZKQrEqkKVgp5DcwEXBEKMg2Ax',
    TRX_ADDRESS = 'T9yD14Nj9j7xAB4dbGeiX9h8unkKHxuWwb',
    USDT_ADDRESS = 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t'
  } = process.env

  if (!PRIVATE_KEY) throw new Error('PRIVATE_KEY is required')

  return {
    TRON_NETWORK: TRON_NETWORK as Environment['TRON_NETWORK'],
    TRON_API_KEY,
    PRIVATE_KEY,
    LOG_LEVEL: LOG_LEVEL as Environment['LOG_LEVEL'],
    SUNPUMP_CONTRACT,
    SUNSWAP_ROUTER,
    TRX_ADDRESS,
    USDT_ADDRESS
  }
}
