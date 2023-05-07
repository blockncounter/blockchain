import Validation from '../validation'

/**
 * MockTransactionOutput class
 */
export default class TransactionOutput {
  toAddress: string
  amount: number
  txHash?: string

  constructor(txOutput?: TransactionOutput) {
    this.toAddress = txOutput?.toAddress || 'abc'
    this.amount = txOutput?.amount || 10
    this.txHash = txOutput?.txHash || 'xyz'
  }

  isValid(): Validation {
    if (this.amount < 1) return new Validation(false, 'Invalid amount')

    return new Validation()
  }

  getHash(): string {
    return 'abc'
  }
}
