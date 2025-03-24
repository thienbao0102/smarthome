# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
    npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.


# 📌 Dự án của tôi



## 📂 Danh sách file

<details>
  <summary>📄 <strong>app/(tabs)/layout.tsx</strong></summary>

  ```js
  import CustomTabBar from '@/components/ui/CustomTabBar';
  import { Stack } from 'expo-router';

  export default function TabLayout() {
    return (
      <>
        <Stack screenOptions={{ headerShown: false }} />
        <CustomTabBar />
      </>
    );
  }

```
</details>


<details>
  <summary>📄 <strong>app/(tabs)/activity.tsx</strong></summary>

  ```javascript
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

    const filteredData = selectedRoom ? data.filter(item => item.room === selectedRoom) : data;

    useEffect(() => {
      const fetchData = async () => {
          try {
              const snapshot = await firebaseService.getLogsRef();
              if (snapshot.exists()) {
                  const items = Object.entries(snapshot.val()).map(([logId, value]:[string, any]) => ({
                    switch: value.switch,
                    time: value.date,
                    state: value.value ? `Turn on` : `Turn off`,
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
      shadowColor: '#000

```
</details>

<details>
  <summary>📄 <strong>app/(tabs)/device_management.tsx</strong></summary>

  ```tsx
  import React, { useState, useEffect } from 'react';
  import { View, Text, FlatList, TouchableOpacity, Alert, ActivityIndicator, StyleSheet } from 'react-native';
  import { Ionicons } from '@expo/vector-icons';
  import firebaseService from '../../config/firebase';
  import AddDeviceButton from '@/components/ui/AddDeviceButton';
  import AddRoomButton from '@/components/ui/AddRoom';
  import { Picker } from '@react-native-picker/picker';
  import { SafeAreaView } from 'react-native-safe-area-context';

  interface SwitchItem {
      switchId: string;
      switch: string;
      value: boolean;
  }

  interface Room {
      idRoom: string;
      name: string;
  }

  const DeviceManagementScreen = () => {
      const [rooms, setRooms] = useState<Room[]>([]);
      const [selectedRoom, setSelectedRoom] = useState<Room | undefined>();
      const [devices, setDevices] = useState<SwitchItem[]>([]);
      const [loading, setLoading] = useState<boolean>(true);
      const [update, setUpdate] = useState<boolean>(false);

      // Lấy danh sách phòng
      useEffect(() => {
          const fetchData = async () => {
              try {
                  const snapshot = await firebaseService.getListRoomhRef();
                  if (snapshot.exists()) {
                      const roomList = Object.entries(snapshot.val()).map(([idRoom, value]:[string, any]) => ({
                          idRoom: idRoom,
                          name: value.name,
                      }));
                      setRooms(roomList);
                      if(roomList.length > 0 && !selectedRoom) {
                          setSelectedRoom(roomList[0]);
                      }
                  } else {
                      setRooms([]);
                  }
              } catch (error) {
                  console.error('Lỗi lấy dữ liệu:', error);
              }
          };
          fetchData();
      }, [update]);

      // Lấy danh sách switch
      useEffect(() => {
          if (!selectedRoom) return;
          setLoading(true);
          const fetchData = async () => {
              try {
                  const snapshot = await firebaseService.getSwitchRef(selectedRoom?.idRoom);
                  if (snapshot.exists()) {
                      const items = Object.entries(snapshot.val()).map(([switchId, value]:[string, any]) => ({
                          switchId: switchId,
                          switch: value.switchName,
                          value: value.value,
                      }));
                      setDevices(items);
                  } else {
                      setDevices([]);
                  }
              } catch (error) {
                  console.error('Lỗi lấy dữ liệu:', error);
              }
              setLoading(false);
          };

          fetchData();
      }, [selectedRoom, update]);

      // Xóa thiết bị
      const deleteDevice = async (switchId: string) => {
          Alert.alert(
              "Xác nhận xóa",
              "Bạn có chắc chắn muốn xóa thiết bị này?",
              [
                  { text: "Hủy", style: "cancel" },
                  {
                      text: "Xóa",
                      onPress: async () => {
                          await firebaseService.deleteDevice(selectedRoom?.idRoom as string, switchId);
                          setUpdate(!update);
                          Alert.alert("Thành công", "Thiết bị đã được xóa!");
                      },
                      style: "destructive",
                  },
              ]
          );
      };

      return (
          <SafeAreaView style={styles.container}>
              {/* Dropdown chọn phòng */}
              <Picker
                  selectedValue={selectedRoom?.idRoom}
                  onValueChange={(itemValue) => {
                      const room = rooms.find((r) => r.idRoom === itemValue);
                      setSelectedRoom(room);
                  }}
                  style={styles.picker}
              >
                  {rooms.map((room) => (
                      <Picker.Item key={room.idRoom} label={room.name} value={room.idRoom} />
                  ))}
              </Picker>

              {loading ? (
                  <ActivityIndicator size="large" color="#0000ff" />
              ) : devices.length === 0 ? (
                  <Text style={styles.noDevicesText}>Không có thiết bị nào</Text>
              ) : (
                  <FlatList
                      data={devices}
                      keyExtractor={(item) => item.switch}
                      renderItem={({ item }) => (
                          <View style={styles.deviceItem}>
                              <Text style={styles.deviceText}>{item.switch}</Text>
                              <TouchableOpacity onPress={() => deleteDevice(item.switchId)}>
                                  <Ionicons name="trash" size={24} color="red" />
                              </TouchableOpacity>
                          </View>
                      )}
                  />
              )}

              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <AddRoomButton update={setUpdate} />
                  <AddDeviceButton roomId={selectedRoom?.idRoom} update={setUpdate} />
              </View>
          </SafeAreaView>
      );
  };

  const styles = StyleSheet.create({
      container: { flex: 1, padding: 10, backgroundColor: '#F4F7FD' },
      picker: { backgroundColor: '#fff', marginBottom: 10, borderRadius: 10, borderWidth: 1, borderColor: '#ddd' },
      noDevicesText: { textAlign: 'center', fontSize: 18, color: '#666', marginTop: 20 },
      deviceItem: { flexDirection: 'row', justifyContent: 'space-between', padding: 15, backgroundColor: '#fff', marginBottom: 10, borderRadius: 10, elevation: 3 },
      deviceText: { fontSize: 16, fontWeight: 'bold' }
  });

  export default DeviceManagementScreen;


```
</details>


