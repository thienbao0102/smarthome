import React, { useState, useEffect } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from 'react-native';

import firebaseService from '../../config/firebase';
import { onValue, query, limitToLast } from 'firebase/database';

// Định nghĩa kiểu dữ liệu cho log
interface LogItem {
  switch_id: number;
  time: string;
  title: string;
  description: string;
}

export default function ActivityScreen() {
  const [waiting, setWaiting] = useState<boolean>(true);
  const [data, setData] = useState<LogItem[]>([]);

  useEffect(() => {

    const logsRef = query(firebaseService.getLogsRef(), limitToLast(50));

    const unsubscribe = onValue(logsRef, (snapshot) => {
      const items: LogItem[] = [];
      snapshot.forEach((child) => {
        const value = child.val();
        if (typeof value.switch_id === 'number' && typeof value.date === 'string') {
          items.unshift({
            switch_id: value.switch_id,
            time: value.date,
            title: value.value
              ? `Turn on ${value.switch_id}`
              : `Turn off ${value.switch_id}`,
            description: value.date,
          });
        } else {
          // console.log('Condition failed for value:', value);
        }
      });
      setData(items);
      setWaiting(false);
      console.log('Data fetched successfully:');
    }, (error) => {
      console.error('Error fetching data:', error);
      setWaiting(false);

    });
    return () => unsubscribe();
  }, []);

  if (waiting) {
    return <ActivityIndicator />;
  } else if (data.length === 0) {
    return (
      <View style={styles.itemContainer}>
        <Text>No Activity</Text>
      </View>
    );
  } else {
    const renderItem = ({ item }: any) => {
      console.log("Rendering item:", item);
      return (
        <View style={styles.itemContainer}>
        {/* Time */}
        <View style={styles.timeContainer}>
          <Text style={styles.timeText}>{item.time}</Text>
        </View>
        {/* Circle and Line */}
        <View style={styles.circleLineContainer}>
          <View style={styles.circle} />
          <View style={styles.line} />
        </View>
        {/* Content */}
        <View style={styles.contentContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </View>
      </View>
      );
    };
    console.log('Data:', data.length);
    return (
      <View style={{ flex: 1 }}>
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 5,
    paddingRight: 5,
  },
  list: {
    flex: 1,
  },
  itemContainer: {
    flexDirection: 'row',
    marginVertical: 10,
    alignItems: 'flex-start',
  },
  timeContainer: {
    minWidth: 52,
    justifyContent: 'center',
  },
  timeText: {
    textAlign: 'center',
    backgroundColor: '#ff9797',
    color: 'white',
    padding: 5,
    borderRadius: 13,
  },
  circleLineContainer: {
    alignItems: 'center',
    marginHorizontal: 10,
  },
  circle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgb(45,156,219)',
  },
  line: {
    width: 2,
    height: '100%',
    backgroundColor: 'rgb(45,156,219)',
  },
  contentContainer: {
    flex: 1,
  },
  title: {
    fontWeight: 'bold',
  },
  description: {
    color: 'gray',
  },
});
