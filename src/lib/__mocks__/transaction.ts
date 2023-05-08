import Validation from '../validation'
import TransactionInput from './transactionInput'
import { TransactionType } from '../types/transactionType'
import TransactionOutput from '../transactionOutput'

/**
 * Mock Transaction class
 */
export default class Transaction {
  type: TransactionType
  timestamp: number
  hash: string
  txInputs: TransactionInput[] | undefined
  txOutputs: TransactionOutput[]

  constructor(tx?: Transaction) {
    this.type = tx?.type || TransactionType.REGULAR
    this.timestamp = tx?.timestamp || Date.now()
    this.txInputs = tx?.txInputs || [new TransactionInput()]
    this.txOutputs = tx?.txOutputs || [new TransactionOutput()]
    this.hash = tx?.hash || this.getHash()
  }

  getHash(): string {
    return 'abc'
  }

  isValid(difficulty: number, totalFees: number): Validation {
    if (this.timestamp < 1 || !this.hash || difficulty < 1 || totalFees < 0)
      return new Validation(false, 'Invalid mock Transaction')

    return new Validation()
  }

  static fromReward(txo: TransactionOutput): Transaction {
    const tx = new Transaction({
      type: TransactionType.FEE,
      txOutputs: [txo],
    } as Transaction)

    tx.txInputs = undefined
    tx.hash = tx.getHash()
    tx.txOutputs[0].txHash = tx.hash

    return tx
  }
}
