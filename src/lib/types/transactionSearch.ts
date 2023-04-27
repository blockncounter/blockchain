import Transaction from '../transaction'

export default interface TransactionSearch {
  transaction: Transaction
  mempoolIndex: number
  blockIndex: number
}
