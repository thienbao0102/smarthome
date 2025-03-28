import React, { useState, useEffect } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from 'react-native';
import RNPickerSelect from "react-native-picker-select";
import firebaseService from '../../config/firebase';
import { SafeAreaView } from 'react-native-safe-area-context';

// Định nghĩa kiểu dữ liệu cho log
interface LogItem {
  switch: string;
  time: Date;
  state: string;
  room: string;
}

export default function ActivityScreen() {
  const [waiting, setWaiting] = useState<boolean>(true);
  const [data, setData] = useState<LogItem[]>([]);
  const [selectedRoom, setSelectedRoom] = useState(null);

  // Lọc dữ liệu theo phòng
  const filteredData = selectedRoom ? data.filter(item => item.room === selectedRoom) : data;

  // Lấy dữ liệu từ Firebase
  useEffect(() => {
    const fetchData = async () => {
        try {
            const snapshot = await firebaseService.getLogsRef();
            if (snapshot.exists()) {
                const items = Object.entries(snapshot.val()).map(([logId, value]:[string, any]) => ({
                  switch: value.switch,
                  time: value.date,
                  state: value.value
                    ? `Turn on`
                    : `Turn off`,
                  room: value.room
                }));
                setData(items);
            } else {
                setData([]);
            }
        } catch (error) {
            console.error('Lỗi lấy dữ liệu:', error);
        }
        setWaiting(false);
    };

    fetchData();
}, []);

// Tạo danh sách phòng để chọn
  const roomOptions = (data: LogItem[]) => {
    if (!data || data.length === 0) return [];
    const uniqueRooms = [...new Set(data.map(log => log.room))];
    return uniqueRooms.map((room, index) => ({
      label: room,
      value: room,
      key: index.toString()
    }));
  };


  if (waiting) {
    return <ActivityIndicator />;
  } else if (data.length === 0) {
    return (
      <SafeAreaView>
        <Text style={styles.headerText}>History of using equipment</Text>
        <View style={styles.itemContainer}>
          <Text style={{ textAlign: 'center', fontSize: 16, color: 'gray',}}>No data</Text>
        </View>
        
      </SafeAreaView>

    );
  } else {
    const renderItem = ({ item }: any) => {
      return (
        <View style={styles.itemContainer}>
          <View style={styles.timeContainer}>
            <Text style={styles.timeText}>{item.time}</Text>
          </View>
          <View style={styles.circleLineContainer}>
            <View style={styles.circle} />
            <View style={styles.line} />
          </View>
          <View style={styles.contentContainer}>
            <Text style={styles.title}>{item.state}</Text>
            <Text style={styles.title}>{item.room} - {item.switch}</Text>
            <Text style={styles.time}>{item.time}</Text>
          </View>
        </View>
      );
    };
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#f4f6f8', padding: 10 }}>
        <Text style={styles.headerText}>History of using equipment</Text>
        <RNPickerSelect
          onValueChange={(value) => setSelectedRoom(value)}
          items={roomOptions(data)}
          placeholder={{ label: "Tất Cả", value: null }}
          style={{
            inputIOS: { padding: 10, backgroundColor: "#f0f0f0", borderRadius: 5 },
            inputAndroid: { padding: 10, backgroundColor: "#f0f0f0", borderRadius: 5 },
          }}
        />
        <FlatList
          data={filteredData}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
        />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    backgroundColor: '#f4f6f8',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
    color: '#333',
  },
  itemContainer: {
    flexDirection: 'row',
    marginVertical: 12,
    alignItems: 'center',
    padding: 12,
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  timeContainer: {
    minWidth: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeText: {
    textAlign: 'center',
    backgroundColor: '#4CAF50',
    color: 'white',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 15,
    fontSize: 12,
    fontWeight: 'bold',
  },
  circleLineContainer: {
    alignItems: 'center',
    marginHorizontal: 10,
  },
  circle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#1E88E5',
  },
  line: {
    width: 2,
    height: 40,
    backgroundColor: '#1E88E5',
  },
  contentContainer: {
    flex: 1,
    paddingLeft: 10,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#333',
  },
  time: {
    color: 'gray',
    fontSize: 12,
    marginTop: 2,
  },
});
