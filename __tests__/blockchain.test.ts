import { describe, it, expect, jest } from '@jest/globals'
import Blockchain from '../src/lib/blockchain'
import Block from '../src/lib/block'

jest.mock('../src/lib/block')

describe('Blockchain tests', () => {
  it('should have genesis block', () => {
    const blockchain = new Blockchain()
    expect(blockchain.blocks.length).toEqual(1)
  })

  it('should be valid', () => {
    const blockchain = new Blockchain()
    expect(blockchain.isValid().success).toBeTruthy()
  })

  it('should add a block', () => {
    const blockchain = new Blockchain()
    const result = blockchain.addBlock(new Block({
      index: 1,
      previousHash: blockchain.getLastBlock().hash,
      data: 'Block 2'
    } as Block))

    expect(result.success).toBeTruthy()
  })

  it('should NOT add a block (index)', () => {
    const blockchain = new Blockchain()
    const result = blockchain.addBlock(new Block({
      index: -1,
      previousHash: blockchain.getLastBlock().hash,
      data: 'Block 2'
    } as Block))
    expect(result.success).toBeFalsy()
  })

  it('should return a block', () => {
    const blockchain = new Blockchain()
    const block = blockchain.getBlock(blockchain.getLastBlock().hash)
    expect(block).toBeTruthy()
  })

  it('should NOT return a block', () => {
    const blockchain = new Blockchain()
    const block = blockchain.getBlock(blockchain.getLastBlock().data)
    expect(block).toBeFalsy()
  })

  it('should be valid (two blocks)', () => {
    const blockchain = new Blockchain()
    blockchain.addBlock(new Block({
      index: 1,
      previousHash: blockchain.getLastBlock().hash,
      data: 'Block 2'
    } as Block))
    expect(blockchain.isValid().success).toBeTruthy()
  })

  it('should NOT be valid (two blocks)', () => {
    const blockchain = new Blockchain()

    blockchain.addBlock(new Block({
      index: 1,
      previousHash: blockchain.getLastBlock().hash,
      data: 'Block 2'
    } as Block))

    blockchain.blocks[1].index = -1

    expect(blockchain.isValid().success).toBeFalsy()
  })

  it('should get the next Block info', () => {
    const blockchain = new Blockchain()
    const nextBlockInfo = blockchain.getNextBlock()
    expect(nextBlockInfo.index).toEqual(1)
  })
})
