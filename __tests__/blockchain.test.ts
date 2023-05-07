import { jest, describe, it, expect, beforeAll } from '@jest/globals'
import Blockchain from '../src/lib/blockchain'
import Block from '../src/lib/block'
import Transaction from '../src/lib/transaction'
import TransactionInput from '../src/lib/transactionInput'
import Wallet from '../src/lib/wallet'

jest.mock('../src/lib/block')
jest.mock('../src/lib/transaction')
jest.mock('../src/lib/transactionInput')

describe('Blockchain tests', () => {
  let alice: Wallet

  beforeAll(() => {
    alice = new Wallet()
  })

  it('should have genesis block', () => {
    const blockchain = new Blockchain(alice.publicKey)
    expect(blockchain.blocks.length).toEqual(1)
  })

  it('should be valid', () => {
    const blockchain = new Blockchain(alice.publicKey)
    expect(blockchain.isValid().success).toBeTruthy()
  })

  it('should add a block', () => {
    const blockchain = new Blockchain(alice.publicKey)

    const tx = new Transaction({
      txInputs: [new TransactionInput()],
    } as Transaction)

    blockchain.mempool.push(tx)

    const result = blockchain.addBlock(
      new Block({
        index: 1,
        previousHash: blockchain.getLastBlock().hash,
        transactions: [tx],
      } as Block),
    )

    expect(result.success).toBeTruthy()
  })

  it('should NOT add a block (index)', () => {
    const blockchain = new Blockchain(alice.publicKey)
    const result = blockchain.addBlock(
      new Block({
        index: -1,
        previousHash: blockchain.getLastBlock().hash,
        transactions: [
          new Transaction({
            txInputs: [new TransactionInput()],
          } as Transaction),
        ] as Transaction[],
      } as Block),
    )
    expect(result.success).toBeFalsy()
  })

  it('should return a block', () => {
    const blockchain = new Blockchain(alice.publicKey)
    const block = blockchain.getBlock(blockchain.getLastBlock().hash)
    expect(block).toBeTruthy()
  })

  it('should NOT return a block', () => {
    const blockchain = new Blockchain(alice.publicKey)
    const block = blockchain.getBlock(
      blockchain.getLastBlock().transactions[0].hash,
    )
    expect(block).toBeFalsy()
  })

  it('should be valid (two blocks)', () => {
    const blockchain = new Blockchain(alice.publicKey)
    blockchain.addBlock(
      new Block({
        index: 1,
        previousHash: blockchain.getLastBlock().hash,
        transactions: [
          new Transaction({
            txInputs: [new TransactionInput()],
          } as Transaction),
        ] as Transaction[],
      } as Block),
    )
    expect(blockchain.isValid().success).toBeTruthy()
  })

  it('should NOT be valid (two blocks)', () => {
    const blockchain = new Blockchain(alice.publicKey)

    const tx = new Transaction({
      txInputs: [new TransactionInput()],
    } as Transaction)

    blockchain.mempool.push(tx)

    blockchain.addBlock(
      new Block({
        index: 1,
        previousHash: blockchain.getLastBlock().hash,
        transactions: [tx],
      } as Block),
    )

    blockchain.blocks[1].index = -1

    expect(blockchain.isValid().success).toBeFalsy()
  })

  it('should get the next Block info', () => {
    const blockchain = new Blockchain(alice.publicKey)
    blockchain.mempool.push(new Transaction())
    const nextBlockInfo = blockchain.getNextBlock()
    expect(nextBlockInfo ? nextBlockInfo.index : 0).toEqual(1)
  })

  it('should NOT get the next Block info', () => {
    const blockchain = new Blockchain(alice.publicKey)
    const nextBlockInfo = blockchain.getNextBlock()
    expect(nextBlockInfo).toBeNull()
  })

  it('should add a Transaction', () => {
    const blockchain = new Blockchain(alice.publicKey)

    const tx = new Transaction({
      txInputs: [new TransactionInput()],
      hash: '123',
    } as Transaction)

    const validation = blockchain.addTransaction(tx)
    expect(validation.success).toBeTruthy()
  })

  it('should NOT add a Transaction (pending tx)', () => {
    const blockchain = new Blockchain(alice.publicKey)

    const tx = new Transaction({
      txInputs: [new TransactionInput()],
      hash: '123',
    } as Transaction)
    blockchain.addTransaction(tx)

    const tx2 = new Transaction({
      txInputs: [new TransactionInput()],
      hash: '1232',
    } as Transaction)

    const validation = blockchain.addTransaction(tx2)
    expect(validation.success).toBeFalsy()
  })

  it('should NOT add a Transaction (invalid tx)', () => {
    const blockchain = new Blockchain(alice.publicKey)
    const txInputs = [new TransactionInput()]
    txInputs[0].amount = -1

    const tx = new Transaction({
      txInputs,
      hash: '123',
    } as Transaction)

    const validation = blockchain.addTransaction(tx)
    expect(validation.success).toBeFalsy()
  })

  it('should NOT add a Transaction (duplicated in Blockchain)', () => {
    const blockchain = new Blockchain(alice.publicKey)

    const tx = new Transaction({
      txInputs: [new TransactionInput()],
      hash: '123',
    } as Transaction)

    blockchain.blocks.push(
      new Block({
        transactions: [tx],
      } as Block),
    )

    const validation = blockchain.addTransaction(tx)
    expect(validation.success).toBeFalsy()
  })

  // it('should NOT add a Transaction (duplicated in Mempool)', () => {
  //   const blockchain = new Blockchain(alice.publicKey)

  //   const tx = new Transaction({
  //     txInputs: [new TransactionInput()],
  //     hash: '123',
  //   } as Transaction)

  //   blockchain.mempool.push(tx)

  //   const validation = blockchain.addTransaction(tx)
  //   expect(validation.success).toBeFalsy()
  // })

  it('should get a Transaction (Mempool)', () => {
    const blockchain = new Blockchain(alice.publicKey)

    const tx = new Transaction({
      txInputs: [new TransactionInput()],
      hash: '123',
    } as Transaction)

    blockchain.mempool.push(tx)

    const result = blockchain.getTransaction(tx.hash)
    expect(result.mempoolIndex).toEqual(0)
  })

  it('should get a Transaction (Blockchain)', () => {
    const blockchain = new Blockchain(alice.publicKey)

    const tx = new Transaction({
      txInputs: [new TransactionInput()],
      hash: '123',
    } as Transaction)

    blockchain.blocks.push(
      new Block({
        transactions: [tx],
      } as Block),
    )

    const result = blockchain.getTransaction(tx.hash)
    expect(result.blockIndex).toEqual(1)
  })

  it('should NOT get a Transaction', () => {
    const blockchain = new Blockchain(alice.publicKey)
    const result = blockchain.getTransaction('xyz')
    expect(result.blockIndex).toEqual(-1)
    expect(result.mempoolIndex).toEqual(-1)
  })
})
