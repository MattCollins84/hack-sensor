import * as express from 'express'
import * as logger from 'morgan'
import * as cors from 'cors'
import { argv } from 'optimist'
import {install as SourceMapInstall} from 'source-map-support'
import { Output } from './lib/Output'
const { EventHubClient } = require("@azure/event-hubs");

const port = argv.port || 3000

SourceMapInstall()

const connectionString = "Endpoint=sb://mmdl-hack360.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=7ZCjP1OtMMyE7e51B/wHbIl58WJZNL277O37Cs/ghwk=";
const eventHubName = "mmdl"

const client = EventHubClient.createFromConnectionString(connectionString, eventHubName);

const output = new Output(30, 200);
output.start()

const app = express();
app.use(express.json())
app.use(cors())
app.use(logger('dev'))
app.use(express.static('./public'))

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
  console.log(`listening on ${port}`)
  output.on('value', generatedNum => {
    console.log(generatedNum)
    const data = {body: {
      "data": generatedNum,
      "tagNumber": "MCD-20-KX-1005",
      "ts": Date.now()
    }}
    client.send(data);
  })

})