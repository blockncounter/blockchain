import * as ecc from 'tiny-secp256k1'
import ECPairFactory from 'ecpair'
import sha256 from 'crypto-js/sha256'
import Validation from './validation'
import TransactionOutput from './transactionOutput'

const ECPair = ECPairFactory(ecc)

/**
 * TransactionInput class
 */
export default class TransactionInput {
  fromAddress: string
  amount: number
  signature: string
  previousTxHash: string

  /**
   * Creates a TransactionInput instance
   * @param txInput The TransactionInput data
   */
  constructor(txInput?: TransactionInput) {
    this.previousTxHash = txInput?.previousTxHash || ''
    this.fromAddress = txInput?.fromAddress || ''
    this.amount = txInput?.amount || 0
    this.signature = txInput?.signature || ''
  }

  /**
   * Generates the TransactionInput Signature
   * @param privateKey The 'From' private key to sign the TransactionInput
   */
  sign(privateKey: string): void {
    this.signature = ECPair.fromPrivateKey(Buffer.from(privateKey, 'hex'))
      .sign(Buffer.from(this.getHash(), 'hex'))
      .toString('hex')
  }

  /**
   * Generates the TransactionInput hash
   * @returns Returns the TransactionInput hash
   */
  getHash(): string {
    return sha256(
      this.previousTxHash + this.fromAddress + this.amount,
    ).toString()
  }

  /**
   * Validates the TransactionInput integrity
   * @returns Returns a Validation result object
   */
  isValid(): Validation {
    if (!this.previousTxHash)
      return new Validation(false, 'Previous TX is required')
    if (!this.signature) return new Validation(false, 'Signature is required')
    if (!this.fromAddress)
      return new Validation(false, 'From Address is required')
    if (!this.amount || this.amount < 1)
      return new Validation(false, 'Amount must be greater than zero')

    const hash = Buffer.from(this.getHash(), 'hex')
    const isValid = ECPair.fromPublicKey(
      Buffer.from(this.fromAddress, 'hex'),
    ).verify(hash, Buffer.from(this.signature, 'hex'))

    return isValid
      ? new Validation()
      : new Validation(false, 'Invalid Transaction Input Signature')
  }

  static fromTxo(txo: TransactionOutput): TransactionInput {
    return new TransactionInput({
      amount: txo.amount,
      fromAddress: txo.toAddress,
      previousTxHash: txo.txHash,
    } as TransactionInput)
  }
}
