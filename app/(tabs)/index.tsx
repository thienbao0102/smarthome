import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';

import HeaderHome  from '../../components/HeaderHome';
import InfoCard from '@/components/InfoCard';
import DeviceCard from '@/components/DeviceCard';

const devices = [  
  { name: "Light", brand: "Philips hue" },  
  { name: "Air Conditioner", brand: "LG S3" },  
  { name: "Smart TV", brand: "LG A1" },  
  { name: "Router", brand: "D-link 422" },  
]; 

export default function HomeScreen() {
  return (
    <View style={styles.container}>
        <HeaderHome />
        <InfoCard />
        <View style={styles.deviceContainer}>  
        {devices.map((device, index) => (  
          <DeviceCard key={index} device={device} />  
        ))}  
      </View>
    </View>
);
}

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
