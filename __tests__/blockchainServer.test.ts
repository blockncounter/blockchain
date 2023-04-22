import request from 'supertest'
import { describe, test, expect, jest } from '@jest/globals'
import { app } from '../src/server/blockchainServer'

jest.mock('../src/lib/block')
jest.mock('../src/lib/blockchain')

describe('Blockchain Server tests', () => {
  test('GET /status should return 200', async () => {
    const response = await request(app)
      .get('/status')

    expect(response.status).toBe(200)
    expect(response.body.isValid.success).toBeTruthy()
  })
})
