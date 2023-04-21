import express from 'express'
import morgan from 'morgan'
import Blockchain from '../lib/blockchain'
import Block from '../lib/block'

const PORT: number = 3000

const app = express()

app.use(morgan('tiny'))
app.use(express.json())

const blockchain = new Blockchain()

app.get('/status', (req, res, next) => {
  res.json({
    isValid: blockchain.isValid(),
    numberOfBlocks: blockchain.blocks.length,
    lastBlock: blockchain.getLastBlock()
  })
})

app.get('/blocks/:indexOrHash', (req, res, next) => {
  let block: Block | undefined;
  if (/^[0-9]+$/.test(req.params.indexOrHash))
    block = blockchain.blocks[parseInt(req.params.indexOrHash)]
  else
    block = blockchain.getBlock(req.params.indexOrHash)

  if (!block)
    return res.sendStatus(404)
  else
    return res.json(block)
})

app.listen(PORT, () => {
  console.log(`Blockchain server is running on port ${PORT}`);
})
