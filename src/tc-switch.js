import { Gpio } from 'onoff';
import EventEmitter from 'events';

const TC_SWITCH_PIN = 22;
const EDGE = 'both';

let tcSwitch = new Gpio(TC_SWITCH_PIN, 'in', EDGE);
let bus = new EventEmitter();

function run(value) {
  console.log('TC Switch: ', value);
  let state = value === 1;
  bus.emit('switched', { on: state });
}

console.log('readSync');
run(tcSwitch.readSync());

tcSwitch.watch((err, value) => {
  if (err) { return console.error(err); }
  run(value);
});

process.on('SIGINT', () => {
  tcSwitch.unexport();
});

export default bus;
