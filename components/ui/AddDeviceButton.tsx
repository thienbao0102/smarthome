import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { push, ref, set } from 'firebase/database';
import firebaseService from '../../config/firebase';

interface AddDeviceButtonProps {
    roomId: string | undefined;
}

const AddDeviceButton: React.FC<AddDeviceButtonProps> = ({ roomId }) => {
    const addDevice = async () => {
        if (!roomId) {
            Alert.alert("Thông báo", "Vui lòng chọn phòng trước!");
            return;
        }

        const newDeviceRef = push(ref(firebaseService.database, `rooms/${roomId}/switches`));
        await set(newDeviceRef, false);
        Alert.alert("Thành công", "Đã thêm thiết bị mới!");
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
        width: 150,
        height: 150,
        alignItems: 'center',
        backgroundColor: '#1A1C2D',
        padding: 30,
        margin: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderStyle: 'dashed',
        borderColor: '#444444',
    },
    button: {
        backgroundColor: '#2589F2',
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
    }
});

export default AddDeviceButton;
