import * as express from 'express'
import * as logger from 'morgan'
import * as cors from 'cors'
import { argv } from 'optimist'
import {install as SourceMapInstall} from 'source-map-support'
import { Output } from './lib/Output'
const port = argv.port || 3000
SourceMapInstall()

const output = new Output(20, 100);
output.start()

const app = express();
app.use(express.json())
app.use(cors())
app.use(logger('dev'))

app.get('/', (req, res) => {
  res.json({
    foo: true
  })
})

app.put('/value', (req, res) => {
  let { value = output.currentValue } = req.body
  value = isNaN(Number(value)) ? output.currentValue : Number(value)
  output.changeValue(value)
  res.json({
    updated: true,
    newValue: value
  })
})

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})