import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, Animated } from 'react-native';
import themeContext from "../../theme/ThemeContext";
import { useTranslation } from 'react-i18next';
import styles from '../../styles/Styles';



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
        >
            <View style={styles.popoverModalContainer}>
                <Animated.View style={[styles.popoverModalContent, { transform: [{ scale: scaleValue }] }]}>
                    <View style={{marginTop: 20, width: "100%"}}>
                        <Text>{t('loading')}</Text>
                    </View>
                </Animated.View>
            </View>
        </Modal>
    );
};

export default PopupSettings;