<details> <summary>📂 <strong>app/(tabs)/index.tsx</strong></summary>

```tsx
import React, { useState, useEffect } from 'react';
import { Text, View, ActivityIndicator, StyleSheet, ScrollView } from 'react-native';
import firebaseService from '../../config/firebase';
import HeaderHome from '@/components/ui/HeaderHome';
import InfoCard from '@/components/ui/InfoCard';
import DeviceCard from '@/components/ui/DeviceCard';
import AddDeviceButton from '@/components/ui/AddDeviceButton';

interface SwitchItem {
    switchId: string;
    switch: string;
    value: boolean;
}
interface Room {
    idRoom: string;
    name: string;
}

function HomeScreen() {
    const [data, setData] = useState<SwitchItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedRoom, setSelectedRoom] = useState<Room>();
    const [update, setUpdate] = useState<boolean>(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const snapshot = await firebaseService.getSwitchRef(selectedRoom?.idRoom as string);
                if (snapshot.exists()) {
                    const items = Object.entries(snapshot.val()).map(([switchId, value]:[string, any]) => ({
                        switchId: switchId,
                        switch: value.switchName,
                        value: value.value,
                    }));
                    setData(items as SwitchItem[]);
                } else {
                    setData([]);
                }
            } catch (error) {
                console.error('Lỗi lấy dữ liệu:', error);
            }
            setLoading(false);
        };

        fetchData();
    }, [selectedRoom, update]);

    const updateData = (item: SwitchItem) => {
        firebaseService.updateData(selectedRoom as Room, item);
        setUpdate(!update);
    };

    if (loading) {
        return <ActivityIndicator />;
    }

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.textHeader}>Welcome To Home</Text>
            </View>
            <InfoCard />
            <HeaderHome onRoomSelect={setSelectedRoom} />
            <ScrollView contentContainerStyle={styles.contentContainer}>
                <View style={styles.deviceContainer}>
                    {data.map((device, index) => (
                        <DeviceCard key={index} switchItems={[device]} updateData={updateData} />
                    ))}
                    <AddDeviceButton roomId={selectedRoom?.idRoom as string} update={setUpdate} />
                </View>
            </ScrollView>
        </View>
    );
};

export default HomeScreen;

```
</details>

