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


