import Block from './block'
import Validation from './validation'
import NextBlockInfo from './types/nextBlockInfo'
import Transaction from './transaction'
import { TransactionType } from './types/transactionType'
import TransactionSearch from './types/transactionSearch'

/**
 * Blockchain class
 */
export default class Blockchain {
  blocks: Block[]
  mempool: Transaction[]
  nextIndex: number = 0

  static readonly DIFFICULTY_FACTOR = 5
  static readonly MAX_TX_PER_BLOCK = 2
  static readonly MAX_DIFFICULTY = 62

  /**
   * Constructor for Blockchain class
   */
  constructor() {
    this.mempool = []
    this.blocks = [
      new Block({
        index: this.nextIndex,
        previousHash: '0',
        transactions: [
          new Transaction({
            type: TransactionType.FEE,
            data: 'Genesis Block',
          } as Transaction),
        ] as Transaction[],
      } as Block),
    ]
    this.nextIndex++
  }

  getLastBlock(): Block {
    return this.blocks[this.blocks.length - 1]
  }

  getDifficulty(): number {
    return Math.ceil(this.blocks.length / Blockchain.DIFFICULTY_FACTOR)
  }

  addTransaction(transaction: Transaction): Validation {
    const validation = transaction.isValid()
    if (!validation.success)
      return new Validation(false, `Invalid transaction: ${validation.message}`)

    if (
      this.blocks.some((block) =>
        block.transactions.some((tx) => tx.hash === transaction.hash),
      )
    )
      return new Validation(false, 'Duplicated transaction in the Blockchain')

    if (this.mempool.some((tx) => tx.hash === transaction.hash))
      return new Validation(false, 'Duplicated transaction in the Mempool')

    this.mempool.push(transaction)
    return new Validation(true, transaction.hash)
  }

  addBlock(block: Block): Validation {
    const lastBlock = this.getLastBlock()
    const validation = block.isValid({
      previousIndex: lastBlock.index,
      previousHash: lastBlock.hash,
      difficulty: this.getDifficulty(),
    })

    if (!validation.success)
      return new Validation(false, `Invalid block: ${validation.message}`)

    const txs = block.transactions
      .filter((tx) => tx.type === TransactionType.REGULAR)
      .map((tx) => tx.hash)
    const newMempool = this.mempool.filter((tx) => !txs.includes(tx.hash))
    if (newMempool.length + txs.length !== this.mempool.length)
      return new Validation(
        false,
        'Invalid tx in block: mempool does not match',
      )

    this.mempool = newMempool

    this.blocks.push(block)
    this.nextIndex++

    return new Validation(true, block.hash)
  }

  getBlock(hash: string): Block | undefined {
    return this.blocks.find((block) => block.hash === hash)
  }

  getTransaction(hash: string): TransactionSearch {
    const mempoolIndex = this.mempool.findIndex((tx) => tx.hash === hash)
    if (mempoolIndex !== -1)
      return {
        mempoolIndex,
        transaction: this.mempool[mempoolIndex],
      } as TransactionSearch

    const blockIndex = this.blocks.findIndex((block) =>
      block.transactions.some((tx) => tx.hash === hash),
    )
    if (blockIndex !== -1) {
      return {
        blockIndex,
        transaction: this.blocks[blockIndex].transactions.find(
          (tx) => tx.hash === hash,
        ),
      } as TransactionSearch
    }

    return { blockIndex: -1, mempoolIndex: -1 } as TransactionSearch
  }

  isValid(): Validation {
    for (let i = this.blocks.length - 1; i > 0; i--) {
      const currentBlock = this.blocks[i]
      const previousBlock = this.blocks[i - 1]
      const validation = currentBlock.isValid({
        previousIndex: previousBlock.index,
        previousHash: previousBlock.hash,
        difficulty: this.getDifficulty(),
      })
      if (!validation.success)
        return new Validation(
          false,
          `Invalid block #${currentBlock.index}: ${validation.message}`,
        )
    }
    return new Validation()
  }

  getFeePerTx(): number {
    return 1
  }

  getNextBlock(): NextBlockInfo | null {
    if (!this.mempool || !this.mempool.length) return null

    return {
      transactions: this.mempool.slice(0, Blockchain.MAX_TX_PER_BLOCK),
      difficulty: this.getDifficulty(),
      previousHash: this.getLastBlock().hash,
      index: this.blocks.length,
      feePerTx: this.getFeePerTx(),
      maxDifficulty: Blockchain.MAX_DIFFICULTY,
    } as NextBlockInfo
  }
}
