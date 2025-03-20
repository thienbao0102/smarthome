import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, ActivityIndicator, StyleSheet, TextInput, Modal } from 'react-native';
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
    const [modalVisible, setModalVisible] = useState(false);
    const [newRoomName, setNewRoomName] = useState('');

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
            if (roomList.length > 0 && !selectedRoom) {
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

    const addRoom = async () => {
        if (newRoomName.trim() === '') {
            Alert.alert("Lỗi", "Tên phòng không được để trống!");
            return;
        }

        const newRoomRef = push(ref(firebaseService.database, "rooms"));
        await set(newRoomRef, { name: newRoomName });

        setNewRoomName('');
        setModalVisible(false);
        Alert.alert("Thành công", "Phòng mới đã được thêm!");
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

            {/* Nút thêm thiết bị */}
            <TouchableOpacity style={styles.addButton} onPress={addDevice}>
                <Ionicons name="add-circle" size={50} color="green" />
            </TouchableOpacity>

            {/* Nút thêm phòng */}
            <TouchableOpacity style={styles.addRoomButton} onPress={() => setModalVisible(true)}>
                <Ionicons name="add-circle" size={50} color="blue" />
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
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#F4F7FD' },
    picker: { backgroundColor: '#fff', marginBottom: 10, borderRadius: 10, borderWidth: 1, borderColor: '#ddd' },
    noDevicesText: { textAlign: 'center', fontSize: 18, color: '#666', marginTop: 20 },
    deviceItem: { flexDirection: 'row', justifyContent: 'space-between', padding: 15, backgroundColor: '#fff', marginBottom: 10, borderRadius: 10, elevation: 3 },
    deviceText: { fontSize: 16, fontWeight: 'bold' },
    addButton: { position: 'absolute', right: 20, bottom: 20 },
    addRoomButton: { position: 'absolute', left: 20, bottom: 20 },
    modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
    modalContent: { width: 300, padding: 20, backgroundColor: '#fff', borderRadius: 10, alignItems: 'center' },
    modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
    input: { width: '100%', borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 5, marginBottom: 10 },
    modalButtons: { flexDirection: 'row', justifyContent: 'space-between', width: '100%' },
    cancelButton: { color: 'red', fontSize: 16 },
    confirmButton: { color: 'blue', fontSize: 16 }
});

export default DeviceManagementScreen;
