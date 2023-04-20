import { describe, it, expect } from '@jest/globals'
import Blockchain from '../src/lib/blockchain'
import Block from '../src/lib/block'

describe('Blockchain tests', () => {
  it('should have genesis block', () => {
    const blockchain = new Blockchain()
    expect(blockchain.blocks.length).toEqual(1)
  })

  it('should be valid', () => {
    const blockchain = new Blockchain()
    expect(blockchain.isValid()).toBeTruthy()
  })

  it('should add a block', () => {
    const blockchain = new Blockchain()
    const result = blockchain.addBlock(new Block(1, blockchain.getLastBlock().hash, 'abc'))
    expect(result).toBeTruthy()
  })

  it('should NOT add a block (index)', () => {
    const blockchain = new Blockchain()
    const result = blockchain.addBlock(new Block(-1, blockchain.getLastBlock().hash, 'abc'))
    expect(result).toBeFalsy()
  })

  it('should be valid', () => {
    const blockchain = new Blockchain()
    blockchain.addBlock(new Block(1, blockchain.getLastBlock().hash, 'abc'))
    expect(blockchain.isValid()).toBeTruthy()
  })

  it('should NOT be valid', () => {
    const blockchain = new Blockchain()
    blockchain.addBlock(new Block(1, blockchain.getLastBlock().hash, 'abc'))
    blockchain.blocks[1].data = 'def'
    expect(blockchain.isValid()).toBeFalsy()
  })
})
