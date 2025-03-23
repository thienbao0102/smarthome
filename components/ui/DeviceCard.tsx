import React, { useState, useEffect } from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import CustomSwitch from './CustomSwitch';

interface SwitchItem {
  switchId: string;
  switch: string;
  value: boolean;
}

interface DeviceCardProps {
  switchItems: SwitchItem[];
  updateData: (item: SwitchItem) => void;
}

const DeviceCard: React.FC<DeviceCardProps> = ({ switchItems, updateData }) => {
  const [switchStates, setSwitchStates] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    // Đồng bộ switchStates với switchItems khi switchItems thay đổi
    setSwitchStates(
      Object.fromEntries(switchItems.map((item) => [item.switchId, item.value]))
    );

  }, [switchItems]);

  const toggleSwitch = (switchName: string) => {
    const newValue = !switchStates[switchName];

    const item = switchItems.find(item => item.switchId === switchName);
    if (item) {
      updateData({ ...item, value: newValue });
    }
  };

  const isAnySwitchOn = switchItems.some((item) => switchStates[item.switchId]);

  return (
    <View style={[styles.card, { backgroundColor: isAnySwitchOn ? '#4DA8DA' : '#2D3445' }]}>
      {switchItems.map((item) => (
        <View key={item.switchId} style={styles.switchContainer}>
          <View style={styles.switchRow}>
            <Icon name="bulb-outline" size={48} color="#FFFFFF" style={styles.icon} />
            <Text style={styles.switchLabel}>{item.switch}</Text>
          </View>
          <View style={styles.switchControl}>
            <CustomSwitch
              value={switchStates[item.switchId]}
              onValueChange={() => toggleSwitch(item.switchId)}
            />
            <Text style={[styles.switchStatus, { color: switchStates[item.switchId] ? '#00FF00' : '#FFFFFF' }]}>
              {switchStates[item.switchId] ? 'On' : 'Off'}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 180,
    height: 180,
    borderRadius: 10,
    padding: 15,
    margin: 10,
    alignItems: 'center',
  },
  icon: {
    marginRight: 5,
  },
  switchContainer: {
    width: '100%',
    alignItems: 'center',
  },
  switchRow: {
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 5,
  },
  switchLabel: {
    marginTop: 10,
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '500',
  },
  switchControl: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },
  switchStatus: {
    marginLeft: 8,
    top: 15,
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default DeviceCard;