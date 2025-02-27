// DeviceCard.jsx  
import React, { useState } from 'react';  
import { View, Text, Switch, StyleSheet } from 'react-native';  

const devices = [  
  { name: "Light", brand: "Philips hue" },  
  { name: "Air Conditioner", brand: "LG S3" },  
  { name: "Smart TV", brand: "LG A1" },  
  { name: "Router", brand: "D-link 422" },  
];  

const DeviceCard = ({ device }) => {  
  const [isEnabled, setIsEnabled] = useState(false);  

  const toggleSwitch = () => setIsEnabled(previousState => !previousState);  

  return (  
    <View style={styles.card}>  
      <Text style={styles.deviceName}>{device.name}</Text>  
      <Text style={styles.deviceBrand}>{device.brand}</Text>  
      <Switch  
        trackColor={{ false: "#767577", true: "#39404DFF" }}  
        thumbColor={isEnabled ? "#3BC03BFF" : "#f4f3f4"}  
        onValueChange={toggleSwitch}  
        value={isEnabled}  
      />  
    </View>  
  );  
};  

const styles = StyleSheet.create({  
  card: {  
    width: 170,  
    backgroundColor: '#4B4949FF',  
    borderRadius: 10,  
    padding: 15,  
    margin: 10,  
    alignItems: 'center',  
  },  
  deviceName: {  
    color: '#FFFFFF',  
    fontSize: 18,  
    fontWeight: 'bold',  
  },  
  deviceBrand: {  
    color: '#B0B0B0',  
    fontSize: 14,  
  },  
});  

export default DeviceCard;