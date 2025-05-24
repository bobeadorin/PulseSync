import { PermissionsAndroid, Platform } from "react-native";

export class BluetoothService {
  static instance: BluetoothService;

  private constructor() {
    //pass
  }

  public static getInstance(): BluetoothService {
    if (!BluetoothService.instance) {
      BluetoothService.instance = new BluetoothService();
    }

    return BluetoothService.instance;
  }
  public async requestPermissions(): Promise<boolean> {
    if (Platform.OS === "android") {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      ]);
      return Object.values(granted).every((result) => result === PermissionsAndroid.RESULTS.GRANTED);
    }
    return true;
  }
}
