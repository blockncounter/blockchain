import Validation from '../validation'

/**
 * Mock TransactionInput class
 */
export default class TransactionInput {
  fromAddress: string
  amount: number
  signature: string

  /**
   * Creates a Mock TransactionInput instance
   * @param txInput The TransactionInput data
   */
  constructor(txInput?: TransactionInput) {
    this.fromAddress = txInput?.fromAddress || 'wallet1'
    this.amount = txInput?.amount || 10
    this.signature = txInput?.signature || 'abc'
  }

  /**
   * Generates the Mock TransactionInput Signature
   * @param privateKey The 'From' private key to sign the TransactionInput
   */
  sign(privateKey: string): void {
    this.signature = 'abc'
  }

  /**
   * Generates the Mock TransactionInput hash
   * @returns Returns the TransactionInput hash
   */
  getHash(): string {
    return 'abc'
  }

  /**
   * Validates the Mock TransactionInput integrity
   * @returns Returns a Validation result object
   */
  isValid(): Validation {
    if (!this.signature) return new Validation(false, 'Signature is required')

    if (!this.amount || this.amount <= 0)
      return new Validation(false, 'Amount must be greater than zero')

    return new Validation()
  }
}
