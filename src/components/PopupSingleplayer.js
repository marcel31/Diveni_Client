import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, Animated } from 'react-native';
import { EventRegister } from 'react-native-event-listeners'

import themeContext from "../../theme/ThemeContext";

import { useTranslation } from 'react-i18next';


const PopupSettings = ({ onClose }) => {
    const [darkMode, setDarkMode] = useState(false);
    const theme = useContext(themeContext);
    const scaleValue = new Animated.Value(0);
    const { t } = useTranslation();


    useEffect(() => {
        Animated.spring(scaleValue, {
            toValue: 1,
            friction: 4,
            useNativeDriver: true,
        }).start();
    }, [scaleValue]);

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={true}
            onRequestClose={onClose}
        >
            <View style={styles.modalContainer}>
                <Animated.View style={[styles.modalContent, { transform: [{ scale: scaleValue }] }]}>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <Text>X</Text>
                    </TouchableOpacity>
                    <View style={{marginTop: 20, width: "100%"}}>
                        <Text>In Progress</Text>
                    </View>
                </Animated.View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#FFF',
        padding: 20,
        borderRadius: 10,
        width: '80%',
        alignItems: 'center',
    },
    optionButton: {
        marginBottom: 10,
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        padding: 5,
    },
});

export default PopupSettings;
