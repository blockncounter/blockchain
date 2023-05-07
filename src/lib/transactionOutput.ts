import sha256 from 'crypto-js/sha256'
import Validation from './validation'

/**
 * TransactionOutput class
 */
export default class TransactionOutput {
  toAddress: string
  amount: number
  txHash?: string

  constructor(txOutput?: TransactionOutput) {
    this.toAddress = txOutput?.toAddress || ''
    this.amount = txOutput?.amount || 0
    this.txHash = txOutput?.txHash || ''
  }

  isValid(): Validation {
    if (this.amount < 1) return new Validation(false, 'Invalid amount')

    return new Validation()
  }

  getHash(): string {
    return sha256(this.toAddress + this.amount).toString()
  }
}
