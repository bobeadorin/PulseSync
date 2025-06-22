export enum BleDevice {
  PulseSensor = "PulseSensor",
  RobotSensor = "RobotSensor",
}

export enum InitDevices {
  PulseSensor = "PulseSensor",
  Robot = "Robot",
  Ble = "Ble",
  Cloud = "Cloud",
}

export enum BleMessages {
  OK = "OK",
}

export enum InitSteps {
  Failed = "failed",
  Success = "success",
  InProgress = "in-progress",
  Pending = "pending",
}

export enum InitIds {
  Bluetooth = "bluetooth",
  PulseData = "pulse-data",
  RobotConnection = "robot-connection",
  DatabaseConnection = "database-connection",
}

export enum InitNames {
  Bluetooth = "Bluetooth Connection",
  PulseData = "Sensor Data Stream",
  RobotConnection = "Robot Connection",
  DatabaseConnection = "Database Connection",
}

export const initSteps = [
  { id: InitIds.Bluetooth, name: InitNames.Bluetooth, status: InitSteps.Pending, device: InitDevices.Ble },
  { id: InitIds.PulseData, name: InitNames.PulseData, status: InitSteps.Pending, device: InitDevices.PulseSensor },
  {
    id: InitIds.RobotConnection,
    name: InitNames.RobotConnection,
    status: InitSteps.Pending,
    device: InitDevices.Robot,
  },
  {
    id: InitIds.DatabaseConnection,
    name: InitNames.DatabaseConnection,
    status: InitSteps.Pending,
    device: InitDevices.Cloud,
  },
];

// For first ESP32
export const PULSE_SENSOR_UUIDS = {
  service: "6E400001-B5A3-F393-E0A9-E50E24DCCA9E",
  rx: "6E400002-B5A3-F393-E0A9-E50E24DCCA9E",
  tx: "6E400003-B5A3-F393-E0A9-E50E24DCCA9E",
};

// For second ESP32
export const ROBOT_SENSOR_UUIDS = {
  service: "6E400001-B5A3-F393-E0A9-E50E24DCCA11",
  rx: "6E400002-B5A3-F393-E0A9-E50E24DCCA22",
  tx: "6E400003-B5A3-F393-E0A9-E50E24DCCA33",
};
