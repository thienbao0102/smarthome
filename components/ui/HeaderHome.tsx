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
