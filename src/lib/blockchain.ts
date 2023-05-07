import Block from './block'
import Validation from './validation'
import NextBlockInfo from './types/nextBlockInfo'
import Transaction from './transaction'
import TransactionOutput from './transactionOutput'
import TransactionSearch from './types/transactionSearch'
import { TransactionType } from './types/transactionType'

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
  constructor(miner: string) {
    this.blocks = []
    this.mempool = []
    this.blocks.push(this.createGenesisBlock(miner))
    this.nextIndex++
  }

  createGenesisBlock(miner: string): Block {
    const amount = 10 // TODO: calculate fee amount
    const tx = new Transaction({
      type: TransactionType.FEE,
      txOutputs: [
        new TransactionOutput({
          amount,
          toAddress: miner,
        } as TransactionOutput),
      ],
    } as Transaction)

    tx.getHash()
    tx.txOutputs[0].txHash = tx.hash

    const block = new Block()
    block.transactions.push(tx)
    block.mine({ difficulty: this.getDifficulty(), miner })

    return block
  }

  getLastBlock(): Block {
    return this.blocks[this.blocks.length - 1]
  }

  getDifficulty(): number {
    return Math.ceil(this.blocks.length / Blockchain.DIFFICULTY_FACTOR) + 1
  }

  addTransaction(transaction: Transaction): Validation {
    if (transaction.txInputs && transaction.txInputs.length) {
      const from = transaction.txInputs[0].fromAddress
      const pendingTx = this.mempool
        .filter((tx) => tx?.txInputs?.length)
        .map((tx) => tx?.txInputs?.filter((txi) => txi.fromAddress === from))

      if (pendingTx && pendingTx.length)
        return new Validation(
          false,
          'Sender wallet already has a pending transaction.',
        )

      // TODO: validate if the sender wallet has enough balance (UTXO)
    }

    const validation = transaction.isValid()
    if (!validation.success)
      return new Validation(false, `Invalid transaction: ${validation.message}`)

    if (
      this.blocks.some((block) =>
        block.transactions.some((tx) => tx.hash === transaction.hash),
      )
    )
      return new Validation(false, 'Duplicated transaction in the Blockchain')

    // if (this.mempool.some((tx) => tx.hash === transaction.hash))
    //   return new Validation(false, 'Duplicated transaction in the Mempool')

    this.mempool.push(transaction)
    return new Validation(true, transaction.hash)
  }

  addBlock(block: Block): Validation {
    const nextBlock = this.getNextBlock()
    if (!nextBlock) return new Validation(false, 'There is no next block info')

    const validation = block.isValid({
      previousIndex: nextBlock.index - 1,
      previousHash: nextBlock.previousHash,
      difficulty: nextBlock.difficulty,
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
