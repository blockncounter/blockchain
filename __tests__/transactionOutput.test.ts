import { describe, it, expect, beforeAll } from '@jest/globals'
import Wallet from '../src/lib/wallet'
import TransactionOutput from '../src/lib/transactionOutput'

describe('Transaction Output tests', () => {
  let alice: Wallet

  beforeAll(() => {
    alice = new Wallet()
  })

  it('should be valid', () => {
    const txOutput = new TransactionOutput({
      amount: 10,
      toAddress: alice.publicKey,
      txHash: 'abc',
    } as TransactionOutput)

    const valid = txOutput.isValid()
    expect(valid.success).toBeTruthy()
  })
})
