import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSegments, useRouter } from 'expo-router';
import { Feather, FontAwesome } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

const TABS = [
  { name: 'index', label: 'Home', icon: (color: string) => <Feather name="home" size={24} color={color} /> },
  { name: 'device_manager', label: 'Devices', icon: (color: string) => <FontAwesome name="bars" size={24} color={color} /> },
  { name: 'activity', label: 'Activity', icon: (color: string) => <Feather name="activity" size={24} color={color} /> },
];

export default function CustomTabBar() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const segments = useSegments();
  
  return (
    <View style={styles.container}>
      {TABS.map((tab, index) => {
        const isActive = segments.includes(tab.name);

        return (
          <TouchableOpacity
            key={index}
            style={[styles.tabButton, isActive && styles.activeTab]}
            onPress={() => router.push(tab.name === 'index' ? '/' : `/${tab.name}`)}

          >
            {tab.icon(isActive ? Colors[colorScheme ?? 'light'].tint : 'gray')}
            <Text style={[styles.tabText, { color: isActive ? Colors[colorScheme ?? 'light'].tint : 'gray' }]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingBottom: 20,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
  tabButton: {
    alignItems: 'center',
    paddingVertical: 10,
    flex: 1,
  },
  tabText: {
    fontSize: 12,
    marginTop: 4,
  },
  activeTab: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 10,
    paddingHorizontal: 10,
  },
});
