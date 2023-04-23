import sha256 from 'crypto-js/sha256';
import { TransactionType } from "../types/transactionType";
import Validation from '../validation';

/**
 * Mock Transaction class
 */
export default class Transaction {
  type: TransactionType
  timestamp: number
  hash: string
  data: string

  constructor(tx?: Transaction) {
    this.type = tx?.type || TransactionType.REGULAR
    this.timestamp = tx?.timestamp || Date.now()
    this.data = tx?.data || ''
    this.hash = tx?.hash || this.getHash()
  }

  getHash(): string {
    return 'abc'
  }

  isValid(): Validation {
    if (!this.data) return new Validation(false, "Invalid Mock Transaction")

    return new Validation()
  }
}
