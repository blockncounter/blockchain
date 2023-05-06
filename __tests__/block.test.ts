import { jest, describe, it, expect, beforeAll } from '@jest/globals'
import Block from '../src/lib/block'
import Transaction from '../src/lib/transaction'
import NextBlockInfo from '../src/lib/types/nextBlockInfo'
import TransactionInput from '../src/lib/transactionInput'
import { TransactionType } from '../src/lib/types/transactionType'

jest.mock('../src/lib/transaction')
jest.mock('../src/lib/transactionInput')

describe('Block tests', () => {
  const exampleDifficulty = 0
  const exampleMiner = 'test'
  let genesis: Block

  beforeAll(() => {
    genesis = new Block({
      transactions: [
        new Transaction({
          type: TransactionType.FEE,
          txInput: new TransactionInput(),
        } as Transaction),
      ] as Transaction[],
    } as Block)
  })

  it('should be valid', () => {
    const block = new Block({
      index: 1,
      previousHash: genesis.hash,
      transactions: [
        new Transaction({
          txInput: new TransactionInput(),
        } as Transaction),
      ] as Transaction[],
    } as Block)

    block.mine({ difficulty: exampleDifficulty, miner: exampleMiner })

    const valid = block.isValid({
      previousIndex: genesis.index,
      previousHash: genesis.hash,
      difficulty: exampleDifficulty,
    })

    expect(valid.success).toBeTruthy()
  })

  it('should create a Block from next Block info', () => {
    const block = Block.fromNextBlockInfo({
      index: 1,
      previousHash: genesis.hash,
      transactions: [
        new Transaction({
          txInput: new TransactionInput(),
        } as Transaction),
      ] as Transaction[],
      difficulty: exampleDifficulty,
      feePerTx: 1,
      maxDifficulty: 62,
    } as NextBlockInfo)
    block.mine({ difficulty: exampleDifficulty, miner: exampleMiner })

    const valid = block.isValid({
      previousIndex: genesis.index,
      previousHash: genesis.hash,
      difficulty: exampleDifficulty,
    })

    expect(valid.success).toBeTruthy()
  })

  it('should NOT be valid (fallbacks)', () => {
    const block = new Block()
    const valid = block.isValid({
      previousIndex: genesis.index,
      previousHash: genesis.hash,
      difficulty: exampleDifficulty,
    })
    expect(valid.success).toBeFalsy()
  })

  it('should NOT be valid (index)', () => {
    const block = new Block({
      index: -1,
      previousHash: genesis.hash,
      transactions: [
        new Transaction({
          txInput: new TransactionInput(),
        } as Transaction),
      ] as Transaction[],
    } as Block)
    const valid = block.isValid({
      previousIndex: genesis.index,
      previousHash: genesis.hash,
      difficulty: exampleDifficulty,
    })
    expect(valid.success).toBeFalsy()
  })

  it('should NOT be valid (timestamp)', () => {
    const block = new Block({
      index: 1,
      previousHash: genesis.hash,
      transactions: [
        new Transaction({
          txInput: new TransactionInput(),
        } as Transaction),
      ] as Transaction[],
    } as Block)
    block.timestamp = -1
    const valid = block.isValid({
      previousIndex: genesis.index,
      previousHash: genesis.hash,
      difficulty: exampleDifficulty,
    })
    expect(valid.success).toBeFalsy()
  })

  it('should NOT be valid (previousHash)', () => {
    const block = new Block({
      index: 1,
      previousHash: '32dasdq3da',
      transactions: [
        new Transaction({
          txInput: new TransactionInput(),
        } as Transaction),
      ] as Transaction[],
    } as Block)
    const valid = block.isValid({
      previousIndex: genesis.index,
      previousHash: genesis.hash,
      difficulty: exampleDifficulty,
    })
    expect(valid.success).toBeFalsy()
  })

  it('should NOT be valid (txInput)', () => {
    const txInput = new TransactionInput()
    txInput.amount = -1

    const block = new Block({
      index: 1,
      previousHash: genesis.hash,
      transactions: [
        new Transaction({
          txInput,
        } as Transaction),
      ] as Transaction[],
    } as Block)
    const valid = block.isValid({
      previousIndex: genesis.index,
      previousHash: genesis.hash,
      difficulty: exampleDifficulty,
    })
    expect(valid.success).toBeFalsy()
  })

  it('should NOT be valid (no miner)', () => {
    const block = new Block({
      index: 1,
      previousHash: genesis.hash,
      transactions: [
        new Transaction({
          txInput: new TransactionInput(),
        } as Transaction),
      ] as Transaction[],
    } as Block)

    const valid = block.isValid({
      previousIndex: genesis.index,
      previousHash: genesis.hash,
      difficulty: exampleDifficulty,
    })
    expect(valid.success).toBeFalsy()
  })

  it('should NOT be valid (hash)', () => {
    const block = new Block({
      index: 1,
      previousHash: genesis.hash,
      transactions: [
        new Transaction({
          txInput: new TransactionInput(),
        } as Transaction),
      ] as Transaction[],
    } as Block)

    block.mine({ difficulty: exampleDifficulty, miner: exampleMiner })
    block.hash = '23rdsadaa'

    const valid = block.isValid({
      previousIndex: genesis.index,
      previousHash: genesis.hash,
      difficulty: exampleDifficulty,
    })
    expect(valid.success).toBeFalsy()
  })

  it("should return 'Invalid number of fees'", () => {
    const block = new Block({
      index: 1,
      previousHash: genesis.hash,
      transactions: [
        new Transaction({
          txInput: new TransactionInput(),
          type: TransactionType.FEE,
        } as Transaction),
        new Transaction({
          txInput: new TransactionInput(),
          type: TransactionType.FEE,
        } as Transaction),
      ] as Transaction[],
    } as Block)

    block.mine({ difficulty: exampleDifficulty, miner: exampleMiner })

    const valid = block.isValid({
      previousIndex: genesis.index,
      previousHash: genesis.hash,
      difficulty: exampleDifficulty,
    })
    expect(valid.message).toBe('Invalid number of fees')
  })

  it('should NOT be valid (invalid transactions)', () => {
    const block = new Block({
      index: 1,
      previousHash: genesis.hash,
      transactions: [new Transaction(), new Transaction()] as Transaction[],
    } as Block)

    block.mine({ difficulty: exampleDifficulty, miner: exampleMiner })

    block.transactions[0].to = ''

    const valid = block.isValid({
      previousIndex: genesis.index,
      previousHash: genesis.hash,
      difficulty: exampleDifficulty,
    })
    expect(valid.success).toBeFalsy()
  })
})
