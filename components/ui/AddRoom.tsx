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