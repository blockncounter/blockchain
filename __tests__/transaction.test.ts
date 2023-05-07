import { jest, describe, it, expect } from '@jest/globals'
import Transaction from '../src/lib/transaction'
import TransactionInput from '../src/lib/transactionInput'
import TransactionOutput from '../src/lib/transactionOutput'
import { TransactionType } from '../src/lib/types/transactionType'

jest.mock('../src/lib/transactionInput')
jest.mock('../src/lib/transactionOutput')

describe('Transaction tests', () => {
  it('should be valid (REGULAR)', () => {
    const tx = new Transaction({
      txInputs: [new TransactionInput()],
      txOutputs: [new TransactionOutput()],
    } as Transaction)

    const valid = tx.isValid()
    expect(valid.success).toBeTruthy()
  })

  it('should be valid (FEE)', () => {
    const tx = new Transaction({
      txInputs: [new TransactionInput()],
      txOutputs: [new TransactionOutput()],
      type: TransactionType.FEE,
    } as Transaction)
    tx.txInputs = undefined
    tx.hash = tx.getHash()

    const valid = tx.isValid()
    expect(valid.success).toBeTruthy()
  })

  it('should NOT be valid (hash)', () => {
    const tx = new Transaction({
      txInputs: [new TransactionInput()],
      txOutputs: [new TransactionOutput()],
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
      txOutputs: [new TransactionOutput()],
      txInputs: [
        new TransactionInput({
          amount: -1,
          fromAddress: 'walletFrom',
          signature: 'abc',
        } as TransactionInput),
      ],
    } as Transaction)
    const valid = tx.isValid()
    expect(valid.success).toBeFalsy()
  })

  it('should NOT be valid (inputs < outputs)', () => {
    const tx = new Transaction({
      txInputs: [
        new TransactionInput({
          amount: 1,
          fromAddress: 'walletFrom',
          signature: 'abc',
        } as TransactionInput),
      ],
      txOutputs: [
        new TransactionOutput({
          amount: 2,
          toAddress: 'walletTo',
          txHash: 'abc',
        } as TransactionOutput),
      ],
    } as Transaction)

    const valid = tx.isValid()
    expect(valid.success).toBeFalsy()
  })

  it('should NOT be valid (TXO hash != TX hash)', () => {
    const tx = new Transaction({
      txInputs: [new TransactionInput()],
      txOutputs: [new TransactionOutput()],
    } as Transaction)
    tx.txOutputs[0].txHash = 'aj101dssuji1'

    const valid = tx.isValid()
    expect(valid.success).toBeFalsy()
  })
})
