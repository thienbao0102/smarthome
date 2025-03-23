import { initializeApp } from "firebase/app";
import { getDatabase, ref, update, push, set, get, remove } from "firebase/database";

// Cấu hình Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAwdClj6SPqBQD4_mbwr6klGxpkjIp_Bwg",
  authDomain: "smarthome-939be.firebaseapp.com",
  databaseURL: "https://smarthome-939be-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "smarthome-939be",
  storageBucket: "smarthome-939be.firebasestorage.app",
  messagingSenderId: "931403843562",
  appId: "1:931403843562:web:e73ccb01c5faf635841493",
  measurementId: "G-DNERX9PNPF",
};

// Khởi tạo Firebase
const firebaseApp = initializeApp(firebaseConfig);
const database = getDatabase(firebaseApp);

interface SwitchItem {
  switchId: string;
  switch: string;
  value: boolean;
}
interface Room {
  idRoom: string;
  name: string;
}

const firebaseService = {
  database,
  getLogsRef() {
    return ref(database, "logs");
  },

  getSwitchRef(roomId: string) {
    return ref(database, `rooms/${roomId}/switches`);
  },

  getListRoomhRef() {
    return get(ref(database, "rooms"));
  },
  async updateData(room: Room, SwitchItem: SwitchItem): Promise<void> {
    const newValue = {
      switchName: SwitchItem.switch,
      value: SwitchItem.value,
    };

    // Cập nhật giá trị công tắc
    const switchRef = ref(database, `rooms/${room.idRoom}/switches/${SwitchItem.switchId}`);
    await update(switchRef, newValue);

    // Ghi log lại thay đổi
    await this.addLogs({ switchName: SwitchItem.switch, value: newValue, room: room.name });
  },

  async addLogs({ switchName, value, room }) {
    var newKey = 'log_1';
    const snapshot = await get(ref(database, "logs"));
    if (snapshot.exists()) {
      const logs = snapshot.val();
      const logsRef = Object.keys(logs).length;
      newKey = 'log_' + (logsRef + 1);
    }

    const date = new Date().toISOString().replace("T", " ").slice(0, 19).replace(/-/g, "/");

    const logs = {
      room: room,
      switch: switchName,
      value: value,
      date: date,
    };

    await set(ref(database, `logs/${newKey}`), logs);
  },

  async addSwitch(roomId: string) {
    var newKey = 'switch_1';
    const snapshot = await get(ref(database, `rooms/${roomId}/switches`));
    if (snapshot.exists()) {
      const switches = snapshot.val();
      const logsRef = Object.keys(switches).length;
      newKey = 'switch_' + (logsRef + 1);
    }

    const newDeviceRef = push(ref(database, `rooms/${roomId}/switches`));
    const newDevice = {
      switchName: newKey,
      value: false,
    };

    await set(newDeviceRef, newDevice);
  }
};

export default firebaseService;