import * as ecc from 'tiny-secp256k1'
import ECPairFactory from 'ecpair'

const ECPair = ECPairFactory(ecc)

/**
 * Wallet class
 */
export default class Wallet {
  privateKey: string
  publicKey: string

  constructor(wifOrPrivateKey?: string) {
    let keys

    if (wifOrPrivateKey)
      wifOrPrivateKey.length === 64
        ? (keys = ECPair.fromPrivateKey(Buffer.from(wifOrPrivateKey, 'hex')))
        : (keys = ECPair.fromWIF(wifOrPrivateKey))
    else keys = ECPair.makeRandom()

    /* c8 ignore next */
    this.privateKey = keys.privateKey?.toString('hex') || ''
    this.publicKey = keys.publicKey.toString('hex')
  }
}
