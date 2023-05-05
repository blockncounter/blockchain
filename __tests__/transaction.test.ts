import { describe, it, expect } from '@jest/globals'
import Transaction from '../src/lib/transaction'
import { TransactionType } from '../src/lib/types/transactionType'

describe('Transaction tests', () => {
  it('should be valid (REGULAR)', () => {
    const tx = new Transaction({
      data: 'tx',
    } as Transaction)

    const valid = tx.isValid()
    expect(valid.success).toBeTruthy()
  })

  it('should be valid (FEE)', () => {
    const tx = new Transaction({
      data: 'tx',
      type: TransactionType.FEE,
    } as Transaction)

    const valid = tx.isValid()
    expect(valid.success).toBeTruthy()
  })

  it('should NOT be valid (hash)', () => {
    const tx = new Transaction({
      data: 'tx',
      type: TransactionType.REGULAR,
      timestamp: Date.now(),
      hash: 'abc',
    } as Transaction)

    const valid = tx.isValid()
    expect(valid.success).toBeFalsy()
  })

  it('should NOT be valid (data)', () => {
    const tx = new Transaction()
    const valid = tx.isValid()
    expect(valid.success).toBeFalsy()
  })
})
