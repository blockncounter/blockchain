import sha256 from 'crypto-js/sha256';
import Validation from './validation';

/**
 * Block class
 */
export default class Block {
  index: number;
  timestamp: number;
  hash: string;
  previousHash: string;
  data: string;

  /**
   * Constructor for Block class
   * @param index The Block index in the Blockchain
   * @param hash The Block hash
   * @param previousHash The previous Block hash
   * @param data The Block data
   */
  constructor(
    index: number,
    previousHash: string,
    data: string
  ) {
    this.index = index;
    this.timestamp = Date.now();
    this.previousHash = previousHash;
    this.data = data;
    this.hash = this.getHash();
  }

  getHash(): string {
    return sha256(
      this.index +
      this.data +
      this.previousHash +
      this.timestamp
    ).toString()
  }

  /**
   * Validates the Block
   * @returns {boolean} Returns true if the Block is valid
   */
  isValid(
    previousIndex: number,
    previousHash: string
  ): Validation {
    if (previousIndex !== this.index - 1) return new Validation(false, 'Invalid index');
    if (this.timestamp < 1) return new Validation(false, 'Invalid timestamp');
    if (previousHash !== this.previousHash) return new Validation(false, 'Invalid previous hash');
    if (!this.data) return new Validation(false, 'Invalid data');
    if (!this.hash || this.hash !== this.getHash()) return new Validation(false, 'Invalid hash');
    return new Validation();
  }
}
