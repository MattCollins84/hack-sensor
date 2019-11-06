"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const optimist_1 = require("optimist");
const source_map_support_1 = require("source-map-support");
const Output_1 = require("./lib/Output");
const { EventHubClient } = require("@azure/event-hubs");
const port = optimist_1.argv.port || 3000;
source_map_support_1.install();
const connectionString = "Endpoint=sb://mmdl-hack360.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=7ZCjP1OtMMyE7e51B/wHbIl58WJZNL277O37Cs/ghwk=";
const eventHubName = "mmdl";
const client = EventHubClient.createFromConnectionString(connectionString, eventHubName);
const output = new Output_1.Output(20, 100);
output.start();
const app = express();
app.use(express.json());
app.use(cors());
app.use(logger('dev'));
app.get('/', (req, res) => {
    res.json({
        foo: true
    });
});
app.put('/value', (req, res) => {
    let { value = output.currentValue } = req.body;
    value = isNaN(Number(value)) ? output.currentValue : Number(value);
    output.changeValue(value);
    res.json({
        updated: true,
        newValue: value
    });
});
app.listen(port, () => {
    console.log('listening!');
    output.on('value', generatedNum => {
        console.log(generatedNum);
        const data = { body: {
                "data": generatedNum,
                "tagNumber": "V-33101"
            } };
        client.send(data);
    });
});
//# sourceMappingURL=app.js.map