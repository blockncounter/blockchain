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
  const exampleDifficulty = 1
  let alice: Wallet
  let genesis: Block

  beforeAll(() => {
    alice = new Wallet()

    genesis = new Block({
      transactions: [
        new Transaction({
          type: TransactionType.FEE,
          txInputs: [new TransactionInput()],
        } as Transaction),
      ] as Transaction[],
    } as Block)
  })

  it('should be valid', () => {
    const block = new Block({
      index: 1,
      previousHash: genesis.hash,
      transactions: [] as Transaction[],
    } as Block)

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
    })

    expect(valid.success).toBeTruthy()
  })

  it('should NOT be valid (no fee tx)', () => {
    const block = new Block({
      index: 1,
      previousHash: genesis.hash,
      transactions: [
        new Transaction({
          txInputs: [new TransactionInput()],
        } as Transaction),
      ] as Transaction[],
    } as Block)

    block.mine({ difficulty: exampleDifficulty, miner: alice.publicKey })

    const valid = block.isValid({
      previousIndex: genesis.index,
      previousHash: genesis.hash,
      difficulty: exampleDifficulty,
    })

    expect(valid.success).toBeFalsy()
  })

  it('should NOT be valid (fallbacks)', () => {
    const block = new Block()
    const valid = block.isValid({
      previousIndex: genesis.index,
      previousHash: genesis.hash,
      difficulty: exampleDifficulty,
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
    const block = new Block({
      index: -1,
      previousHash: genesis.hash,
      transactions: [] as Transaction[],
    } as Block)

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
    block.mine({
      difficulty: exampleDifficulty,
      miner: alice.publicKey,
    })

    const valid = block.isValid({
      previousIndex: genesis.index,
      previousHash: genesis.hash,
      difficulty: exampleDifficulty,
    })
    expect(valid.success).toBeFalsy()
  })

  it('should NOT be valid (invalid timestamp)', () => {
    const block = new Block({
      index: 1,
      previousHash: genesis.hash,
      transactions: [] as Transaction[],
    } as Block)
    block.timestamp = -1

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
    block.mine({
      difficulty: exampleDifficulty,
      miner: alice.publicKey,
    })

    const valid = block.isValid({
      previousIndex: genesis.index,
      previousHash: genesis.hash,
      difficulty: exampleDifficulty,
    })
    expect(valid.success).toBeFalsy()
  })

  it('should NOT be valid (invalid previousHash)', () => {
    const block = new Block({
      index: 1,
      previousHash: '32dasdq3da',
      transactions: [] as Transaction[],
    } as Block)

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
    block.mine({
      difficulty: exampleDifficulty,
      miner: alice.publicKey,
    })

    const valid = block.isValid({
      previousIndex: genesis.index,
      previousHash: genesis.hash,
      difficulty: exampleDifficulty,
    })
    expect(valid.success).toBeFalsy()
  })

  it('should NOT be valid (txInput)', () => {
    const txInputs = [new TransactionInput()]
    txInputs[0].amount = -1

    const block = new Block({
      index: 1,
      previousHash: genesis.hash,
      transactions: [
        new Transaction({
          txInputs,
        } as Transaction),
      ] as Transaction[],
    } as Block)

    block.transactions.push(
      new Transaction({
        type: TransactionType.FEE,
        txOutputs: [new TransactionOutput()],
      } as Transaction),
    )

    block.hash = block.getHash()

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
      nonce: 0,
      miner: alice.publicKey,
      previousHash: genesis.hash,
      transactions: [] as Transaction[],
    } as Block)

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

    const valid = block.isValid({
      previousIndex: genesis.index,
      previousHash: genesis.hash,
      difficulty: exampleDifficulty,
    })
    expect(valid.success).toBeFalsy()
  })

  it('should NOT be valid (invalid hash)', () => {
    const block = new Block({
      index: 1,
      previousHash: genesis.hash,
      transactions: [] as Transaction[],
    } as Block)

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
          txInputs: [new TransactionInput()],
          type: TransactionType.FEE,
        } as Transaction),
        new Transaction({
          txInputs: [new TransactionInput()],
          type: TransactionType.FEE,
        } as Transaction),
      ] as Transaction[],
    } as Block)

    block.mine({ difficulty: exampleDifficulty, miner: alice.publicKey })

    const valid = block.isValid({
      previousIndex: genesis.index,
      previousHash: genesis.hash,
      difficulty: exampleDifficulty,
    })
    expect(valid.message).toBe('Invalid number of fees')
  })

  it('should NOT be valid (invalid tx)', () => {
    const block = new Block({
      index: 1,
      previousHash: genesis.hash,
      transactions: [] as Transaction[],
    } as Block)

    block.transactions.push(
      new Transaction({
        type: TransactionType.FEE,
        timestamp: -1,
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
    })
    expect(valid.success).toBeFalsy()
  })
})
