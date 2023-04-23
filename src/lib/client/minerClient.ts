import axios from 'axios'
import NextBlockInfo from '../types/nextBlockInfo';
import Block from '../block';

const BLOCKCHAIN_SERVER = 'http://localhost:3000'
const minerWallet = {
  privateKey: 'test',
  publicKey: 'test'
}

let totalMined = 0

async function mine() {
  console.log('Getting next block info...');

  const { data } = await axios.get(`${BLOCKCHAIN_SERVER}/blocks/next`)
  const nextBlockInfo = data as NextBlockInfo

  const newBlock = Block.fromNextBlockInfo(nextBlockInfo)

  // TODO: add reward tx

  console.log(`Start mining block ${nextBlockInfo.index}...`)
  newBlock.mine({ difficulty: nextBlockInfo.difficulty, miner: minerWallet.publicKey })

  console.log(`Block mined: ${newBlock.hash}! Sending to blockchain...`)

  try {
    await axios.post(`${BLOCKCHAIN_SERVER}/blocks`, newBlock)
    console.log('Block sent and accepted!')
    totalMined++
    console.log(`Total mined: ${totalMined}`)
  }
  catch (err: any) {
    console.error(err.response ? err.response.data : err.msg)
  }

  setTimeout(() => {
    mine()
  }, 1000);
}

mine()
