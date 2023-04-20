import { describe, it, expect, beforeAll } from '@jest/globals'
import Block from '../src/lib/block'

describe('Block tests', () => {
  let genesis: Block;

  beforeAll(() => {
    genesis = new Block(0, '0', 'Genesis Block')
  })

  it('should be valid', () => {
    const block = new Block(1, genesis.hash, 'def')
    const valid = block.isValid(genesis.index, genesis.hash)
    expect(valid).toBeTruthy()
  })

  it('should NOT be valid (index)', () => {
    const block = new Block(-1, genesis.hash, 'abc')
    const valid = block.isValid(genesis.index, genesis.hash)
    expect(valid).toBeFalsy()
  })

  it('should NOT be valid (timestamp)', () => {
    const block = new Block(1, genesis.hash, 'abc')
    block.timestamp = -1
    const valid = block.isValid(genesis.index, genesis.hash)
    expect(valid).toBeFalsy()
  })

  it('should NOT be valid (previousHash)', () => {
    const block = new Block(1, '', 'abc')
    const valid = block.isValid(genesis.index, genesis.hash)
    expect(valid).toBeFalsy()
  })

  it('should NOT be valid (data)', () => {
    const block = new Block(1, genesis.hash, '')
    const valid = block.isValid(genesis.index, genesis.hash)
    expect(valid).toBeFalsy()
  })

  it('should NOT be valid (hash)', () => {
    const block = new Block(1, genesis.hash, 'abc')
    block.hash = ''
    const valid = block.isValid(genesis.index, genesis.hash)
    expect(valid).toBeFalsy()
  })
})
