import dotenv from 'dotenv'
import axios from 'axios'
import Wallet from '../lib/wallet'
import NextBlockInfo from '../lib/types/nextBlockInfo'
import Block from '../lib/block'
import Transaction from '../lib/transaction'
import TransactionOutput from '../lib/transactionOutput'
import Blockchain from '../lib/blockchain'
dotenv.config()

const BLOCKCHAIN_SERVER = process.env.BLOCKCHAIN_SERVER
const minerWallet = new Wallet(process.env.MINER_WALLET)

console.log(`Logged as ${minerWallet.publicKey}`)

let totalMined = 0

function getRewardTx(
  nextBlockInfo: NextBlockInfo,
  nextBlock: Block,
): Transaction | undefined {
  let amount = 0

  if (nextBlockInfo.difficulty <= nextBlockInfo.maxDifficulty)
    amount += Blockchain.getRewardAmount(nextBlockInfo.difficulty)

  const fees = nextBlock.transactions
    .map((tx) => tx.getFee())
    .reduce((a, b) => a + b)
  const feeCheck = nextBlock.transactions.length * nextBlockInfo.feePerTx
  if (fees < feeCheck) {
    console.log('Fees are lower than expected amount. Awaiting next block...')
    setTimeout(() => {
      mine()
    }, 5000)
    return
  }
  amount += fees

  const txo = new TransactionOutput({
    toAddress: minerWallet.publicKey,
    amount,
  } as TransactionOutput)

  return Transaction.fromReward(txo)
}

async function mine() {
  console.log('\nGetting next block info...')

  const { data } = await axios.get(`${BLOCKCHAIN_SERVER}/blocks/next`)
  if (!data) {
    console.log('\nNo block to mine. Retrying in 5 seconds...')
    return setTimeout(() => {
      mine()
    }, 5000)
  }

  const nextBlockInfo = data as NextBlockInfo
  const newBlock = Block.fromNextBlockInfo(nextBlockInfo)
  const tx = getRewardTx(nextBlockInfo, newBlock)

  if (!tx) return

  newBlock.transactions.push(tx)
  newBlock.miner = minerWallet.publicKey
  newBlock.hash = newBlock.getHash()

  console.log(`\nStart mining block ${nextBlockInfo.index}...`)
  newBlock.mine({
    difficulty: nextBlockInfo.difficulty,
    miner: minerWallet.publicKey,
  })

  console.log(`\nBlock mined: ${newBlock.hash}! Sending to blockchain...`)

  try {
    await axios.post(`${BLOCKCHAIN_SERVER}/blocks`, newBlock)
    console.log('\nBlock sent and accepted!')
    totalMined++
    console.log(`\nTotal mined: ${totalMined}`)
  } catch (err: any) {
    console.error(err.response ? err.response.data : err.msg)
  }

  setTimeout(() => {
    mine()
  }, 1000)
}

mine()
