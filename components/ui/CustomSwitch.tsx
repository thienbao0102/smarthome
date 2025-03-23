import React from "react";
import { TouchableOpacity, Animated, StyleSheet } from "react-native";

const CustomSwitch = ({ value, onValueChange }) => {
  const animatedValue = new Animated.Value(value ? 1 : 0);

  Animated.timing(animatedValue, {
    toValue: value ? 1 : 0,
    duration: 250,
    useNativeDriver: false,
  }).start();

  const trackColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["#B0B0B0", "#1E2A38"], // Xám khi tắt, xanh đậm khi bật
  });

  const thumbPosition = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 22], // Di chuyển thumb
  });

  return (
    <TouchableOpacity 
      style={[styles.switchContainer, { backgroundColor: trackColor }]} 
      activeOpacity={0.8}
      onPress={onValueChange}
    >
      <Animated.View 
        style={[
          styles.thumb, 
          { transform: [{ translateX: thumbPosition }] }
        ]} 
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  switchContainer: {
    width: 50,
    height: 26,
    borderRadius: 15,
    justifyContent: "center",
    paddingHorizontal: 3,
  },
  thumb: {
    width: 22,
    height: 22,
    backgroundColor: "#FFF",
    borderRadius: 11,
    elevation: 3,
  },
});

export default CustomSwitch;
