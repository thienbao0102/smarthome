import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, ActivityIndicator, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import firebaseService from '../../config/firebase';
import { onValue, ref, remove, push, set } from 'firebase/database';
import { Picker } from '@react-native-picker/picker';

interface SwitchItem {
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

    useEffect(() => {
        const roomRef = ref(firebaseService.database, "rooms");

        const unsubscribe = onValue(roomRef, (snapshot) => {
            const roomList: Room[] = [];
            snapshot.forEach((child) => {
                roomList.push({
                    idRoom: child.key,
                    name: child.val().name,
                });
            });
            setRooms(roomList);
            if (roomList.length > 0) {
                setSelectedRoom(roomList[0]); // Chọn phòng đầu tiên mặc định
            }
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (!selectedRoom) return;

        setLoading(true);
        const switchRef = firebaseService.getSwitchRef(selectedRoom.idRoom);

        const unsubscribe = onValue(switchRef, (snapshot) => {
            const items: SwitchItem[] = [];
            snapshot.forEach((child) => {
                items.push({
                    switch: child.key,
                    value: child.val(),
                });
            });
            setDevices(items);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [selectedRoom]);

    const addDevice = async () => {
        if (!selectedRoom) {
            Alert.alert("Thông báo", "Vui lòng chọn phòng trước!");
            return;
        }

        const newDeviceRef = push(ref(firebaseService.database, `rooms/${selectedRoom.idRoom}/switches`));
        await set(newDeviceRef, false);
        Alert.alert("Thành công", "Đã thêm thiết bị mới!");
    };

    const deleteDevice = async (switchId: string) => {
        if (!selectedRoom) return;

        Alert.alert(
            "Xác nhận xóa",
            "Bạn có chắc chắn muốn xóa thiết bị này?",
            [
                { text: "Hủy", style: "cancel" },
                {
                    text: "Xóa",
                    onPress: async () => {
                        await remove(ref(firebaseService.database, `rooms/${selectedRoom.idRoom}/switches/${switchId}`));
                        Alert.alert("Thành công", "Thiết bị đã được xóa!");
                    },
                    style: "destructive",
                },
            ]
        );
    };

    return (
        <View style={styles.container}>
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
                            <TouchableOpacity onPress={() => deleteDevice(item.switch)}>
                                <Ionicons name="trash" size={24} color="red" />
                            </TouchableOpacity>
                        </View>
                    )}
                />
            )}

            <TouchableOpacity style={styles.addButton} onPress={addDevice}>
                <Ionicons name="add-circle" size={50} color="green" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#F4F7FD',
    },
    picker: {
        backgroundColor: '#fff',
        marginBottom: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    noDevicesText: {
        textAlign: 'center',
        fontSize: 18,
        color: '#666',
        marginTop: 20,
    },
    deviceItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        backgroundColor: '#fff',
        marginBottom: 10,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    deviceText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    addButton: {
        position: 'absolute',
        right: 20,
        bottom: 20,
    },
});

export default DeviceManagementScreen;