<details> <summary>📂 <strong>app/_layout.tsx</strong></summary>

``` tsx
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState, useCallback } from 'react';
import 'react-native-reanimated';
import { View, Text, ActivityIndicator } from 'react-native';

import { useColorScheme } from '@/hooks/useColorScheme';

// Giữ Splash Screen hiển thị cho đến khi tải xong
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [appReady, setAppReady] = useState(false);

  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    async function prepare() {
      try {
        if (loaded) {
          await new Promise(resolve => setTimeout(resolve, 500)); // Giả lập độ trễ
          setAppReady(true);
        }
      } catch (e) {
        console.warn(e);
      } finally {
        await SplashScreen.hideAsync();
      }
    }
    prepare();
  }, [loaded]);

  // Nếu chưa sẵn sàng, hiển thị màn hình loading
  if (!appReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' }}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={{ color: '#fff', marginTop: 10 }}>Loading App...</Text>
      </View>
    );
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'fade', // Hiệu ứng mượt hơn khi chuyển màn hình
        }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" options={{ title: 'Page Not Found' }} />
      </Stack>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
    </ThemeProvider>
  );
}

```
</details>


<details> <summary>📂 <strong>app/+not-found.tsx</strong></summary>

``` tsx

import { Link, Stack } from 'expo-router';
import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <ThemedView style={styles.container}>
        <ThemedText type="title">This screen doesn't exist.</ThemedText>
        <Link href="/" style={styles.link}>
          <ThemedText type="link">Go to home screen!</ThemedText>
        </Link>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});

```
</details>

<details> <summary>📂 <strong>components/ui/AddDeviceButton.tsx</strong></summary>

```tsx
import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import firebaseService from '../../config/firebase';

interface AddDeviceButtonProps {
    roomId: string;
    update: React.Dispatch<React.SetStateAction<boolean>>;
}

function AddDeviceButton({ roomId, update }: AddDeviceButtonProps) {
    const addDevice = async () => {
        await firebaseService.addSwitch(roomId as string);
        Alert.alert("Thành công", "Đã thêm thiết bị mới!");
        update((prev) => !prev);
    };

    return (
        <TouchableOpacity style={styles.container} onPress={addDevice}>
            <View style={styles.button}>
                <Ionicons name="add" size={24} color="white" />
            </View>
            <Text style={styles.text}>Add Device</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        width: 180,
        height: 180,
        alignItems: 'center',
        backgroundColor: '#1A1C2D',
        padding: 30,
        margin: 6,
        borderRadius: 10,
        borderWidth: 1,
        justifyContent: 'center',
        borderColor: '#444444',
    },
    button: {
        backgroundColor: '#2589F2',
        borderRadius: 50,
        width: 60,
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 5,
    },
    text: {
        color: 'white',
        fontSize: 16,
    }
});

export default AddDeviceButton;

```
</details>

<details> <summary>📂 <strong>components/AddRoom.tsx</strong></summary>

