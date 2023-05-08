import request from 'supertest'
import { describe, test, expect, jest } from '@jest/globals'
import { app } from '../src/server/blockchainServer'
import Block from '../src/lib/block'
import Transaction from '../src/lib/transaction'
import TransactionInput from '../src/lib/transactionInput'
import TransactionOutput from '../src/lib/transactionOutput'

jest.mock('../src/lib/block')
jest.mock('../src/lib/blockchain')
jest.mock('../src/lib/transaction')
jest.mock('../src/lib/transactionInput')
jest.mock('../src/lib/transactionOutput')

describe('Blockchain Server tests', () => {
  test('GET /status - should return 200', async () => {
    const response = await request(app).get('/status')

    expect(response.status).toBe(200)
    expect(response.body.isValid.success).toBeTruthy()
  })

  test('GET /blocks/:index - should return Genesis Block', async () => {
    const response = await request(app).get('/blocks/0')

    expect(response.status).toBe(200)
    expect(response.body.index).toEqual(0)
  })

  test('GET /blocks/next - should return next Block info', async () => {
    const response = await request(app).get('/blocks/next')

    expect(response.status).toBe(200)
    expect(response.body.index).toEqual(1)
  })

  test('GET /blocks/:hash - should return Block', async () => {
    const response = await request(app).get('/blocks/abc')

    expect(response.status).toBe(200)
    expect(response.body.hash).toBe('abc')
  })

  test('GET /blocks/:index - should NOT return Block', async () => {
    const response = await request(app).get('/blocks/-1')

    expect(response.status).toBe(404)
  })

  test('POST /blocks - should add a Block', async () => {
    const block = new Block({
      index: 1,
    } as Block)
    const response = await request(app).post('/blocks').send(block)

    expect(response.status).toBe(201)
    expect(response.body.index).toEqual(1)
  })

  test('POST /blocks - should NOT add a Block (empty)', async () => {
    const response = await request(app).post('/blocks').send({})

    expect(response.status).toBe(422)
  })

  test('POST /blocks - should NOT add a Block (invalid)', async () => {
    const block = new Block({
      index: -1,
    } as Block)
    const response = await request(app).post('/blocks').send(block)

    expect(response.status).toBe(400)
  })

  test('GET /transactions/:hash - should get a Transaction', async () => {
    const response = await request(app).get('/transactions/tx1')

    expect(response.status).toBe(200)
    expect(response.body.mempoolIndex).toEqual(0)
  })

  test('POST /transactions - should add a Transaction', async () => {
    const tx = new Transaction({
      txInputs: [new TransactionInput()],
      txOutputs: [new TransactionOutput()],
    } as Transaction)
    const response = await request(app).post('/transactions').send(tx)

    expect(response.status).toBe(201)
  })

  test('GET /wallets/:wallet - should get balance', async () => {
    const response = await request(app).get('/wallets/abc')

    expect(response.status).toBe(200)
    expect(response.body.balance).toEqual(10)
  })
})
