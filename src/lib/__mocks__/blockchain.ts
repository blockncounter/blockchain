import Block from './block';
import Validation from '../validation';
import NextBlockInfo from '../types/nextBlockInfo';
import Transaction from './transaction';
import { TransactionType } from '../types/transactionType';
import TransactionSearch from '../types/transactionSearch';

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
  constructor() {
    this.mempool = []
    this.blocks = [new Block({
      index: 0,
      previousHash: '0',
      transactions: [new Transaction({
        type: TransactionType.FEE,
        data: 'tx1',
        hash: '123'
      } as Transaction)] as Transaction[],
      timestamp: Date.now(),
      hash: 'cbc0401163a8784b7feb36c149d7ce257bf78396251de8429bad39d252578396'
    } as Block)]
    this.nextIndex++
  }

  getLastBlock(): Block {
    return this.blocks[this.blocks.length - 1]
  }

  addBlock(block: Block): Validation {
    if (block.index < 0) return new Validation(false, 'Invalid Mock Block');

    this.blocks.push(block);
    this.nextIndex++;

    return new Validation();
  }

  addTransaction(transaction: Transaction): Validation {
    const validation = transaction.isValid()
    if (!validation.success) return validation

    this.mempool.push(transaction)
    return new Validation()
  }

  getTransaction(hash: string): TransactionSearch {
    return {
      mempoolIndex: 0,
      transaction: {
        hash: hash
      }
    } as TransactionSearch
  }

  getBlock(hash: string): Block | undefined {
    return this.blocks.find(block => block.hash === hash)
  }

  isValid(): Validation {
    return new Validation();
  }

  getFeePerTx(): number {
    return 1
  }

  getNextBlock(): NextBlockInfo {
    return {
      transactions: [new Transaction({
        data: new Date().toString()
      } as Transaction)] as Transaction[],
      difficulty: 0,
      previousHash: 'f62d7db7c373db651a9ac2d37136b36decbb59183ec1be04b42b2b9f77945c59',
      index: 1,
      feePerTx: this.getFeePerTx(),
      maxDifficulty: 62
    } as NextBlockInfo
  }
}
