import request from 'supertest'
import { describe, test, expect, jest } from '@jest/globals'
import { app } from '../src/server/blockchainServer'
import Block from '../src/lib/block'

jest.mock('../src/lib/block')
jest.mock('../src/lib/blockchain')

describe('Blockchain Server tests', () => {
  test('GET /status - should return 200', async () => {
    const response = await request(app)
      .get('/status')

    expect(response.status).toBe(200)
    expect(response.body.isValid.success).toBeTruthy()
  })

  test('GET /blocks/:index - should return Genesis Block', async () => {
    const response = await request(app)
      .get('/blocks/0')

    expect(response.status).toBe(200)
    expect(response.body.index).toEqual(0)
  })

  test('GET /blocks/:hash - should return Block', async () => {
    const response = await request(app)
      .get('/blocks/cbc0401163a8784b7feb36c149d7ce257bf78396251de8429bad39d252578396')

    expect(response.status).toBe(200)
    expect(response.body.hash).toBe('cbc0401163a8784b7feb36c149d7ce257bf78396251de8429bad39d252578396')
  })

  test('GET /blocks/:index - should NOT return Block', async () => {
    const response = await request(app)
      .get('/blocks/-1')

    expect(response.status).toBe(404)
  })

  test('POST /blocks - should add a Block', async () => {
    const block = new Block({
      index: 1
    } as Block)
    const response = await request(app)
      .post('/blocks')
      .send(block)

    expect(response.status).toBe(201)
    expect(response.body.index).toEqual(1)
  })

  test('POST /blocks - should NOT add a Block (empty)', async () => {
    const response = await request(app)
      .post('/blocks')
      .send({})

    expect(response.status).toBe(422)
  })

  test('POST /blocks - should NOT add a Block (invalid)', async () => {
    const block = new Block({
      index: -1
    } as Block)
    const response = await request(app)
      .post('/blocks')
      .send(block)

    expect(response.status).toBe(400)
  })
})
