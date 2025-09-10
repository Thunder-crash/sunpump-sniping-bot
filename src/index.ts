import { Command } from 'commander'
import { loadEnvironment } from './lib/config.js'
import { createLogger } from './lib/logger.js'
import { createTronWeb } from './lib/tronweb.js'
import { SunPumpWatcher } from './sniper/SunPumpWatcher.js'
import { Sniper } from './sniper/Sniper.js'

const program = new Command()

program
  .name('sunpump-sniper')
  .description('SunPump (TRON) memecoin sniping bot')
  .version('0.1.0')

program
  .command('run')
  .description('Run the sniper')
  .option('-c, --config <path>', 'Path to JSON config', 'config.example.json')
  .option('--dry-run', 'Simulate without sending transactions', false)
  .action(async (opts) => {
    const env = loadEnvironment()
    const logger = createLogger(env.LOG_LEVEL)
    const tronWeb = createTronWeb(env)

    const sniper = new Sniper({ tronWeb, logger, dryRun: opts.dryRun })
    const watcher = new SunPumpWatcher({ tronWeb, logger, configPath: opts.config })

    logger.info('Starting SunPump watcher...')
    await watcher.start(async (op) => {
      try {
        if (op.kind === 'new_token') {
          await sniper.buyNewToken(op)
        } else if (op.kind === 'bonding_curve_buy') {
          await sniper.buyOnBondingCurve(op)
        }
      } catch (err) {
        logger.error({ err }, 'snipe error')
      }
    })
  })

program
  .command('sell')
  .description('Sell/exit position via SunSwap')
  .requiredOption('--token <address>', 'Token address')
  .option('--amount <amount>', 'Amount of tokens (human units)', 'ALL')
  .option('--slippage <percent>', 'Slippage percentage', '3')
  .action(async (opts) => {
    const env = loadEnvironment()
    const logger = createLogger(env.LOG_LEVEL)
    const tronWeb = createTronWeb(env)

    const sniper = new Sniper({ tronWeb, logger, dryRun: false })
    await sniper.sellViaSunSwap({
      tokenAddress: opts.token,
      amountHuman: opts.amount,
      slippagePercent: Number(opts.slippage)
    })
  })

await program.parseAsync(process.argv)