``` tsx
import React, { useState } from 'react';
import { TouchableOpacity, Text, View, StyleSheet, Alert, Modal, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { push, ref, set } from 'firebase/database';
import firebaseService from '../../config/firebase';

function AddRoomButton({update}: {update: React.Dispatch<React.SetStateAction<boolean>>}) {
    const [modalVisible, setModalVisible] = useState(false);
    const [newRoomName, setNewRoomName] = useState('');

    const addRoom = async () => {
        if (newRoomName.trim() === '') {
            Alert.alert("Lỗi", "Tên phòng không được để trống!");
            return;
        }

        await firebaseService.addRoom(newRoomName);
        setNewRoomName('');
        setModalVisible(false);
        update(prev => !prev);
        Alert.alert("Thành công", "Phòng mới đã được thêm!");
    };

    return (
        <>
            <TouchableOpacity style={styles.container} onPress={() => setModalVisible(true)}>
                <View style={styles.button}> 
                    <Ionicons name="add" size={24} color="white" />
                </View>
                <Text style={styles.text}>Add Room</Text>
            </TouchableOpacity>

            {/* Modal nhập tên phòng mới */}
            <Modal visible={modalVisible} transparent={true} animationType="slide">
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Thêm Phòng Mới</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Nhập tên phòng"
                            value={newRoomName}
                            onChangeText={setNewRoomName}
                        />
                        <View style={styles.modalButtons}>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <Text style={styles.cancelButton}>Hủy</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={addRoom}>
                                <Text style={styles.confirmButton}>Thêm</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        width: 180,
        height: 180,
        alignItems: 'center',
        backgroundColor: '#1A9977FF',
        padding: 30,
        margin: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderStyle: 'dashed',
        borderColor: '#444444',
    },
    button: {
        backgroundColor: '#25F251FF',
        borderRadius: 50,
        width: 50,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 5,
    },
    text: {
        color: 'white',
        fontSize: 16,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)'
    },
    modalContent: {
        width: 300,
        padding: 20,
        backgroundColor: '#ffffff',
        borderRadius: 10,
        alignItems: 'center'
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10
    },
    input: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#cccccc',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%'
    },
    cancelButton: {
        color: 'red',
        fontSize: 16
    },
    confirmButton: {
        color: 'blue',
        fontSize: 16
    }
});

export default AddRoomButton;

```
</details>

<details> <summary>📂 <strong>components/CustomSwitch.tsx</strong></summary>

``` tsx
import React from "react";
import { ColorValue } from "react-native";
import { TouchableOpacity, Animated, StyleSheet } from "react-native";

interface CustomSwitchProps {
  value: boolean;
  onValueChange: () => void;
}
const CustomSwitch = ({ value, onValueChange }: CustomSwitchProps) => {
  const animatedValue = new Animated.Value(value ? 1 : 0);

  Animated.timing(animatedValue, {
    toValue: value ? 1 : 0,
    duration: 250,
    useNativeDriver: false,
  }).start();

  const trackColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["#B0B0B0", "#1E2A38"], // Xám khi tắt, xanh đậm khi bật
  });

  const thumbPosition = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 22], // Di chuyển thumb
  });

  return (
    <TouchableOpacity 
      style={[styles.switchContainer, { backgroundColor: trackColor}]} 
      activeOpacity={0.8}
      onPress={onValueChange}
    >
      <Animated.View 
        style={[
          styles.thumb, 
          { transform: [{ translateX: thumbPosition }] }
        ]} 
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  switchContainer: {
    width: 50,
    height: 26,
    borderRadius: 15,
    justifyContent: "center",
    paddingHorizontal: 3,
  },
  thumb: {
    width: 22,
    height: 22,
    backgroundColor: "#FFF",
    borderRadius: 11,
    elevation: 3,
  },
});

export default CustomSwitch;

```
</details>

<details> <summary>📂 <strong>components/CustomTabBar.tsx</strong></summary>

``` tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSegments, useRouter } from 'expo-router';
import { Feather, FontAwesome } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

const TABS = [
  { name: 'index', label: 'Home', icon: (color: string) => <Feather name="home" size={24} color={color} /> },
  { name: 'device_manager', label: 'Devices', icon: (color: string) => <FontAwesome name="bars" size={24} color={color} /> },
  { name: 'activity', label: 'Activity', icon: (color: string) => <Feather name="activity" size={24} color={color} /> },
];

export default function CustomTabBar() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const segments = useSegments();
  
  return (
    <View style={styles.container}>
      {TABS.map((tab, index) => {
        const isActive = segments.includes(tab.name);

        return (
          <TouchableOpacity
            key={index}
            style={[styles.tabButton, isActive && styles.activeTab]}
            onPress={() => router.push(tab.name === 'index' ? '/' : `/${tab.name}`)}

          >
            {tab.icon(isActive ? Colors[colorScheme ?? 'light'].tint : 'gray')}
            <Text style={[styles.tabText, { color: isActive ? Colors[colorScheme ?? 'light'].tint : 'gray' }]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingBottom: 20,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
  tabButton: {
    alignItems: 'center',
    paddingVertical: 10,
    flex: 1,
  },
  tabText: {
    fontSize: 12,
    marginTop: 4,
  },
  activeTab: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 10,
    paddingHorizontal: 10,
  },
});

```
</details>

