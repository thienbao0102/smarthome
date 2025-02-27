import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { SafeAreaView } from 'react-native-safe-area-context'

const HeaderHome = () => {
  const [activeTab, setActiveTab] = useState('Living Room');  

  const tabs = ['All', 'Living Room', 'Kitchen', 'Bathroom'];  

  return (
    <SafeAreaView>
      <View style={styles.headerContainer}>
        <Text style={styles.textHeader}>Home</Text>
        <View style={styles.iconContainer}>
          <Ionicons name="settings-sharp" size={30} color="white" />
        </View>
      </View>
      <View style={styles.container}>  
      {tabs.map((tab) => (  
        <TouchableOpacity  
          key={tab}  
          style={styles.tab}  
          onPress={() => setActiveTab(tab)}  
        >  
          <Text style={activeTab === tab ? styles.activeText : styles.inactiveText}>  
            {tab}  
          </Text>  
          {activeTab === tab && <View style={styles.indicator} />}  
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