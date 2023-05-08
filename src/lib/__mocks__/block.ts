import { isValidParams } from './../block'
import Validation from '../validation'
import Transaction from './transaction'

/**
 * Mock Block class
 */
export default class Block {
  index: number
  timestamp: number
  hash: string
  previousHash: string
  transactions: Transaction[]
  miner: string

  /**
   * Constructor for Mock Block class
   * @param block The Mock Block attributes
   */
  constructor(block?: Block) {
    this.index = block?.index || 0
    this.timestamp = block?.timestamp || Date.now()
    this.previousHash = block?.previousHash || ''
    this.transactions = block?.transactions || ([] as Transaction[])
    this.miner = block?.miner || 'abc'
    this.hash = block?.hash || this.getHash()
  }

  mine(difficulty: number, miner: string) {
    this.miner = miner
  }

  getHash(): string {
    return (
      this.hash ||
      'cbc0401163a8784b7feb36c149d7ce257bf78396251de8429bad39d252578396'
    )
  }

  /**
   * Validates the Mock Block
   * @returns {boolean} Returns true if the Mock Block is valid
   */
  isValid({
    previousIndex,
    previousHash,
    feePerTx,
  }: isValidParams): Validation {
    if (!previousHash || previousIndex < 0 || this.index < 1 || feePerTx < 1)
      return new Validation(false, 'Invalid Mock Block')

    return new Validation()
  }
}
