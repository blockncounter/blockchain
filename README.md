# Blockchain Prototype - Node.js
> Proof of Work Blockchain based on Bitcoin architecture. <br>
> Built using Node.js, Express, Jest, and TypeScript. <br>

<br>

## Features
<ul>
  <li>Blockchain</li>
  <li>Wallet</li>
  <li>Transactions</li>
  <li>Mempool</li>
  <li>Block Mining</li>
  <li>Blockchain Difficulty</li>
</ul>

<br>

## Blockchain
An implementation of a blockchain data structure, containing an array of blocks, a mempool array for pending transactions, and a nextIndex counter. It supports regular transactions and fee transactions and has methods to add transactions and blocks, get the last block, calculate difficulty, get block and transaction by hash or index, check blockchain validity, and get information for creating a new block. It uses a difficulty factor to adjust the difficulty of mining new blocks, and has a maximum number of transactions per block and a maximum difficulty level.

<br>

## Block
A unit of data storage in the Blockchain that ensures it's integrity and security. It uses the sha256 hash function from the `crypto-js` library to create the block's hash. The class has a `mine()` function that can be called by the miner to attempt to mine it by fin a hash that starts with the given prefix. The `isValid()` function validates the block, checking if its transactions are valid and if the block's index, timestamp, previous hash, nonce, and hash are correct.

<br>

## Miner
The Miner Client is a program that interacts with the Blockchain class to mine new blocks. It uses the `getNextBlock()` method of the Blockchain class to get information about the next block to be mined. It then uses this information to create a new block and tries to find a valid hash for the block by repeatedly changing the nonce value in the block header until a hash is found that meets the difficulty target.

Once a valid hash is found, the Miner Client adds the new block to the Blockchain by calling the `addBlock()` method of the Blockchain class. The Miner Client also removes the transactions that were included in the new block from the mempool.

<br>

## Wallet
The Wallet utilizes the `tiny-secp256k1` and `ecpair` libraries to create and manage private and public keys for a cryptocurrency wallet. The class constructor takes an optional argument called `wifOrPrivateKey`, which is used to create an `ECPair` object for the private key. If `wifOrPrivateKey` is not provided, a random private key is generated. The private and public keys are stored as properties of the Wallet class. However, this code only covers a small aspect of building a cryptocurrency wallet, as additional considerations such as secure key storage, transaction signing, and network communication must be taken into account.

<br>

## Transactions
The Transaction class provides the necessary functionality to create and validate transactions in the blockchain. It has a `type`, a `timestamp`, `hash`, and `data`. The type can be Regular, for transactions between wallets, or Fee, reserved for miner payment or gas fees. The hash is calculated using the `SHA-256` cryptographic hash function by concatenating it's other properties.

<br>

## Mempool
A critical component of the Blockchain ecosystem as it enables the transaction processing and confirmation process by providing miners with a pool of valid transactions to choose from. As well as validating new transactions to guarantee it's authenticity and prevent transaction duplication. The Mempool is represented as an array of Transaction objects, defined as an instance variable of the Blockchain class.
