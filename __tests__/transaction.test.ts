import { jest, describe, it, expect } from '@jest/globals'
import Transaction from '../src/lib/transaction'
import TransactionInput from '../src/lib/transactionInput'
import { TransactionType } from '../src/lib/types/transactionType'

jest.mock('../src/lib/transactionInput')

describe('Transaction tests', () => {
  it('should be valid (REGULAR)', () => {
    const tx = new Transaction({
      txInput: new TransactionInput(),
      to: 'walletTo',
    } as Transaction)

    const valid = tx.isValid()
    expect(valid.success).toBeTruthy()
  })

  it('should be valid (FEE)', () => {
    const tx = new Transaction({
      txInput: new TransactionInput(),
      to: 'walletTo',
      type: TransactionType.FEE,
    } as Transaction)
    tx.txInput = undefined
    tx.hash = tx.getHash()

    const valid = tx.isValid()
    expect(valid.success).toBeTruthy()
  })

  it('should NOT be valid (hash)', () => {
    const tx = new Transaction({
      txInput: new TransactionInput(),
      to: 'walletTo',
      type: TransactionType.REGULAR,
      timestamp: Date.now(),
      hash: 'abc',
    } as Transaction)

    const valid = tx.isValid()
    expect(valid.success).toBeFalsy()
  })

  it('should NOT be valid (invalid to)', () => {
    const tx = new Transaction()
    const valid = tx.isValid()
    expect(valid.success).toBeFalsy()
  })

  it('should NOT be valid (invalid txInput)', () => {
    const tx = new Transaction({
      to: 'walletTo',
      txInput: new TransactionInput({
        amount: -1,
        fromAddress: 'walletFrom',
        signature: 'abc',
      } as TransactionInput),
    } as Transaction)
    const valid = tx.isValid()
    expect(valid.success).toBeFalsy()
  })
})
