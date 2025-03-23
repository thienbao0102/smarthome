import { initializeApp } from "firebase/app";
import { getDatabase, ref, update, push, set, get, remove, query, limitToLast, limitToFirst } from "firebase/database";

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

  // Lấy danh sách log
  getLogsRef() {
    return get(
      query(ref(database, "logs"), limitToFirst(100))
    );
  },

  // Lấy danh sách công tắc
  getSwitchRef(roomId: string) {
    return get(ref(database, `rooms/${roomId}/switches`));
  },

  // Lấy danh sách phòng
  getListRoomhRef() {
    return get(
      query(ref(database, "rooms"), limitToLast(50)) 
      );
  },
  // cập nhật giá trị công tắc + ghi log
  async updateData(room: Room, SwitchItem: SwitchItem): Promise<void> {
    const newValue = {
      switchName: SwitchItem.switch,
      value: SwitchItem.value,
    };

    // Cập nhật giá trị công tắc
    const switchRef = ref(database, `rooms/${room.idRoom}/switches/${SwitchItem.switchId}`);
    await update(switchRef, newValue);

    // Ghi log lại thay đổi
    await this.addLogs({ newValue: newValue, room: room.name });
  },

  // Thêm log
  async addLogs({ newValue, room }: { newValue: any; room: string }) {
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
      switch: newValue.switchName,
      value: newValue.value,
      date: date,
    };

    await set(ref(database, `logs/${newKey}`), logs);
  },

  // Thêm công tắc
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
  },
  
  // Thêm phòng
  async addRoom(newRoomName: string) {
    const newRoomRef = push(ref(database, "rooms"));
    await set(newRoomRef, { name: newRoomName });
  },

  // Xóa thiết bị
  async deleteDevice(roomId: string, switchId: string) {
    await remove(ref(database, `rooms/${roomId}/switches/${switchId}`));
  }
};

export default firebaseService;