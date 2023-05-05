import { describe, it, expect, beforeAll } from '@jest/globals'
import Wallet from '../src/lib/wallet'

describe('Transaction Input tests', () => {
  const exampleWIF = '5HueCGU8rMjxEXxiPuD5BDku4MkFqeZyd4dZ1jvhTVqvbTLvyTJ'
  let alice: Wallet

  beforeAll(() => {
    alice = new Wallet()
  })

  it('should generate wallet', () => {
    const wallet = new Wallet()
    expect(wallet.privateKey).toBeTruthy()
    expect(wallet.publicKey).toBeTruthy()
  })

  it('should recover wallet (PK)', () => {
    const wallet = new Wallet(alice.privateKey)
    expect(wallet.publicKey).toEqual(alice.publicKey)
  })

  it('should recover wallet (WIF)', () => {
    const wallet = new Wallet(exampleWIF)
    expect(wallet.privateKey).toBeTruthy()
    expect(wallet.publicKey).toBeTruthy()
  })
})
