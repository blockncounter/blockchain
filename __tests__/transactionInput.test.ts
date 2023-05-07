import { describe, it, expect, beforeAll } from '@jest/globals'
import Wallet from '../src/lib/wallet'
import TransactionInput from '../src/lib/transactionInput'

describe('Transaction Input tests', () => {
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
})
