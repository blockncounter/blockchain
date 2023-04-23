import Block from './block';
import Validation from './validation';
import NextBlockInfo from './types/nextBlockInfo';
import Transaction from './transaction';
import { TransactionType } from './types/transactionType';

/**
 * Blockchain class
 */
export default class Blockchain {
  blocks: Block[]
  nextIndex: number = 0
  static readonly DIFFICULTY_FACTOR = 5
  static readonly MAX_DIFFICULTY = 62

  /**
   * Constructor for Blockchain class
   */
  constructor() {
    this.blocks = [new Block({
      index: this.nextIndex,
      previousHash: '0',
      transactions: [new Transaction({
        type: TransactionType.FEE,
        data: 'Genesis block'
      } as Transaction)] as Transaction[]
    } as Block)];
    this.nextIndex++;
    Blockchain.DIFFICULTY_FACTOR
  }

  getLastBlock(): Block {
    return this.blocks[this.blocks.length - 1]
  }

  getDifficulty(): number {
    return Math.ceil(this.blocks.length / Blockchain.DIFFICULTY_FACTOR)
  }

  addBlock(block: Block): Validation {
    const lastBlock = this.getLastBlock();
    const validation = block.isValid({
      previousIndex: lastBlock.index,
      previousHash: lastBlock.hash,
      difficulty: this.getDifficulty()
    })

    if (!validation.success)
      return new Validation(false, `Invalid block: ${validation.message}`);

    this.blocks.push(block);
    this.nextIndex++;

    return new Validation(true, 'Block added');
  }

  getBlock(hash: string): Block | undefined {
    return this.blocks.find(block => block.hash === hash)
  }

  isValid(): Validation {
    for (let i = this.blocks.length - 1; i > 0; i--) {
      const currentBlock = this.blocks[i]
      const previousBlock = this.blocks[i - 1]
      const validation = currentBlock.isValid({
        previousIndex: previousBlock.index,
        previousHash: previousBlock.hash,
        difficulty: this.getDifficulty()
      })
      if (!validation.success)
        return new Validation(false, `Invalid block #${currentBlock.index}: ${validation.message}`)
    }
    return new Validation();
  }

  getFeePerTx(): number {
    return 1
  }

  getNextBlock(): NextBlockInfo {
    return {
      transactions: [new Transaction({
        data: new Date().toString()
      } as Transaction)],
      difficulty: this.getDifficulty(),
      previousHash: this.getLastBlock().hash,
      index: this.blocks.length,
      feePerTx: this.getFeePerTx(),
      maxDifficulty: Blockchain.MAX_DIFFICULTY
    } as NextBlockInfo
  }
}
