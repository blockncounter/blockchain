import { describe, it, expect, beforeAll } from '@jest/globals'
import Block from '../src/lib/block'
import NextBlockInfo from '../src/lib/types/nextBlockInfo'

describe('Block tests', () => {
  const exampleDifficulty = 0
  const exampleMiner = 'test'
  let genesis: Block

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

    block.mine({ difficulty: exampleDifficulty, miner: exampleMiner })

    const valid = block.isValid({
      previousIndex: genesis.index,
      previousHash: genesis.hash,
      difficulty: exampleDifficulty
    })

    expect(valid.success).toBeTruthy()
  })

  it('should create a Block from next Block info', () => {
    const block = Block.fromNextBlockInfo(({
      index: 1,
      previousHash: genesis.hash,
      data: 'Block 2',
      difficulty: exampleDifficulty,
      feePerTx: 1,
      maxDifficulty: 62
    } as NextBlockInfo))
    block.mine({ difficulty: exampleDifficulty, miner: exampleMiner })

    const valid = block.isValid({
      previousIndex: genesis.index,
      previousHash: genesis.hash,
      difficulty: exampleDifficulty
    })

    expect(valid.success).toBeTruthy()
  })

  it('should NOT be valid (fallbacks)', () => {
    const block = new Block()
    const valid = block.isValid({
      previousIndex: genesis.index,
      previousHash: genesis.hash,
      difficulty: exampleDifficulty
    })
    expect(valid.success).toBeFalsy()
  })

  it('should NOT be valid (index)', () => {
    const block = new Block({
      index: -1,
      previousHash: genesis.hash,
      data: 'Block 2'
    } as Block)
    const valid = block.isValid({
      previousIndex: genesis.index,
      previousHash: genesis.hash,
      difficulty: exampleDifficulty
    })
    expect(valid.success).toBeFalsy()
  })

  it('should NOT be valid (timestamp)', () => {
    const block = new Block({
      index: 1,
      previousHash: genesis.hash,
      data: 'Block 2'
    } as Block)
    block.timestamp = -1
    const valid = block.isValid({
      previousIndex: genesis.index,
      previousHash: genesis.hash,
      difficulty: exampleDifficulty
    })
    expect(valid.success).toBeFalsy()
  })

  it('should NOT be valid (previousHash)', () => {
    const block = new Block({
      index: 1,
      previousHash: '32dasdq3da',
      data: 'Block 2'
    } as Block)
    const valid = block.isValid({
      previousIndex: genesis.index,
      previousHash: genesis.hash,
      difficulty: exampleDifficulty
    })
    expect(valid.success).toBeFalsy()
  })

  it('should NOT be valid (data)', () => {
    const block = new Block({
      index: 1,
      previousHash: genesis.hash,
      data: ''
    } as Block)
    const valid = block.isValid({
      previousIndex: genesis.index,
      previousHash: genesis.hash,
      difficulty: exampleDifficulty
    })
    expect(valid.success).toBeFalsy()
  })

  it('should NOT be valid (no miner)', () => {
    const block = new Block({
      index: 1,
      previousHash: genesis.hash,
      data: 'Block 2'
    } as Block)

    const valid = block.isValid({
      previousIndex: genesis.index,
      previousHash: genesis.hash,
      difficulty: exampleDifficulty
    })
    expect(valid.success).toBeFalsy()
  })

  it('should NOT be valid (hash)', () => {
    const block = new Block({
      index: 1,
      previousHash: genesis.hash,
      data: 'Block 2'
    } as Block)

    block.mine({ difficulty: exampleDifficulty, miner: exampleMiner })
    block.hash = '23rdsadaa'

    const valid = block.isValid({
      previousIndex: genesis.index,
      previousHash: genesis.hash,
      difficulty: exampleDifficulty
    })
    expect(valid.success).toBeFalsy()
  })
})
