import Block from './block'
import Validation from '../validation'
import NextBlockInfo from '../types/nextBlockInfo'
import Transaction from './transaction'
import TransactionSearch from '../types/transactionSearch'
import TransactionInput from './transactionInput'
import TransactionOutput from './transactionOutput'

/**
 * Mock Blockchain class
 */
export default class Blockchain {
  blocks: Block[]
  mempool: Transaction[]
  nextIndex: number = 0

  /**
   * Constructor for Mock Blockchain class
   */
  constructor(miner: string) {
    this.blocks = []
    this.mempool = []
    this.blocks.push(
      new Block({
        index: 0,
        hash: 'abc',
        previousHash: '0',
        miner,
        timestamp: Date.now(),
      } as Block),
    )
    this.nextIndex++
  }

  getLastBlock(): Block {
    return this.blocks[this.blocks.length - 1]
  }

  addBlock(block: Block): Validation {
    if (block.index < 0) return new Validation(false, 'Invalid Mock Block')

    this.blocks.push(block)
    this.nextIndex++

    return new Validation()
  }

  addTransaction(transaction: Transaction): Validation {
    const validation = transaction.isValid(1, 10)
    if (!validation.success) return validation

    this.mempool.push(transaction)
    return new Validation()
  }

  getTransaction(hash: string): TransactionSearch {
    if (hash === '-1')
      return { mempoolIndex: -1, blockIndex: -1 } as TransactionSearch

    return {
      mempoolIndex: 0,
      transaction: new Transaction(),
    } as TransactionSearch
  }

  getBlock(hash: string): Block | undefined {
    if (!hash || hash === '-1') return undefined
    return this.blocks.find((block) => block.hash === hash)
  }

  isValid(): Validation {
    return new Validation()
  }

  getFeePerTx(): number {
    return 1
  }

  getNextBlock(): NextBlockInfo {
    return {
      transactions: this.mempool.slice(0, 2),
      difficulty: 2,
      previousHash: this.getLastBlock().hash,
      index: this.blocks.length,
      feePerTx: this.getFeePerTx(),
      maxDifficulty: 62,
    } as NextBlockInfo
  }

  getTxInputs(wallet: string): (TransactionInput | undefined)[] {
    return [
      new TransactionInput({
        amount: 1,
        fromAddress: wallet,
        previousTxHash: 'abc',
        signature: 'abc',
      } as TransactionInput),
    ]
  }

  getTxOutputs(wallet: string): TransactionOutput[] {
    return [
      new TransactionOutput({
        amount: 1,
        toAddress: wallet,
        txHash: 'abc',
      } as TransactionOutput),
    ]
  }

  getUTXO(wallet: string): TransactionOutput[] {
    return this.getTxOutputs(wallet)
  }

  getBalance(wallet: string): number {
    return 10
  }
}
