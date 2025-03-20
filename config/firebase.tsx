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

type SwitchData = {
  switch: string;
  value: boolean;
};

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
  async updateData(room: Room, switchId: string, value: boolean): Promise<void> {
    const newValue = !value;

    // Cập nhật giá trị công tắc
    await update(ref(database, `rooms/${room.idRoom}/switches`), {
      [switchId]: newValue,
    });

    // Ghi log lại thay đổi
    await this.addLogs({ switchId: switchId, value: newValue, room: room.name });
  },

  async addLogs({ switchId, value, room }) {
    const snapshot = await get(ref(database, "logs"));
    const logsData = snapshot.val();
    const logsRef = Object.keys(logsData).length;
    const newKey = 'log_' + (logsRef + 1);

    const date = new Date().toISOString().replace("T", " ").slice(0, 19).replace(/-/g, "/");

    if (!newKey) throw new Error("Unable to generate key for logs");
    const logs = {
      room: room,
      switch: switchId,
      value: value,
      date: date,
    };

    await set(ref(database, `logs/${newKey}`), logs);
  },
};

export default firebaseService;