import React, { useState, useEffect } from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';


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

  const [cardColor, setCardColor] = useState('#ACACACFF'); // Màu mặc định

  useEffect(() => {
    const isAnySwitchOn = Object.values(switchStates).some(value => value);
    setCardColor(isAnySwitchOn ? '#4DA8DA' : '#ACACACFF'); // Đổi màu khi bật/tắt
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
      {switchItems.map((item) => (
        <View key={item.switch} style={styles.switchContainer}>
          <View style={styles.switchRow}>
            <Icon name="bulb-outline" size={48} color="#FFFFFF" style={styles.icon} />
            <Text style={styles.switchLabel}>{item.switch}</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '80%' }}>
            <Switch
              trackColor={{ false: "#767577", true: "#39404DFF" }}
              thumbColor={switchStates[item.switch] ? "#3483ae" : "#f4f3f4"}
              onValueChange={() => toggleSwitch(item.switch)}
              value={switchStates[item.switch]}
            />
            <Text style={[styles.switchStatus, { color: switchStates[item.switch] ? '#00FF00' : '#FF0000' }]}>
              {switchStates[item.switch] ? 'On' : 'Off'}
            </Text>
          </View>
        </View>
      ))}
    </View>

  );
}

const styles = StyleSheet.create({
  card: {
    width: 180,
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
  deviceName: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
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
    alignItems: 'flex-start',
  },
  switchStatus: {
    marginLeft: 8,
    top: 15,
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default DeviceCard;
