import Block from './block';

/**
 * Blockchain class
 */
export default class Blockchain {
  blocks: Block[];
  nextIndex: number = 0;

  /**
   * Constructor for Blockchain class
   */
  constructor() {
    this.blocks = [new Block(this.nextIndex, '0', 'Genesis Block')];
    this.nextIndex++;
  }

  getLastBlock(): Block {
    return this.blocks[this.blocks.length - 1]
  }

  addBlock(block: Block): boolean {
    const lastBlock = this.getLastBlock();

    if (!block.isValid(lastBlock.index, lastBlock.hash)) return false;

    this.blocks.push(block);
    this.nextIndex++;

    return true;
  }

  isValid(): boolean {
    for (let i = this.blocks.length - 1; i > 0; i--) {
      const currentBlock = this.blocks[i]
      const previousBlock = this.blocks[i - 1]
      const isValid = currentBlock.isValid(previousBlock.index, previousBlock.hash)
      if (!isValid) return false
    }
    return true
  }
}
