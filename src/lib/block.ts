import sha256 from 'crypto-js/sha256';
import Validation from './validation';

interface mineParams {
  difficulty: number;
  miner: string;
}

export interface isValidParams {
  previousIndex: number;
  previousHash: string;
  difficulty: number;
}

/**
 * Block class
 */
export default class Block {
  index: number;
  timestamp: number;
  hash: string;
  previousHash: string;
  data: string;
  nonce: number;
  miner: string;

  /**
   * Constructor for Block class
   * @param block The Block attributes
   */
  constructor(block?: Block) {
    this.index = block?.index || 0;
    this.timestamp = block?.timestamp || Date.now();
    this.previousHash = block?.previousHash || '';
    this.data = block?.data || '';
    this.nonce = block?.nonce || 0;
    this.miner = block?.miner || '';
    this.hash = block?.hash || this.getHash();
  }

  getHash(): string {
    return sha256(
      this.index +
      this.data +
      this.previousHash +
      this.timestamp +
      this.nonce +
      this.miner
    ).toString()
  }

  /**
   * Mines the Block by finding a hash that starts with the given prefix
   * @param difficulty The Blockchain current difficulty
   * @param miner The miner wallet address
   */
  mine({ difficulty, miner }: mineParams) {
    this.miner = miner
    const prefix = new Array(difficulty + 1).join('0')

    do {
      this.nonce++
      this.hash = this.getHash()
    }
    while (!this.hash.startsWith(prefix))
  }

  /**
   * Validates the Block
   * @returns previousIndex The previous Block index
   * @returns previousHash The previous Block hash
   * @returns difficulty The Blockchain current difficulty
   */
  isValid({ previousIndex, previousHash, difficulty }: isValidParams): Validation {
    if (previousIndex !== this.index - 1) return new Validation(false, 'Invalid index');
    if (this.timestamp < 1) return new Validation(false, 'Invalid timestamp');
    if (previousHash !== this.previousHash) return new Validation(false, 'Invalid previous hash');
    if (!this.data) return new Validation(false, 'Invalid data');
    if (!this.nonce || !this.miner) return new Validation(false, 'Not mined');

    const prefix = new Array(difficulty + 1).join('0')
    if (this.hash !== this.getHash() || !this.hash.startsWith(prefix))
      return new Validation(false, 'Invalid hash');

    return new Validation();
  }
}
