import OBDReader from 'serial-obd';
import EventEmitter from 'events';

const BAUDRATE = 38400;

let serialOBDReader = new OBDReader("/dev/rfcomm1", {
  baudrate: BAUDRATE
});

let bus = new EventEmitter();

serialOBDReader.on('dataReceived', (data) => {
  if ('pid' in data) {
    bus.emit(data.name, data.value, data);
  }
});

serialOBDReader.on('connected', (data) => {
    serialOBDReader.addPoller("vss");
    serialOBDReader.addPoller("rpm");

    serialOBDReader.startPolling(500);
});

serialOBDReader.connect();

export default bus;
