import { initializeApp } from "firebase/app";
import { getDatabase, ref, update, push, set, get } from "firebase/database";

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
  switchId: string; // Đổi tên để tránh trùng từ khóa
  value: boolean;
};

const firebaseService = {
  getLogsRef() {
    console.log(ref(database, "logs"));
    // testFirebaseConnection();
    return ref(database, "logs");
  },

  async updateData(data: SwitchData): Promise<void> {
    const { switchId, value } = data;
    const newValue = !value;

    // Kiểm tra kiểu dữ liệu trước khi update
    if (typeof switchId !== "string" || typeof newValue !== "boolean") {
      throw new Error("Invalid data type for update");
    }

    // Cập nhật giá trị công tắc
    await update(ref(database, "switch"), {
      [switchId]: newValue,
    });

    // Ghi log lại thay đổi
    await this.addLogs({ switchId, value: newValue });
  },

  async addLogs(data: SwitchData): Promise<void> {
    const logsRef = ref(database, "logs");
    const newKey = push(logsRef).key;
    const date = new Date().toISOString(); // Dùng toISOString() thay cho Moment.js

    if (!newKey) throw new Error("Unable to generate key for logs");

    const logs = {
      log_id: newKey,
      switch_id: parseInt(data.switchId) || data.switchId, // Chỉ parse nếu là số
      value: data.value,
      data_date: date,
    };

    await set(ref(database, `logs/${newKey}`), logs);
  },
};
// async function testFirebaseConnection() {
//   try {
//     const logsRef = ref(database, "logs");
//     const snapshot = await get(logsRef);

//     if (snapshot.exists()) {
//       console.log("Fetched logs data:", snapshot.val());
//     } else {
//       console.log("No logs found.");
//     }
//   } catch (error) {
//     console.error("Error fetching data:", error);
//   }
// }

export default firebaseService;