import React, { useState } from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';

interface SwitchItem {
  switch: string;
  value: boolean;
}

interface DeviceCardProps {
  switchItems: SwitchItem[];
}

function DeviceCard ({ switchItems }: DeviceCardProps) {
  const [switchStates, setSwitchStates] = useState<{ [key: string]: boolean }>(
    Object.fromEntries(switchItems.map(item => [item.switch, item.value]))
  );

  const toggleSwitch = (switchName: string) => {
    setSwitchStates(prevState => ({
      ...prevState,
      [switchName]: !prevState[switchName],
    }));
  };

  return (
    <View style={styles.card}>
      <Text style={styles.deviceName}>Thiết bị</Text>
      {switchItems.map((item) => (
        <View key={item.switch} style={styles.switchRow}>
          <Text style={styles.switchLabel}>{item.switch}</Text>
          <Switch
            trackColor={{ false: "#767577", true: "#39404DFF" }}
            thumbColor={switchStates[item.switch] ? "#3BC03BFF" : "#f4f3f4"}
            onValueChange={() => toggleSwitch(item.switch)}
            value={switchStates[item.switch]}
          />
        </View>
      ))}
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
    marginBottom: 10,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 5,
  },
  switchLabel: {
    color: '#FFFFFF',
    fontSize: 14,
  },
});

export default DeviceCard;
