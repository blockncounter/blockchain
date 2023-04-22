import Validation from '../validation';

/**
 * Mock Block class
 */
export default class Block {
  index: number;
  timestamp: number;
  hash: string;
  previousHash: string;
  data: string;

  /**
   * Constructor for Mock Block class
   * @param block The Mock Block attributes
   */
  constructor(block?: Block) {
    this.index = block?.index || 0;
    this.timestamp = block?.timestamp || Date.now();
    this.previousHash = block?.previousHash || '';
    this.data = block?.data || '';
    this.hash = block?.hash || this.getHash();
  }

  getHash(): string {
    return this.hash || 'cbc0401163a8784b7feb36c149d7ce257bf78396251de8429bad39d252578396'
  }

  /**
   * Validates the Mock Block
   * @returns {boolean} Returns true if the Mock Block is valid
   */
  isValid(
    previousIndex: number,
    previousHash: string
  ): Validation {
    if (!previousHash || previousIndex < 0 || this.index < 1)
      return new Validation(false, 'Invalid Mock Block')

    return new Validation();
  }
}
