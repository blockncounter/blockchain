import dotenv from 'dotenv'
dotenv.config()

import express, { Request, Response, NextFunction } from 'express'
import morgan from 'morgan'
import Blockchain from '../lib/blockchain'
import Block from '../lib/block'

/* c8 ignore next */
const PORT: number = parseInt(`${process.env.BLOCKCHAIN_PORT}`) || 3000

const app = express()

/* c8 ignore start */
if (process.argv.includes('--run'))
  app.use(morgan('tiny'))
/* c8 ignore end */

app.use(express.json())

const blockchain = new Blockchain()

app.get('/status', (req: Request, res: Response, next: NextFunction) => {
  res.json({
    isValid: blockchain.isValid(),
    numberOfBlocks: blockchain.blocks.length,
    lastBlock: blockchain.getLastBlock()
  })
})

app.get('/blocks/next', (req: Request, res: Response, next: NextFunction) => {
  res.json(blockchain.getNextBlock())
})

app.get('/blocks/:indexOrHash', (req: Request, res: Response, next: NextFunction) => {
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

app.post('/blocks', (req: Request, res: Response, next: NextFunction) => {
  if (req.body.hash === undefined) return res.sendStatus(422)

  const block = new Block(req.body as Block)
  const validation = blockchain.addBlock(block)

  if (validation.success)
    return res.status(201).json(block)
  else
    return res.status(400).json(validation)
})

/* c8 ignore start */
if (process.argv.includes('--run'))
  app.listen(PORT, () => console.log(`Blockchain server is running on port ${PORT}`))
/* c8 ignore end */

export { app }
