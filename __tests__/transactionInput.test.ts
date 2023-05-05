import { describe, it, expect, beforeAll } from '@jest/globals'
import Wallet from '../src/lib/wallet'
import TransactionInput from '../src/lib/transactionInput'

describe('Transaction Input tests', () => {
  let alice: Wallet

  beforeAll(() => {
    alice = new Wallet()
  })

  it('should be valid', () => {
    const txInput = new TransactionInput({
      amount: 10,
      fromAddress: alice.publicKey,
    } as TransactionInput)
    txInput.sign(alice.privateKey)

    const valid = txInput.isValid()
    expect(valid.success).toBeTruthy()
  })
})