<details> <summary>📂 <strong>components/HeaderHome.tsx</strong></summary>

``` tsx
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import firebaseService from '../../config/firebase';

interface Room {
  idRoom: string;
  name: string;
}

function HeaderHome({ onRoomSelect }: { onRoomSelect: (room: Room) => void }) {
  const [activeTab, setActiveTab] = useState<Room>();
  const [roomNames, setRoomNames] = useState<Room[]>([]);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const snapshot = await firebaseService.getListRoomhRef();
        if (snapshot.exists()) {
          const data = snapshot.val();
          const names = Object.entries(data).map(([roomId, room]: any) => ({
            idRoom: roomId,
            name: room.name,
          }));
          setRoomNames(names);
          setActiveTab(names[0]);
          onRoomSelect(names[0]);
        }
      } catch (error) {
        console.error('Lỗi lấy danh sách phòng:', error);
      }
    };

    fetchRooms();
  }, []);

  return (
    <SafeAreaView>
      {/* Scrollable Room Tabs */}
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {roomNames.map((room) => (
          <TouchableOpacity
            key={room.idRoom}
            style={[
              styles.tab,
              activeTab?.idRoom === room.idRoom ? styles.activeTab : styles.inactiveTab,
            ]}
            onPress={() => {
              setActiveTab(room);
              onRoomSelect(room);
            }}
          >
            <Text style={activeTab?.idRoom === room.idRoom ? styles.activeText : styles.inactiveText}>
              {room.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

export default HeaderHome;

const styles = StyleSheet.create({
  scrollContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginHorizontal: 5,
  },
  activeTab: {
    backgroundColor: '#3086FF',
  },
  inactiveTab: {
    borderWidth: 1,
    borderColor: '#525252',
  },
  activeText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 17,
  },
  inactiveText: {
    color: '#C0C0C0',
    fontSize: 17,
  },
});

```

</details>


<details> <summary>📂 <strong>components/InfoCard.tsx</strong></summary>

```tsx
import { FontAwesome } from '@expo/vector-icons';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';


const InfoCard = () => {
    return (
        <View style={styles.container}>
            <View style={styles.itemcontainer}>
                <View style={styles.infoItem}>
                    <FontAwesome name="thermometer-half" size={24} color="#6782FFFF" />
                    <View style={styles.infoText}>
                        <Text style={styles.value}>26 °C</Text>
                        <Text style={styles.label}>Temperature</Text>
                    </View>
                </View>
                <View style={styles.infoItem}>
                    <FontAwesome name="tint" size={24} color="#6782FFFF" />
                    <View style={styles.infoText}>
                        <Text style={styles.value}>35%</Text>
                        <Text style={styles.label}>Humidity</Text>
                    </View>
                </View>
            </View>
            <View style={styles.itemcontainer}>
                <View style={styles.infoItem}>
                    <FontAwesome name="bolt" size={24} color="#FF0707FF" />
                    <View style={styles.infoText}>
                        <Text style={styles.value}>256 k</Text>
                        <Text style={styles.label}>Energy Usage</Text>
                    </View>
                </View>
                <View style={styles.infoItem}>
                    <FontAwesome name="lightbulb-o" size={24} color="#BBFF00FF" />
                    <View style={styles.infoText}>
                        <Text style={styles.value}>50%</Text>
                        <Text style={styles.label}>Light Intensity</Text>
                    </View>
                </View>
            </View>

        </View>
    );
};

const styles = StyleSheet.create({
    container:{
        marginTop: 20,
        marginHorizontal: 20,
        borderRadius: 10,
        backgroundColor: '#2D3445',
        padding: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3, 
    },
    itemcontainer: {
        padding: 15,
        borderRadius: 10,
        margin: 5,
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    infoText: {
        marginLeft: 10,
    },
    value: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: 'bold',
    },
    label: {
        color: '#6C757D',
        fontSize: 12,
    },
});


export default InfoCard;
```
</details>


<details> <summary>📂 <strong>config/firebase.tsx</strong></summary>

```tsx
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

```
</details>

