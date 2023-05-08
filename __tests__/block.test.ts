import { jest, describe, it, expect, beforeAll } from '@jest/globals'
import Block from '../src/lib/block'
import Transaction from '../src/lib/transaction'
import NextBlockInfo from '../src/lib/types/nextBlockInfo'
import TransactionInput from '../src/lib/transactionInput'
import { TransactionType } from '../src/lib/types/transactionType'
import TransactionOutput from '../src/lib/transactionOutput'
import Wallet from '../src/lib/wallet'

jest.mock('../src/lib/transaction')
jest.mock('../src/lib/transactionInput')
jest.mock('../src/lib/transactionOutput')

describe('Block tests', () => {
  const exampleDifficulty: number = 1
  const exampleFee: number = 1
  const exampleTx: string =
    '03529b61907433d9bb7d78f12fb237491fef7f5095ddc7a5744f5350b9bb35b21c'
  let alice: Wallet
  let bob: Wallet
  let genesis: Block

  beforeAll(() => {
    alice = new Wallet()
    bob = new Wallet()

    genesis = new Block({
      transactions: [
        new Transaction({
          type: TransactionType.FEE,
          txInputs: [new TransactionInput()],
        } as Transaction),
      ] as Transaction[],
    } as Block)
  })

  function getFullBlock(): Block {
    const txIn = new TransactionInput({
      amount: 10,
      fromAddress: alice.publicKey,
      previousTxHash: exampleTx,
    } as TransactionInput)
    txIn.sign(alice.privateKey)

    const txOut = new TransactionOutput({
      amount: 10,
      toAddress: bob.publicKey,
    } as TransactionOutput)

    const tx = new Transaction({
      txInputs: [txIn],
      txOutputs: [txOut],
    } as Transaction)

    const txFee = new Transaction({
      type: TransactionType.FEE,
      txOutputs: [
        new TransactionOutput({
          amount: 1,
          toAddress: alice.publicKey,
        } as TransactionOutput),
      ],
    } as Transaction)

    const block = new Block({
      index: 1,
      transactions: [tx, txFee],
      previousHash: genesis.hash,
    } as Block)

    block.mine({ difficulty: exampleDifficulty, miner: alice.publicKey })

    return block
  }

  it('should be valid', () => {
    const block = getFullBlock()

    const valid = block.isValid({
      previousIndex: genesis.index,
      previousHash: genesis.hash,
      difficulty: exampleDifficulty,
      feePerTx: exampleFee,
    })

    expect(valid.success).toBeTruthy()
  })

  it('should create a Block from next Block info', () => {
    const block = Block.fromNextBlockInfo({
      index: 1,
      previousHash: genesis.hash,
      transactions: [] as Transaction[],
      difficulty: exampleDifficulty,
      feePerTx: 1,
      maxDifficulty: 62,
    } as NextBlockInfo)

    block.transactions.push(
      new Transaction({
        type: TransactionType.FEE,
        txOutputs: [
          new TransactionOutput({
            toAddress: alice.publicKey,
            amount: 1,
          } as TransactionOutput),
        ],
      } as Transaction),
    )

    block.hash = block.getHash()
    block.mine({ difficulty: exampleDifficulty, miner: alice.publicKey })

    const valid = block.isValid({
      previousIndex: genesis.index,
      previousHash: genesis.hash,
      difficulty: exampleDifficulty,
      feePerTx: exampleFee,
    })

    expect(valid.success).toBeTruthy()
  })

  it('should NOT be valid (no fee tx)', () => {
    const block = getFullBlock()
    block.transactions = [block.transactions[0]]
    // block.hash = block.getHash()
    // block.mine({ difficulty: exampleDifficulty, miner: alice.publicKey })

    const valid = block.isValid({
      previousIndex: genesis.index,
      previousHash: genesis.hash,
      difficulty: exampleDifficulty,
      feePerTx: exampleFee,
    })

    expect(valid.success).toBeFalsy()
  })

  it('should NOT be valid (fallbacks)', () => {
    const block = new Block()
    const valid = block.isValid({
      previousIndex: genesis.index,
      previousHash: genesis.hash,
      difficulty: exampleDifficulty,
      feePerTx: exampleFee,
    })

    block.transactions.push(
      new Transaction({
        type: TransactionType.FEE,
        txOutputs: [new TransactionOutput()],
      } as Transaction),
    )

    block.hash = block.getHash()

    expect(valid.success).toBeFalsy()
  })

  it('should NOT be valid (invalid index)', () => {
    const block = getFullBlock()
    block.index = -1
    block.hash = block.getHash()
    block.mine({ difficulty: exampleDifficulty, miner: alice.publicKey })

    const valid = block.isValid({
      previousIndex: genesis.index,
      previousHash: genesis.hash,
      difficulty: exampleDifficulty,
      feePerTx: exampleFee,
    })
    expect(valid.success).toBeFalsy()
  })

  it('should NOT be valid (invalid timestamp)', () => {
    const block = getFullBlock()
    block.transactions[0].timestamp = -1
    block.hash = block.getHash()
    block.mine({
      difficulty: exampleDifficulty,
      miner: alice.publicKey,
    })

    const valid = block.isValid({
      previousIndex: genesis.index,
      previousHash: genesis.hash,
      difficulty: exampleDifficulty,
      feePerTx: exampleFee,
    })
    expect(valid.success).toBeFalsy()
  })

  it('should NOT be valid (invalid previousHash)', () => {
    const block = getFullBlock()
    block.previousHash = 'invalid'
    block.hash = block.getHash()
    block.mine({
      difficulty: exampleDifficulty,
      miner: alice.publicKey,
    })

    const valid = block.isValid({
      previousIndex: genesis.index,
      previousHash: genesis.hash,
      difficulty: exampleDifficulty,
      feePerTx: exampleFee,
    })
    expect(valid.success).toBeFalsy()
  })

  it('should NOT be valid (no miner)', () => {
    const block = getFullBlock()
    block.nonce = 0

    block.hash = block.getHash()

    const valid = block.isValid({
      previousIndex: genesis.index,
      previousHash: genesis.hash,
      difficulty: exampleDifficulty,
      feePerTx: exampleFee,
    })
    expect(valid.success).toBeFalsy()
  })

  it('should NOT be valid (invalid hash)', () => {
    const block = getFullBlock()
    block.hash = '23rdsadaa'

    const valid = block.isValid({
      previousIndex: genesis.index,
      previousHash: genesis.hash,
      difficulty: exampleDifficulty,
      feePerTx: exampleFee,
    })
    expect(valid.success).toBeFalsy()
  })

  it("should return 'Invalid number of fees'", () => {
    const block = getFullBlock()

    block.transactions.push(
      new Transaction({
        txInputs: undefined,
        txOutputs: [new TransactionOutput()],
        type: TransactionType.FEE,
      } as Transaction),
    )

    block.mine({ difficulty: exampleDifficulty, miner: alice.publicKey })

    const valid = block.isValid({
      previousIndex: genesis.index,
      previousHash: genesis.hash,
      difficulty: exampleDifficulty,
      feePerTx: exampleFee,
    })
    expect(valid.message).toBe('Invalid number of fees')
  })

  it('should NOT be valid (invalid tx)', () => {
    const block = getFullBlock()
    block.transactions[1].timestamp = -1

    block.hash = block.getHash()
    block.mine({ difficulty: exampleDifficulty, miner: alice.publicKey })

    const valid = block.isValid({
      previousIndex: genesis.index,
      previousHash: genesis.hash,
      difficulty: exampleDifficulty,
      feePerTx: exampleFee,
    })
    expect(valid.success).toBeFalsy()
  })
})
