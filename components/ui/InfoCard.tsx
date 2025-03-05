import { FontAwesome } from '@expo/vector-icons';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';


const InfoCard = () => {
    return (
        <View style={styles.container}>
            <View style={styles.itemcontainer}>
                <View style={styles.infoItem}>
                    <FontAwesome name="thermometer-half" size={24} color="#fff" />
                    <View style={styles.infoText}>
                        <Text style={styles.value}>26 °C</Text>
                        <Text style={styles.label}>Temperature</Text>
                    </View>
                </View>
                <View style={styles.infoItem}>
                    <FontAwesome name="tint" size={24} color="#fff" />
                    <View style={styles.infoText}>
                        <Text style={styles.value}>35%</Text>
                        <Text style={styles.label}>Humidity</Text>
                    </View>
                </View>
            </View>
            <View style={styles.itemcontainer}>
                <View style={styles.infoItem}>
                    <FontAwesome name="bolt" size={24} color="#fff" />
                    <View style={styles.infoText}>
                        <Text style={styles.value}>256 k</Text>
                        <Text style={styles.label}>Energy Usage</Text>
                    </View>
                </View>
                <View style={styles.infoItem}>
                    <FontAwesome name="lightbulb-o" size={24} color="#fff" />
                    <View style={styles.infoText}>
                        <Text style={styles.value}>50%</Text>
                        <Text style={styles.label}>Light Intensity</Text>
                    </View>
                </View>
            </View>

        </View>
    );
};

const styles = StyleSheet.create({
    container:{
        margin: 20,
        borderRadius: 10,
        backgroundColor: '#3B3744FF',
    },
    itemcontainer: {
        padding: 20,
        borderRadius: 10,
        margin: 10,
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    infoText: {
        marginLeft: 10,
    },
    value: {
        color: '#fff',
        fontSize: 18,
    },
    label: {
        color: '#B0B0B0',
        fontSize: 12,
    },
});

export default InfoCard;