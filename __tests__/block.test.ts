import { describe, it, expect, beforeAll } from '@jest/globals'
import Block from '../src/lib/block'

describe('Block tests', () => {
  let genesis: Block;

  beforeAll(() => {
    genesis = new Block({
      data: 'Genesis Block'
    } as Block)
  })

  it('should be valid', () => {
    const block = new Block({
      index: 1,
      previousHash: genesis.hash,
      data: 'Block 2'
    } as Block)
    const valid = block.isValid(genesis.index, genesis.hash)
    expect(valid.success).toBeTruthy()
  })

  it('should NOT be valid (fallbacks)', () => {
    const block = new Block()
    const valid = block.isValid(genesis.index, genesis.hash)
    expect(valid.success).toBeFalsy()
  })

  it('should NOT be valid (index)', () => {
    const block = new Block({
      index: -1,
      previousHash: genesis.hash,
      data: 'Block 2'
    } as Block)
    const valid = block.isValid(genesis.index, genesis.hash)
    expect(valid.success).toBeFalsy()
  })

  it('should NOT be valid (timestamp)', () => {
    const block = new Block({
      index: 1,
      previousHash: genesis.hash,
      data: 'Block 2'
    } as Block)
    block.timestamp = -1
    const valid = block.isValid(genesis.index, genesis.hash)
    expect(valid.success).toBeFalsy()
  })

  it('should NOT be valid (previousHash)', () => {
    const block = new Block({
      index: 1,
      previousHash: '32dasdq3da',
      data: 'Block 2'
    } as Block)
    const valid = block.isValid(genesis.index, genesis.hash)
    expect(valid.success).toBeFalsy()
  })

  it('should NOT be valid (data)', () => {
    const block = new Block({
      index: 1,
      previousHash: genesis.hash,
      data: ''
    } as Block)
    const valid = block.isValid(genesis.index, genesis.hash)
    expect(valid.success).toBeFalsy()
  })

  it('should NOT be valid (hash)', () => {
    const block = new Block({
      index: 1,
      previousHash: genesis.hash,
      data: 'Block 2'
    } as Block)
    block.hash = '23rdsadaa'
    const valid = block.isValid(genesis.index, genesis.hash)
    expect(valid.success).toBeFalsy()
  })
})
