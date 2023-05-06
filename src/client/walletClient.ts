import dotenv from 'dotenv'
import axios from 'axios'
import readline from 'readline'
import Wallet from '../lib/wallet'
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
    console.log('5 - Logout')
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

function getBalance() {
  console.clear()

  if (!myWalletPub) {
    console.log('You must be logged in to check your balance.')
    return preMenu()
  }

  // TODO: get balance from blockchain
  preMenu()
}

function sendTransaction() {
  console.clear()

  if (!myWalletPub) {
    console.log('You must be logged in to send a transaction.')
    return preMenu()
  }

  // TODO: send Transaction to blockchain
  preMenu()
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
