import React, { useState, useEffect } from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';

interface SwitchItem {
  switch: string;
  value: boolean;
}

interface DeviceCardProps {
  switchItems: SwitchItem[];
  updateData: (item: SwitchItem) => void;
}

const DeviceCard: React.FC<DeviceCardProps> = ({ switchItems, updateData }) => {
  const [switchStates, setSwitchStates] = useState<{ [key: string]: boolean }>(
    Object.fromEntries(switchItems.map(item => [item.switch, item.value]))
  );

  const [cardColor, setCardColor] = useState('#2B2B3A'); // Màu mặc định

  useEffect(() => {
    const isAnySwitchOn = Object.values(switchStates).some(value => value);
    setCardColor(isAnySwitchOn ? '#4DA8DA' : '#2B2B3A'); // Đổi màu khi bật/tắt
  }, [switchStates]);

  const toggleSwitch = (switchName: string) => {
    const newValue = !switchStates[switchName];
    setSwitchStates(prevState => ({
      ...prevState,
      [switchName]: newValue,
    }));

    const item = switchItems.find(item => item.switch === switchName);
    if (item) {
      updateData({ ...item, value: newValue });
    }
  };

  return (
    <View style={[styles.card, { backgroundColor: cardColor }]}>
      <Text style={styles.deviceName}>Thiết bị</Text>
      {switchItems.map((item) => (
        <View key={item.switch} style={styles.switchRow}>
          <Text style={styles.switchLabel}>{item.switch}</Text>
          <Switch
            trackColor={{ false: "#767577", true: "#39404DFF" }}
            thumbColor={switchStates[item.switch] ? "#3483ae" : "#f4f3f4"}
            onValueChange={() => toggleSwitch(item.switch)}
            value={switchStates[item.switch]}
          />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 170,
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
