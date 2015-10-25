import TorqueConverter from './torque-converter';
import TorqueConverterSwitch from './tc-switch';
import Car from './car';

const MIN_SPEED = 10;

let state = {
  speed: 0,
  isTcSwitchOn: false,
  isTcLocked: false,
  isCancelled: false
};

function run() {
  console.log('run', state);
  if (!state.isTcSwitchOn) {
    TorqueConverter.disengage();
    state.isTcLocked = false;
    return;
  }

  if (state.isTcSwitchOn && state.speed < MIN_SPEED) {
    state.isCancelled = true;
    state.isTcLocked = false;
    TorqueConverter.disengage();
    return;
  }

  if (state.isTcSwitchOn && !state.isCancelled && state.speed > MIN_SPEED) {
    state.isTcLocked = true;
    TorqueConverter.engage();
  }
}

TorqueConverterSwitch.on('switched', (data) => {
  state.isTcSwitchOn = data.on;
  // Clear cancelled state if the switch is pressed
  state.isCancelled = false;
  run();
});

Car.on('vss', (speed) => {
  state.speed = speed;
  run();
});

run();
