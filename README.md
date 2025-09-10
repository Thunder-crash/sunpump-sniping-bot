# SunPump Memecoin Sniping Bot (TRON)

Autonomous, configurable sniping bot for the SunPump memecoin launchpad on TRON. It monitors new token creations, bonding curve activity, and executes buys with slippage control. Includes SunSwap integration for exits and comprehensive CLI for trading operations.

## Features
- **New Token Detection**: Monitors SunPump for freshly launched memecoins
- **Bonding Curve Trading**: Executes buys during bonding curve phase before liquidity migration
- **SunSwap Integration**: Router-based sell/exit with fee-on-transfer support
- **Market Cap Filtering**: Configurable min/max market cap criteria
- **Real-time Monitoring**: Continuous polling and event-based detection
- **Risk Controls**: Slippage protection, blacklist filtering, dry-run mode
- **TRON Optimized**: Built for TRON's low fees and high-speed transactions

## SunPump Overview
SunPump is a memecoin launchpad on TRON blockchain, inspired by Solana's Pump.fun but optimized for the TRON ecosystem:

- **No-code Creation**: Launch tokens with just name, ticker, and image
- **Bonding Curve Mechanism**: Automated price discovery with continuous liquidity
- **Low Fees**: Leverages TRON's minimal transaction costs
- **SUN.io Integration**: Seamless connection to SunSwap DEX
- **Migration Threshold**: Automatic liquidity migration at $69,420 market cap

### Key SunPump Features
1. **Bonding Curve Pricing**: Prices increase with demand, providing continuous liquidity
2. **Automatic Migration**: When market cap reaches $69,420, liquidity moves to SunSwap
3. **TRON Benefits**: High-speed transactions with extremely low fees
4. **DeFi Integration**: Part of the larger SUN.io ecosystem

## Quick Start

### Prerequisites
- Node.js >= 18.17
- TRON wallet with TRX for gas and trading
- TronGrid API key (optional, for higher rate limits)

### Install
```bash
npm install
```

### Configure
Copy `env.example` to `.env` and fill values:
```ini
TRON_NETWORK=mainnet
TRON_API_KEY=your_api_key_here
PRIVATE_KEY=your_private_key_here
SUNPUMP_CONTRACT=TXYZopYRdj2D9XRtbG411XZZ3kM5VkAeBf
SUNSWAP_ROUTER=TKzxdSv2FZKQrEqkKVgp5DcwEXBEKMg2Ax
LOG_LEVEL=info
```

Edit `config.example.json` (copy to `config.json`):
```json
{
  "sunpumpContract": "TXYZopYRdj2D9XRtbG411XZZ3kM5VkAeBf",
  "watchNewTokens": true,
  "watchBondingCurve": true,
  "targets": [
    { "token": "TTokenAddress123", "maxTrx": "100", "slippagePercent": 5 }
  ],
  "minMarketCap": "1000",
  "maxMarketCap": "50000"
}
```

### Develop
```bash
npm run dev -- run -c config.json --dry-run
```

### Build & Run
```bash
npm run build
node dist/index.js run -c config.json
```

## CLI Commands

### Run Sniper
```bash
# Dry run (simulation)
npm run dev -- run -c config.json --dry-run

# Live trading
node dist/index.js run -c config.json

# Custom config
node dist/index.js run -c my-config.json
```

### Sell Position
```bash
# Sell all tokens with 3% slippage
node dist/index.js sell --token TTokenAddress123 --amount ALL

# Sell specific amount with 5% slippage
node dist/index.js sell --token TTokenAddress123 --amount 1000 --slippage 5
```

## Configuration Options

### Environment Variables
- `TRON_NETWORK`: Network to use (`mainnet`, `shasta`, `nile`)
- `TRON_API_KEY`: TronGrid API key for higher rate limits
- `PRIVATE_KEY`: Your wallet private key
- `SUNPUMP_CONTRACT`: SunPump contract address
- `SUNSWAP_ROUTER`: SunSwap router address
- `LOG_LEVEL`: Logging level (`info`, `debug`, `error`)

### Config File Options
- `watchNewTokens`: Monitor for new token launches
- `watchBondingCurve`: Monitor bonding curve activity
- `targets`: Static list of tokens to snipe
- `minMarketCap`/`maxMarketCap`: Market cap filtering
- `blacklist`: Tokens to avoid
- `slippagePercent`: Default slippage tolerance

## Trading Strategies

### New Token Sniping
- Monitor SunPump for fresh launches
- Execute buys immediately after token creation
- Target tokens before significant price movement

### Bonding Curve Trading
- Buy during bonding curve phase
- Exit before $69,420 migration threshold
- Take advantage of continuous liquidity

### Risk Management
- Use conservative slippage settings (3-5%)
- Set market cap limits to avoid rugs
- Monitor gas fees and network congestion
- Test with small amounts first

## Security Considerations

- **Private Key Security**: Never commit private keys to version control
- **Hot Wallet**: Use dedicated trading wallet with limited funds
- **Contract Verification**: Verify SunPump and SunSwap contract addresses
- **Network Fees**: TRON fees are low but monitor for network congestion
- **Rug Pulls**: Memecoins are high-risk; only trade what you can afford to lose

## TRON Network Benefits

- **Low Fees**: Transaction costs typically under $0.01
- **Fast Confirmation**: 3-second block times
- **High Throughput**: 2000+ TPS capacity
- **Energy System**: Flexible fee model with energy/bandwidth

## Disclaimer

This software is provided for educational and research purposes. Trading cryptocurrencies involves substantial risk of loss. The authors assume no responsibility for financial losses. Always conduct your own research and trade responsibly.

## License

MIT

## Support

For issues and feature requests, please open a GitHub issue. For trading strategies and community discussion, consider joining TRON DeFi communities.