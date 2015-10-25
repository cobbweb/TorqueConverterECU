import { Gpio } from 'onoff';

const TORQUE_CONVERTER_PIN = 17;

let torqueConverter = new Gpio(17, 'out');

export default {

  engage() {
    console.log('TorqueConveter: engage');
    torqueConverter.writeSync(1);
  },

  disengage() {
    console.log('TorqueConveter: disengage');
    torqueConverter.writeSync(0);
  }

};

process.on('SIGINT', () => {
  torqueConverter.unexport();
});
