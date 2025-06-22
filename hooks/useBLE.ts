/* eslint-disable no-bitwise */
import { useState } from "react";
import { PermissionsAndroid, Platform } from "react-native";
import { BleManager, Device } from "react-native-ble-plx";
import base64 from "react-native-base64";
import { BleDevice, PULSE_SENSOR_UUIDS, ROBOT_SENSOR_UUIDS } from "../constants/constants";

interface BluetoothLowEnergyApi {
  requestPermissions(): Promise<boolean>;
  scanForTargetPeripherals(): void;
  stopScanning(): void;
  connectToDevicePulseSensor?: (deviceId: Device) => Promise<Device>;
  connectToDeviceRobotSensor?: (deviceId: Device) => Promise<Device>;
  connectToDevice: (deviceId: Device) => Promise<Device>;
  disconnectFromDevice: (device: Device) => void;
  sendStartWorkoutCommand: (device: Device, startWorkout: boolean, workoutDuration: string, isPaused: boolean) => Promise<void>;
  endWorkoutCommand: (device: Device) => Promise<void>;
  pauseWorkoutCommnad: (device: Device, pauseFlag: boolean) => Promise<void>;
  pulseSensorDevice: Device | null;
  robotSensorDevice: Device | null;
  isPulseSensorConnected: boolean;
  isRobotSensorConnected: boolean;
  isScanning: boolean;
  response: string;
}

