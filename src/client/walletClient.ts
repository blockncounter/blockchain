import dotenv from 'dotenv'
import axios from 'axios'
import readline from 'readline'
import Wallet from '../lib/wallet'
import Transaction from '../lib/transaction'
import TransactionInput from '../lib/transactionInput'
import TransactionOutput from '../lib/transactionOutput'
dotenv.config()

const BLOCKCHAIN_SERVER = process.env.BLOCKCHAIN_SERVER
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})
let myWalletPub = ''
let myWalletPriv = ''

function preMenu() {
  rl.question('\nPress any key to continue...', () => menu())
}

function menu() {
  setTimeout(() => {
    console.clear()

    myWalletPub
      ? console.log(`Logged in as ${myWalletPub}\n`)
      : console.log('Not logged in.\n')

    console.log('Choose an option:\n')
    console.log('1 - Create Wallet')
    console.log('2 - Recover Wallet')
    console.log('3 - Check Balance')
    console.log('4 - Send Transaction')
    console.log('5 - Search Transaction')
    console.log('6 - Logout')
    rl.question('\n> ', (answer) => {
      switch (answer) {
        case '1':
          createWallet()
          break
        case '2':
          recoverWallet()
          break
        case '3':
          getBalance()
          break
        case '4':
          sendTransaction()
          break
        case '5':
          getTransaction()
          break
        case '6':
          logout()
          break
        default:
          console.log('Invalid option')
          menu()
          break
      }
    })
  }, 500)
}

function createWallet() {
  console.clear()
  const wallet = new Wallet()
  console.log(`Wallet created!\n`)
  console.log(wallet)

  myWalletPub = wallet.publicKey
  myWalletPriv = wallet.privateKey

  preMenu()
}

function recoverWallet() {
  console.clear()
  rl.question('Enter your private key or WIF: ', (wifOrPrivateKey) => {
    try {
      console.clear()
      const wallet = new Wallet(wifOrPrivateKey)
      console.log(`Wallet recovered!\n`)
      console.log(wallet)

      myWalletPub = wallet.publicKey
      myWalletPriv = wallet.privateKey

      preMenu()
    } catch (err: any) {
      console.clear()
      console.log('Invalid private key or WIF.')
      preMenu()
    }
  })
}

async function getBalance() {
  console.clear()

  if (!myWalletPub) {
    console.log('You must be logged in to check your balance.')
    return preMenu()
  }

  const { data } = await axios.get(
    `${BLOCKCHAIN_SERVER}/wallets/${myWalletPub}`,
  )
  console.log(`Balance: ${data.balance}`)

  preMenu()
}

function sendTransaction() {
  console.clear()

  if (!myWalletPub) {
    console.log('You must be logged in to send a transaction.')
    return preMenu()
  }

  rl.question('Enter the recipient wallet address: ', (recipientWallet) => {
    if (!recipientWallet || recipientWallet.length !== 66) {
      console.clear()
      console.log('Invalid wallet address.')
      return preMenu()
    }

    rl.question('\nEnter the amount to send: ', async (amountStr) => {
      const amount = Number(amountStr)
      if (!amount || amount < 0 || isNaN(amount)) {
        console.clear()
        console.log('Invalid amount.')
        return preMenu()
      }

      const walletResponse = await axios.get(
        `${BLOCKCHAIN_SERVER}/wallets/${myWalletPub}`,
      )
      const balance = walletResponse.data.balance as number
      const fee = walletResponse.data.fee as number
      const utxo = walletResponse.data.utxo as TransactionOutput[]

      if (balance < amount + fee) {
        console.log('\nInsufficient funds (tx + fee)')
        return preMenu()
      }

      const txInputs = utxo.map((txo) => TransactionInput.fromTxo(txo))
      txInputs.forEach((txi) => txi.sign(myWalletPriv))

      const txOutputs = [] as TransactionOutput[]
      txOutputs.push(
        new TransactionOutput({
          amount,
          toAddress: recipientWallet,
        } as TransactionOutput),
      )

      const remainingBalance = balance - amount - fee
      txOutputs.push(
        new TransactionOutput({
          amount: remainingBalance,
          toAddress: myWalletPub,
        } as TransactionOutput),
      )

      const tx = new Transaction({
        txInputs,
        txOutputs,
      } as Transaction)

      tx.hash = tx.getHash()
      tx.txOutputs.forEach((txo) => (txo.txHash = tx.hash))

      console.log('\nTransaction created successfully!\n')
      console.log(tx)
      console.log(`\nRemaining balance: ${remainingBalance}`)

      try {
        const txResponse = await axios.post(
          `${BLOCKCHAIN_SERVER}/transactions`,
          tx,
        )
        console.log(
          '\nTransaction successfully created! Waiting for confirmation...\n',
        )
        console.log(`Hash: ${txResponse.data.hash}`)
        preMenu()
      } catch (err: any) {
        console.clear()
        console.log(err.response ? err.response.data.message : err.message)
        return preMenu()
      }
    })
  })

  // TODO: send Transaction to blockchain
  preMenu()
}

function getTransaction() {
  console.clear()
  rl.question('\nEnter the transaction hash: ', async (hash) => {
    const response = await axios.get(
      `${BLOCKCHAIN_SERVER}/transactions/${hash}`,
    )
    console.log(response.data)
    preMenu()
  })
}

function logout() {
  console.clear()
  myWalletPub = ''
  myWalletPriv = ''
  console.log('Logged out.')
  preMenu()
}

menu()
// const wallet = new Wallet(
//   '24bea8ba19a577244623b8edbf7b37a841ce08e968ad2338af5e62fa2c8fef17',
// )
// console.log(wallet)
