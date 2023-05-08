/* eslint-disable prettier/prettier */
import sha256 from 'crypto-js/sha256'
import Validation from './validation'
import NextBlockInfo from './types/nextBlockInfo'
import Transaction from './transaction'
import { TransactionType } from './types/transactionType'

interface mineParams {
  difficulty: number
  miner: string
}

export interface isValidParams {
  previousIndex: number
  previousHash: string
  difficulty: number
  feePerTx: number
}

/**
 * Block class
 */
export default class Block {
  index: number
  timestamp: number
  hash: string
  previousHash: string
  transactions: Transaction[]
  nonce: number
  miner: string

  /**
   * Constructor for Block class
   * @param block The Block attributes
   */
  constructor(block?: Block) {
    this.index = block?.index || 0
    this.timestamp = block?.timestamp || Date.now()
    this.previousHash = block?.previousHash || ''

    this.transactions = block?.transactions
      ? block.transactions.map((tx) => new Transaction(tx))
      : ([] as Transaction[])

    this.nonce = block?.nonce || 0
    this.miner = block?.miner || ''
    this.hash = block?.hash || this.getHash()
  }

  getHash(): string {
    const txs =
      this.transactions && this.transactions.length
        ? this.transactions.map((tx) => tx.hash).reduce((a, b) => a + b)
        : ''
    return sha256(
      this.index +
      txs +
      this.previousHash +
      this.timestamp +
      this.nonce +
      this.miner,
    ).toString()
  }

  /**
   * Mines the Block by finding a hash that starts with the given prefix
   * @param difficulty The Blockchain current difficulty
   * @param miner The miner wallet address
   */
  mine({ difficulty, miner }: mineParams) {
    this.miner = miner
    const prefix = new Array(difficulty + 1).join('0')

    do {
      this.nonce++
      this.hash = this.getHash()
    } while (!this.hash.startsWith(prefix))
  }

  /**
   * Validates the Block
   * @returns previousIndex The previous Block index
   * @returns previousHash The previous Block hash
   * @returns difficulty The Blockchain current difficulty
   */
  isValid({
    previousIndex,
    previousHash,
    difficulty,
    feePerTx
  }: isValidParams): Validation {
    if (this.transactions && this.transactions.length) {
      const feeTxs = this.transactions.filter((tx) => tx.type === TransactionType.FEE)
      if (!feeTxs.length)
        return new Validation(false, 'No fee Transaction')

      if (feeTxs.length > 1)
        return new Validation(false, 'Invalid number of fees')

      if (!feeTxs[0].txOutputs.some(txo => txo.toAddress === this.miner))
        return new Validation(false, 'Invalid fee tx: invalid Miner address')

      const totalFees = feePerTx * this.transactions.filter(tx => tx.type !== TransactionType.FEE).length
      const validations = this.transactions.map((tx) => tx.isValid(difficulty, totalFees))
      const errors = validations.filter((v) => !v.success).map((v) => v.message)
      if (errors && errors.length > 0)
        return new Validation(
          false,
          'Invalid block due to invalid transaction: ' + errors.join(', '),
        )
    }

    if (previousIndex !== this.index - 1)
      return new Validation(false, 'Invalid index')
    if (this.timestamp < 1) return new Validation(false, 'Invalid timestamp')
    if (previousHash !== this.previousHash)
      return new Validation(false, 'Invalid previous hash')
    if (this.nonce < 1 || !this.miner) return new Validation(false, 'Not mined')

    const prefix = new Array(difficulty + 1).join('0')
    if (this.hash !== this.getHash() || !this.hash.startsWith(prefix))
      return new Validation(false, 'Invalid hash')

    return new Validation()
  }

  static fromNextBlockInfo(nextBlockInfo: NextBlockInfo): Block {
    const block = new Block()
    block.index = nextBlockInfo.index
    block.previousHash = nextBlockInfo.previousHash
    block.transactions = nextBlockInfo.transactions.map(tx => new Transaction(tx))
    return block
  }
}