const bleManager = new BleManager({});
export default function useBle(): BluetoothLowEnergyApi {
  const [pulseSensorDevice, setPulseSensorDevice] = useState<Device | null>(null);
  const [robotSensorDevice, setRobotSensorDevice] = useState<Device | null>(null);
  const [isPulseSensorConnected, setIsPulseSensorConnected] = useState<boolean>(false);
  const [isRobotSensorConnected, setIsRobotSensorConnected] = useState<boolean>(false);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [response, setResponse] = useState<string>("");

  const requestAndroid31Permissions = async () => {
    const bluetoothScanPermission = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN, {
      title: "Bluetooth Scan Permission",
      message: "This app needs Bluetooth scan permission to discover devices",
      buttonPositive: "OK",
    });
    const bluetoothConnectPermission = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT, {
      title: "Bluetooth Connect Permission",
      message: "This app needs Bluetooth connect permission to connect to devices",
      buttonPositive: "OK",
    });
    const fineLocationPermission = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
      title: "Location Permission",
      message: "Bluetooth Low Energy requires location permission to scan for devices",
      buttonPositive: "OK",
    });

    return (
      bluetoothScanPermission === "granted" && bluetoothConnectPermission === "granted" && fineLocationPermission === "granted"
    );
  };

  const requestPermissions = async () => {
    if (Platform.OS === "android") {
      if ((Platform.Version as number) < 31) {
        const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
          title: "Location Permission",
          message: "Bluetooth Low Energy requires location permission to scan for devices",
          buttonPositive: "OK",
        });
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } else {
        return await requestAndroid31Permissions();
      }
    } else {
      return true;
    }
  };

  const scanForTargetPeripherals = () => {
    console.log("Starting BLE scan for all devices...");

    // Stop any existing scan first
    bleManager.stopDeviceScan();

    bleManager.startDeviceScan(null, { allowDuplicates: false }, (error, device) => {
      if (error) {
        console.error("Scan error:", error);
      }

      if (device?.name === BleDevice.PulseSensor) {
        console.log("Found device:", {
          id: device.id,
          name: device.name || "Unknown",
          localName: device.localName,
          rssi: device.rssi,
          isConnectable: device.isConnectable,
        });
        setPulseSensorDevice(device);
        stopScanning();
      }

      if (device?.name === BleDevice.RobotSensor) {
        console.log("Found device:", {
          id: device.id,
          name: device.name || "Unknown",
          localName: device.localName,
          rssi: device.rssi,
          isConnectable: device.isConnectable,
        });
        setRobotSensorDevice(device);
      }
    });
  };

  const stopScanning = () => {
    bleManager.stopDeviceScan();
    setIsScanning(false);
  };

  const connectToDevice = async (device: Device) => {
    try {
      stopScanning(); // Stop scanning before connecting
      console.log("Connecting to device:", device.name || device.id);

      const deviceConnection = await bleManager.connectToDevice(device.id);
      console.log(deviceConnection, "device connection");
      setPulseSensorDevice(deviceConnection);
      setIsPulseSensorConnected(true);

      await deviceConnection.discoverAllServicesAndCharacteristics();
      console.log("discoverAllServicesAndCharacteristics");

      const sensor_uuids = deviceConnection.name === BleDevice.PulseSensor ? PULSE_SENSOR_UUIDS : ROBOT_SENSOR_UUIDS;

      startNotifications(deviceConnection, sensor_uuids);

      return deviceConnection;
    } catch (e) {
      console.error("Connection error:", e);
      throw e;
    }
  };

  const disconnectFromDevice = (device: Device) => {
    if (device) {
      console.log("Disconnecting from device:", device.name || device.id);
      bleManager.cancelDeviceConnection(device.id);
      setIsPulseSensorConnected(false);
      setResponse("");
    }
  };
  const startNotifications = async (device: Device, sensor_uuids: { service: string; rx: string; tx: string }) => {
    try {
      await device.monitorCharacteristicForService(sensor_uuids.service, sensor_uuids.tx, (error, characteristic) => {
        if (error) {
          setResponse("");
          console.log("Notification error:", error);
          return;
        }
        if (!characteristic?.value) return;

        const decodedValue = base64.decode(characteristic.value);
        setResponse(decodedValue);
        console.log("Received:", decodedValue);
      });
    } catch (error) {
      console.error(" Notification setup error:", error);
      setResponse("");
    }
  };

  const sendData = async (data: string, device: Device, deviceUUIDS: { service: string; rx: string; tx: string }) => {
    if (!device) {
      throw new Error("No device connected");
    }

    try {
      console.log("Sending data:", data);
      await bleManager.writeCharacteristicWithResponseForDevice(
        device.id,
        deviceUUIDS.service,
        deviceUUIDS.rx,
        base64.encode(data)
      );
    } catch (error) {
      console.error(" Send error:", error);
      throw error;
    }
  };

  const sendStartWorkoutCommand = async (
    device: Device,
    startWorkout: boolean = false,
    workoutDuration: string,
    isPaused: boolean
  ) => {
    try {
      // Send in format: workoutFlag:time:isPausedFlag
      const workoutFlag = startWorkout ? "1" : "0";
      const isPausedFlag = isPaused ? "1" : "0";
      const message = `${workoutFlag}:${workoutDuration}:${isPausedFlag}`;
      const sensor_uuids = device.name === BleDevice.PulseSensor ? PULSE_SENSOR_UUIDS : ROBOT_SENSOR_UUIDS;

      await sendData(message, device, sensor_uuids);
      console.log("Pulse sensor credentials sent:", message);
    } catch (error) {
      console.error("Failed to send start command:", error);
      throw error;
    }
  };
  const pauseWorkoutCommnad = async (device: Device, pauseFlag: boolean) => {
    try {
      console.log(pauseFlag, "flag in hook");
      const pauseFlagCommand = pauseFlag ? "1" : "0";
      console.log(pauseFlagCommand, "flag  transalted in hook");

      const message = `PAUSE:${pauseFlagCommand}`;
      const sensor_uuids = device.name === BleDevice.PulseSensor ? PULSE_SENSOR_UUIDS : ROBOT_SENSOR_UUIDS;

      await sendData(message, device, sensor_uuids);
      console.log("Pulse sensor credentials sent:", message);
    } catch (error) {
      console.error("Failed to send start command:", error);
      throw error;
    }
  };

  const endWorkoutCommand = async (device: Device) => {
    try {
      const message = "END:1";
      const sensor_uuids = device.name === BleDevice.PulseSensor ? PULSE_SENSOR_UUIDS : ROBOT_SENSOR_UUIDS;

      await sendData(message, device, sensor_uuids);
      console.log("Pulse sensor credentials sent:", message);
    } catch (error) {
      console.error("Failed to send start command:", error);
      throw error;
    }
  };

  return {
    scanForTargetPeripherals,
    requestPermissions,
    stopScanning,
    connectToDevice,
    sendStartWorkoutCommand,
    endWorkoutCommand,
    pauseWorkoutCommnad,
    disconnectFromDevice,
    pulseSensorDevice,
    robotSensorDevice,
    isPulseSensorConnected,
    isRobotSensorConnected,
    isScanning,
    response,
  };
}
