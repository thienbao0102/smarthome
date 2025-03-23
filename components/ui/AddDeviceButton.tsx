import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import firebaseService from '../../config/firebase';


function AddDeviceButton({ roomId }: any) {
    const addDevice = async () => {
        firebaseService.addSwitch(roomId);
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
