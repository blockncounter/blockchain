import { describe, it, expect, beforeAll } from '@jest/globals'
import Wallet from '../src/lib/wallet'
import TransactionInput from '../src/lib/transactionInput'
import TransactionOutput from '../src/lib/transactionOutput'

describe('Transaction Input tests', () => {
  const exampleTx: string =
    '03529b61907433d9bb7d78f12fb237491fef7f5095ddc7a5744f5350b9bb35b21c'
  let alice: Wallet
  let bob: Wallet

  beforeAll(() => {
    alice = new Wallet()
    bob = new Wallet()
  })

  it('should be valid', () => {
    const txInput = new TransactionInput({
      amount: 10,
      fromAddress: alice.publicKey,
      previousTxHash: 'abc',
    } as TransactionInput)
    txInput.sign(alice.privateKey)

    const valid = txInput.isValid()
    expect(valid.success).toBeTruthy()
  })

  it('should NOT be valid (default values)', () => {
    const txInput = new TransactionInput()
    txInput.sign(alice.privateKey)

    const valid = txInput.isValid()
    expect(valid.success).toBeFalsy()
  })

  it('should NOT be valid (empty signature)', () => {
    const txInput = new TransactionInput({
      amount: 10,
      fromAddress: alice.publicKey,
      previousTxHash: 'abc',
    } as TransactionInput)

    const valid = txInput.isValid()
    expect(valid.success).toBeFalsy()
  })

  it('should NOT be valid (invalid signature)', () => {
    const txInput = new TransactionInput({
      amount: 10,
      fromAddress: alice.publicKey,
      previousTxHash: 'abc',
    } as TransactionInput)
    txInput.sign(bob.privateKey)

    const valid = txInput.isValid()
    expect(valid.success).toBeFalsy()
  })

  it('should NOT be valid (invalid amount)', () => {
    const txInput = new TransactionInput({
      amount: -1,
      fromAddress: alice.publicKey,
      previousTxHash: 'abc',
    } as TransactionInput)
    txInput.sign(alice.privateKey)

    const valid = txInput.isValid()
    expect(valid.success).toBeFalsy()
  })

  it('should NOT be valid (invalid previousTxHash)', () => {
    const txInput = new TransactionInput({
      amount: -1,
      fromAddress: alice.publicKey,
    } as TransactionInput)
    txInput.sign(alice.privateKey)

    const valid = txInput.isValid()
    expect(valid.success).toBeFalsy()
  })

  it('should NOT be valid (invalid fromAddress)', () => {
    const txInput = new TransactionInput({
      amount: -1,
      previousTxHash: 'abc',
    } as TransactionInput)
    txInput.sign(alice.privateKey)

    const valid = txInput.isValid()
    expect(valid.success).toBeFalsy()
  })

  it('should create from TXO', () => {
    const txi = TransactionInput.fromTxo({
      amount: 10,
      toAddress: alice.publicKey,
      txHash: exampleTx,
    } as TransactionOutput)
    txi.sign(alice.privateKey)

    txi.amount = 11

    const valid = txi.isValid()
    expect(valid.success).toBeFalsy()
  })
})
