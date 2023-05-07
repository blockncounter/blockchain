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

  isValid(): Validation {
    if (this.timestamp < 1 || !this.hash)
      return new Validation(false, 'Invalid mock Transaction')

    return new Validation()
  }
}
