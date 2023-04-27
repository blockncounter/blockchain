import Transaction from '../transaction'

/**
 * The NextBlockInfo to be sent to the Miner
 * @param index The index of the next Block
 * @param previousHash The hash of the previous Block
 * @param difficulty The Blockchain current difficulty
 * @param maxDifficulty The Blockchain maximum difficulty
 * @param feePerTx The reward the Miner will receive if successful
 * @param data The data to be stored in the Block
 */
export default interface NextBlockInfo {
  index: number
  previousHash: string
  difficulty: number
  maxDifficulty: number
  feePerTx: number
  transactions: Transaction[]
}
