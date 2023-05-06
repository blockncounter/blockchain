import Validation from '../validation'
import TransactionInput from './transactionInput'
import { TransactionType } from '../types/transactionType'

/**
 * Mock Transaction class
 */
export default class Transaction {
  type: TransactionType
  timestamp: number
  hash: string
  to: string
  txInput: TransactionInput

  constructor(tx?: Transaction) {
    this.type = tx?.type || TransactionType.REGULAR
    this.timestamp = tx?.timestamp || Date.now()
    this.to = tx?.to || 'walletTo'
    this.txInput = tx?.txInput
      ? new TransactionInput(tx.txInput)
      : new TransactionInput()
    this.hash = tx?.hash || this.getHash()
  }

  getHash(): string {
    return 'abc'
  }

  isValid(): Validation {
    if (!this.to) return new Validation(false, 'Invalid Mock Transaction')

    if (this.txInput && !this.txInput.isValid().success)
      return new Validation(false, 'Invalid Mock Transaction')

    return new Validation()
  }
}
