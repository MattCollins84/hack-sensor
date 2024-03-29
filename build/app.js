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
const interval = optimist_1.argv.interval || 200;
const startPressure = optimist_1.argv.pressure || 30;
const env = optimist_1.argv.env || 'dev';
const tagNumber = env === 'dev' ? "MCD-20-KX-1005" : "MCD-20-KX-2020";
source_map_support_1.install();
const connectionString = "Endpoint=sb://mmdl-hack360.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=7ZCjP1OtMMyE7e51B/wHbIl58WJZNL277O37Cs/ghwk=";
const eventHubName = "mmdl";
const client = EventHubClient.createFromConnectionString(connectionString, eventHubName);
const output = new Output_1.Output(startPressure, interval);
output.start();
const app = express();
app.use(express.json());
app.use(cors());
app.use(logger('dev'));
app.use(express.static('./public'));
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
    console.log(`listening on ${port}`);
    output.on('value', generatedNum => {
        console.log(generatedNum);
        const data = { body: {
                "data": generatedNum,
                "tagNumber": tagNumber,
                "ts": Date.now()
            } };
        client.send(data);
    });
});
//# sourceMappingURL=app.js.map