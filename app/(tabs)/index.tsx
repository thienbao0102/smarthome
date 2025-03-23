import React, { useState, useEffect } from 'react';
import { Text, View, ActivityIndicator, StyleSheet, ScrollView } from 'react-native';
import firebaseService from '../../config/firebase';
import HeaderHome from '@/components/ui/HeaderHome';
import InfoCard from '@/components/ui/InfoCard';
import DeviceCard from '@/components/ui/DeviceCard';
import AddDeviceButton from '@/components/ui/AddDeviceButton';

// Định nghĩa kiểu dữ liệu cho item
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
                <Text style={styles.textHeader}>Wellcom To Home</Text>
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

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#202A30',
        flex: 1,
        paddingTop: 50,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginStart: 25,
    },
    textHeader: {
        fontSize: 25,
        fontWeight: 'bold',
        color: 'white',
    },
    contentContainer: {
        flexGrow: 1,
        alignItems: 'center',
        paddingVertical: 20
    },
    deviceContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 10
    }
});

export default HomeScreen;
