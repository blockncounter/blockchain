import dotenv from 'dotenv'
import axios from 'axios'
import Wallet from '../lib/wallet'
import NextBlockInfo from '../lib/types/nextBlockInfo'
import Block from '../lib/block'
import Transaction from '../lib/transaction'
import { TransactionType } from '../lib/types/transactionType'
import TransactionOutput from '../lib/transactionOutput'
dotenv.config()

const BLOCKCHAIN_SERVER = process.env.BLOCKCHAIN_SERVER
const minerWallet = new Wallet(process.env.MINER_WALLET)

console.log(`Logged as ${minerWallet.publicKey}`)

let totalMined = 0

function getRewardTx(): Transaction {
  const txo = new TransactionOutput({
    toAddress: minerWallet.publicKey,
    amount: 10,
  } as TransactionOutput)

  const tx = new Transaction({
    txOutputs: [txo],
    type: TransactionType.FEE,
  } as Transaction)

  tx.hash = tx.getHash()
  tx.txOutputs[0].txHash = tx.hash

  return tx
}

async function mine() {
  console.log('Getting next block info...')

  const { data } = await axios.get(`${BLOCKCHAIN_SERVER}/blocks/next`)
  if (!data) {
    console.log('No block to mine. Retrying in 5 seconds...')
    return setTimeout(() => {
      mine()
    }, 5000)
  }
  const nextBlockInfo = data as NextBlockInfo

  const newBlock = Block.fromNextBlockInfo(nextBlockInfo)
  newBlock.transactions.push(getRewardTx())
  newBlock.miner = minerWallet.publicKey
  newBlock.hash = newBlock.getHash()

  console.log(`Start mining block ${nextBlockInfo.index}...`)
  newBlock.mine({
    difficulty: nextBlockInfo.difficulty,
    miner: minerWallet.publicKey,
  })

  console.log(`Block mined: ${newBlock.hash}! Sending to blockchain...`)

  try {
    await axios.post(`${BLOCKCHAIN_SERVER}/blocks`, newBlock)
    console.log('Block sent and accepted!')
    totalMined++
    console.log(`Total mined: ${totalMined}`)
  } catch (err: any) {
    console.error(err.response ? err.response.data : err.msg)
  }

  setTimeout(() => {
    mine()
  }, 1000)
}

mine()
