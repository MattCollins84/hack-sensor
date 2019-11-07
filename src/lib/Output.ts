import { EventEmitter } from "events";

export class Output extends EventEmitter {

  private value: number = null;
  private previousValue: number = null;
  private interval: number = null;
  private timer: NodeJS.Timer= null;

  constructor(initialValue: number = 30, interval: number = 1000) {
    super();
    initialValue = Number(initialValue);
    initialValue = isNaN(initialValue) ? 30 : initialValue
    this.value = initialValue;
    this.previousValue = initialValue;
    this.interval = interval;
  }

  get currentValue() {
    return this.value
  }

  start() {
    if (this.timer) return
    this.timer = setInterval(() => {
      this.emit('value', this.getValue())
    }, this.interval)
  }

  stop() {
    if (!this.timer) return;
    clearInterval(this.timer)
  }

  randomNumber(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  getValue() {
    const d = new Date();
    const threshold = this.value * 0.05
    const diff = this.randomNumber(1, threshold)
    const val = (d.getMilliseconds() % 2 === 0) ? this.previousValue - diff : this.previousValue + diff
    this.previousValue = val >= this.value - diff && val <= this.value + diff ? val : (d.getMilliseconds() % 2 === 0) ? this.value - diff : this.value + diff;
    return this.previousValue >= 0 ? this.previousValue : 0;
  }

  changeValue(newValue: number) {
    this.value = newValue
  }

}