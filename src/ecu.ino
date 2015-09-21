const int tcSwitchPin = 8;
const int tcLockerPin = 7;

const int speedSensorPin = A1;

// Speed is in kmph
const int MIN_SPEED = 20;
int currentSpeed = 0;

bool isTcSwitchOn = false;
bool isCancelled  = false;
int lastTcSwitchState = -1;

void handleTcSwitch() {
  isTcSwitchOn = digitalRead(tcSwitchPin) == HIGH;

  if (isTcSwitchOn != lastTcSwitchState) {
    Serial.write('TC State Switched');
    isCancelled = false;
    lastTcSwitchState = isTcSwitchOn;
  }
}

void unlockTorqueConverter() {
  digitalWrite(tcLockerPin, LOW);
}

void lockTorqueConverter() {
  digitalWrite(tcLockerPin, HIGH);
}

void setup() {
  Serial.begin(9600);
  pinMode(tcLockerPin, OUTPUT);
  pinMode(tcSwitchPin, INPUT);
}

void loop() {
  handleTcSwitch();

  if (isCancelled) {
    unlockTorqueConverter();
    return;
  }
  
  currentSpeed = analogRead(speedSensorPin) / 7.3;

  if (currentSpeed < MIN_SPEED * 2) {
    isCancelled = true;
    unlockTorqueConverter();
  } else if (isTcSwitchOn) {
    lockTorqueConverter();
  }
}
