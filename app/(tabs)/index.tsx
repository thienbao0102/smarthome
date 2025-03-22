import React, { useState, useEffect } from 'react';
import { FlatList, Text, View, Switch, ActivityIndicator, StyleSheet } from 'react-native';
import firebaseService from '../../config/firebase';
import { onValue, query, limitToLast } from 'firebase/database';
import HeaderHome from '@/components/ui/HeaderHome';
import InfoCard from '@/components/ui/InfoCard';
import DeviceCard from '@/components/ui/DeviceCard';

// Định nghĩa kiểu dữ liệu cho item
interface SwitchItem {
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

    useEffect(() => {
        // const itemsRef = query(firebaseService.getSwitchRef(selectedRoom?.idRoom), limitToLast(50));  //lấy toàn bộ dữ liệu
        const itemsRef = firebaseService.getSwitchRef(selectedRoom?.idRoom);     
        const unsubscribe = onValue(itemsRef, (snapshot) => {
            const items: SwitchItem[] = [];
            snapshot.forEach((child) => {
                items.push({
                    switch: child.key,
                    value: child.val()
                });
            });
            setData(items);
            setLoading(false);
        }, (error) => {
            console.error('Error fetching data:', error);
            setLoading(false);
        }); 

        return () => unsubscribe();
    }, [selectedRoom]);

    const updateData = (item: SwitchItem) => {
        firebaseService.updateData(selectedRoom, item.switch, item.value);
    };

    if (loading) {
        return <ActivityIndicator />;
    }
    // console.log("select room", selectedRoom);
    // console.log("data", data);
    return (
        <View style={styles.container}>
            <HeaderHome onRoomSelect={setSelectedRoom} />
            <InfoCard />
            <View style={styles.deviceContainer}>
                {data.map((device, index) => (
                    <DeviceCard key={index} switchItems={[device]} updateData={updateData} />
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#2C2C2C',
        flex: 1,
    },
    deviceContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
});

export default HomeScreen;
