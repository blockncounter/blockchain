import Block from './block';
import Validation from '../validation';

/**
 * Mock Blockchain class
 */
export default class Blockchain {
  blocks: Block[];
  nextIndex: number = 0;

  /**
   * Constructor for Mock Blockchain class
   */
  constructor() {
    this.blocks = [new Block({
      index: 0,
      previousHash: '0',
      data: 'Genesis Block',
      timestamp: Date.now(),
      hash: 'cbc0401163a8784b7feb36c149d7ce257bf78396251de8429bad39d252578396'
    } as Block)];
    this.nextIndex++;
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

  getBlock(hash: string): Block | undefined {
    return this.blocks.find(block => block.hash === hash)
  }

  isValid(): Validation {
    return new Validation();
  }
}
