"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
class Output extends events_1.EventEmitter {
    constructor(initialValue = 30, interval = 1000) {
        super();
        this.value = null;
        this.previousValue = null;
        this.interval = null;
        this.timer = null;
        initialValue = Number(initialValue);
        initialValue = isNaN(initialValue) ? 30 : initialValue;
        this.value = initialValue;
        this.previousValue = initialValue;
        this.interval = interval;
    }
    get currentValue() {
        return this.value;
    }
    start() {
        if (this.timer)
            return;
        this.timer = setInterval(() => {
            this.emit('value', this.getValue());
        }, this.interval);
    }
    stop() {
        if (!this.timer)
            return;
        clearInterval(this.timer);
    }
    randomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
    getValue() {
        const d = new Date();
        const threshold = this.value * 0.05;
        const diff = this.randomNumber(1, threshold);
        const val = (d.getMilliseconds() % 2 === 0) ? this.previousValue - diff : this.previousValue + diff;
        this.previousValue = val >= this.value - diff && val <= this.value + diff ? val : (d.getMilliseconds() % 2 === 0) ? this.value - diff : this.value + diff;
        return this.previousValue >= 0 ? this.previousValue : 0;
    }
    changeValue(newValue) {
        this.value = newValue;
    }
}
exports.Output = Output;
//# sourceMappingURL=Output.js.map