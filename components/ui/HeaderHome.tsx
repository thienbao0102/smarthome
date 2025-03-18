import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
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
      <View style={styles.container}>  
      {roomNames.map((roomName) => (
        <TouchableOpacity  
          key={roomName.idRoom}
          style={styles.tab}
          onPress={() =>{
            setActiveTab(roomName)
            onRoomSelect(roomName)
          } }  
        >  
          <Text style={activeTab === roomName ? styles.activeText : styles.inactiveText}>  
            {roomName.name}  
          </Text>  
          {activeTab === roomName && <View style={styles.indicator} />}  
        </TouchableOpacity>  
      ))}  
    </View>  
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
    backgroundColor: '#2C2C2C',
    // shadowColor: '#000',
    // shadowOffset: { width: 4, height: 4 },
    // shadowOpacity: 0.3,
    // shadowRadius: 5,
    elevation: 6,
  },
  textHeader: {
    fontSize: 25,
    fontWeight: 'bold',
  },
  container: {  
    flexDirection: 'row',  
    backgroundColor: '#2C2C2C',  
    padding: 10,  
  },  
  tab: {  
    flex: 1,  
    alignItems: 'center',  
    position: 'relative',  
  },  
  activeText: {  
    color: '#FFFFFF',  
    fontWeight: 'bold',
    paddingBottom : 10,
  },  
  inactiveText: {  
    color: '#B0B0B0',  
  },  
  indicator: {  
    position: 'absolute',  
    bottom: 0,  
    height: 4,  
    width: '100%',  
    backgroundColor: '#32CD32', // Màu xanh lá  
  },  
})