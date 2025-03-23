import { FontAwesome } from '@expo/vector-icons';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';


const InfoCard = () => {
    return (
        <View style={styles.container}>
            <View style={styles.itemcontainer}>
                <View style={styles.infoItem}>
                    <FontAwesome name="thermometer-half" size={24} color="#6782FFFF" />
                    <View style={styles.infoText}>
                        <Text style={styles.value}>26 °C</Text>
                        <Text style={styles.label}>Temperature</Text>
                    </View>
                </View>
                <View style={styles.infoItem}>
                    <FontAwesome name="tint" size={24} color="#6782FFFF" />
                    <View style={styles.infoText}>
                        <Text style={styles.value}>35%</Text>
                        <Text style={styles.label}>Humidity</Text>
                    </View>
                </View>
            </View>
            <View style={styles.itemcontainer}>
                <View style={styles.infoItem}>
                    <FontAwesome name="bolt" size={24} color="#FF0707FF" />
                    <View style={styles.infoText}>
                        <Text style={styles.value}>256 k</Text>
                        <Text style={styles.label}>Energy Usage</Text>
                    </View>
                </View>
                <View style={styles.infoItem}>
                    <FontAwesome name="lightbulb-o" size={24} color="#BBFF00FF" />
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
        marginTop: 20,
        marginHorizontal: 20,
        borderRadius: 10,
        backgroundColor: '#2D3445',
        padding: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3, 
    },
    itemcontainer: {
        padding: 15,
        borderRadius: 10,
        margin: 5,
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
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: 'bold',
    },
    label: {
        color: '#6C757D',
        fontSize: 12,
    },
});


export default InfoCard;