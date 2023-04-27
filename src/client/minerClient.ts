import dotenv from 'dotenv'

import axios from 'axios'
import NextBlockInfo from '../lib/types/nextBlockInfo'
import Block from '../lib/block'
dotenv.config()

const BLOCKCHAIN_SERVER = process.env.BLOCKCHAIN_SERVER
const minerWallet = {
  privateKey: 'test',
  publicKey: `${process.env.MINER_WALLET}`,
}
console.log(`Logged as ${minerWallet.publicKey}`)

let totalMined = 0

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

  // TODO: add reward tx

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
