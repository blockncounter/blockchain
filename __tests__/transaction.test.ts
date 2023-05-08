import { jest, describe, it, expect, beforeAll } from '@jest/globals'
import Wallet from '../src/lib/wallet'
import Transaction from '../src/lib/transaction'
import TransactionInput from '../src/lib/transactionInput'
import TransactionOutput from '../src/lib/transactionOutput'
import { TransactionType } from '../src/lib/types/transactionType'

jest.mock('../src/lib/transactionInput')
jest.mock('../src/lib/transactionOutput')

describe('Transaction tests', () => {
  const exampleDifficulty: number = 1
  const exampleFee: number = 1
  const exampleTx: string =
    '03529b61907433d9bb7d78f12fb237491fef7f5095ddc7a5744f5350b9bb35b21c'
  let alice: Wallet
  let bob: Wallet

  beforeAll(() => {
    alice = new Wallet()
    bob = new Wallet()
  })

  it('should be valid (REGULAR)', () => {
    const tx = new Transaction({
      txInputs: [new TransactionInput()],
      txOutputs: [new TransactionOutput()],
    } as Transaction)

    const valid = tx.isValid(exampleDifficulty, exampleFee)
    expect(valid.success).toBeTruthy()
  })

  it('Should be valid (FEE)', () => {
    const tx = new Transaction({
      txOutputs: [new TransactionOutput()],
      type: TransactionType.FEE,
    } as Transaction)

    tx.txInputs = undefined
    tx.hash = tx.getHash()

    const valid = tx.isValid(exampleDifficulty, exampleFee)
    console.log(valid)

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

    const valid = tx.isValid(exampleDifficulty, exampleFee)
    expect(valid.success).toBeFalsy()
  })

  it('should NOT be valid (invalid to)', () => {
    const tx = new Transaction()
    const valid = tx.isValid(exampleDifficulty, exampleFee)
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
    const valid = tx.isValid(exampleDifficulty, exampleFee)
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

    const valid = tx.isValid(exampleDifficulty, exampleFee)
    expect(valid.success).toBeFalsy()
  })

  it('should NOT be valid (TXO hash != TX hash)', () => {
    const tx = new Transaction({
      txInputs: [new TransactionInput()],
      txOutputs: [new TransactionOutput()],
    } as Transaction)
    tx.txOutputs[0].txHash = 'aj101dssuji1'

    const valid = tx.isValid(exampleDifficulty, exampleFee)
    expect(valid.success).toBeFalsy()
  })

  it('should get fee', () => {
    const txIn = new TransactionInput({
      amount: 11,
      fromAddress: alice.publicKey,
      previousTxHash: exampleTx,
    } as TransactionInput)

    const txOut = new TransactionOutput({
      amount: 10,
      toAddress: bob.publicKey,
    } as TransactionOutput)

    const tx = new Transaction({
      txInputs: [txIn],
      txOutputs: [txOut],
    } as Transaction)

    const fee = tx.getFee()

    expect(fee).toBeGreaterThan(0)
  })

  it('should get zero as fee', () => {
    const tx = new Transaction({
      txInputs: undefined,
    } as Transaction)

    const fee = tx.getFee()

    expect(fee).toEqual(0)
  })

  it('should create from reward', () => {
    const tx = Transaction.fromReward({
      amount: 10,
      toAddress: alice.publicKey,
      txHash: exampleTx,
    } as TransactionOutput)

    const valid = tx.isValid(exampleDifficulty, exampleFee)

    expect(valid.success).toBeTruthy()
  })

  it('should NOT be valid (fee excess)', () => {
    const txOut = new TransactionOutput({
      amount: Number.MAX_VALUE,
      toAddress: bob.publicKey,
    } as TransactionOutput)

    const tx = new Transaction({
      type: TransactionType.FEE,
      txOutputs: [txOut],
    } as Transaction)

    const valid = tx.isValid(exampleDifficulty, exampleFee)

    expect(valid.success).toBeFalsy()
  })
})
