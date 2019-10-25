"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const source_map_support_1 = require("source-map-support");
const Output_1 = require("./lib/Output");
source_map_support_1.install();
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
app.listen(3000, () => {
    console.log('listening!');
    output.on('value', value => {
        console.log(value);
    });
});
//# sourceMappingURL=app.js.map