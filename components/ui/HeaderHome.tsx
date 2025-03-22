import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { SafeAreaView } from 'react-native-safe-area-context'
import firebaseService from '../../config/firebase';

interface Room {
  idRoom: string;
  name: string;
}

function HeaderHome ({onRoomSelect}: { onRoomSelect: (room: Room) => void }) {
  const [activeTab, setActiveTab] = useState<Room>();
  const [roomNames, setRoomNames] = useState<Room[]>([]);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const snapshot = await firebaseService.getListRoomhRef();
        console.log("snapshot", snapshot);
        if (snapshot.exists()) {
          const data = snapshot.val();
          const names = Object.entries(data).map(([roomId, room]: any) => ({
            idRoom: roomId,
            name: room.name
          }));
          setRoomNames(names);
          setActiveTab(names[0]);
          onRoomSelect(names[0]);
        }
      } catch (error) {
        console.error("Lỗi lấy danh sách phòng:", error);
      }
    };

    fetchRooms();
  }, []);

  return (
    <SafeAreaView>
    <View style={styles.headerContainer}>
      <Text style={styles.textHeader}>Home</Text>
      <View style={styles.iconContainer}>
        <Ionicons name="settings-sharp" size={30} color="white" />
      </View>
    </View>

    {/* Scrollable Room Tabs */}
    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
      {roomNames.map((room) => (
        <TouchableOpacity
          key={room.idRoom}
          style={[styles.tab, activeTab?.idRoom === room.idRoom && styles.activeTab]}
          onPress={() => {
            setActiveTab(room);
            onRoomSelect(room);
          }}
        >
          <Text style={activeTab?.idRoom === room.idRoom ? styles.activeText : styles.inactiveText}>
            {room.name}
          </Text>
          {activeTab?.idRoom === room.idRoom && <View style={styles.indicator} />}
        </TouchableOpacity>
      ))}
    </ScrollView>
  </SafeAreaView>
  )
}

export default HeaderHome

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 25,
  },
  iconContainer: {
    borderWidth: 1,
    borderColor: 'white',
    padding: 8,
    borderRadius: 10,
    backgroundColor: '#232a34',
    elevation: 6,
  },
  textHeader: {
    fontSize: 25,
    fontWeight: 'bold',
    color: 'black',
  },
  scrollContainer: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: '#207FA8',
  },
  activeText: {
    color: '#000',
    fontWeight: 'bold',
  },
  inactiveText: {
    color: '#525252',
  },
  indicator: {
    height: 4,
    width: '100%',
    position: 'absolute',
    bottom: 0,
  },
})