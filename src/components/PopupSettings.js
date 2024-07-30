import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, Animated } from 'react-native';
import { EventRegister } from 'react-native-event-listeners';
import { signOutUser, auth, getUserProfile, deleteUserNormal } from '../../backend/FirebaseConnection';
import { useNavigation } from "@react-navigation/native";
import themeContext from "../../theme/ThemeContext";
import PrimaryButton from './PrimaryButton';

import { LanguageContext } from '../contexts/LanguageContext';
import { useTranslation } from 'react-i18next';
import { getLocales } from "expo-localization";
import i18n from "../i18n";
import { use } from 'i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getStorage, saveStorage } from '../utils/storage';

const PopupSettings = ({ onClose }) => {
    const { language, setLanguage } = useContext(LanguageContext);
    const navigation = useNavigation();
    const [showLanguageSelector, setShowLanguageSelector] = useState(false);
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

    const handleOptionSelection = (option) => {
        switch (option) {
            case 'Logout':
                signOut();
                break;
            case 'Delete Account':
                deleteAccount();
                break;
            case 'Dark Mode':
                toggleDarkMode();
                break;
            case 'Lang':
                setShowLanguageSelector(true);
                break;
            case 'Contact Form':
                contactForm();
                break;
            case 'Close':
                onClose();
                break;
            default:
                break;
        }
    };

    const signOut = async () => {
        try {
            await signOutUser();
            navigation.navigate('Home');
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
    };

    const deleteAccount = async () => {
        try {
            await deleteUserNormal(auth.currentUser);
            await signOutUser();
            navigation.navigate('Home');
        } catch (error) {
            // Manejar el error
        }
    };

    const toggleDarkMode = async () => {
        if (theme.theme === "dark") {
            await saveStorage("theme", "dark");
            EventRegister.emit('ChangeTheme', false);
        } else {
            await saveStorage("theme", "light");
            EventRegister.emit('ChangeTheme', true);
        }
        console.log("Theme: ", theme.theme);
        console.log("Theme: ", await getStorage("theme"));
    };

    const changeLanguage = (language) => {
        setLanguage(language);
        i18n.changeLanguage(language);
        setShowLanguageSelector(false);
    };

    const contactForm = () => {
        navigation.navigate('ContactForm');
        //close the popup
        onClose();
    }

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={true}
            onRequestClose={onClose}
        >
            <View style={styles.modalContainer}>
                {showLanguageSelector ? (
                    <Animated.View style={[styles.modalContent, { transform: [{ scale: scaleValue }] }]}>
                        <TouchableOpacity onPress={() => setShowLanguageSelector(false)} style={styles.closeButton}>
                            <Text>X</Text>
                        </TouchableOpacity>
                        <View style={{ marginTop: 20, width: "100%" }}>
                            <View style={{ paddingBottom: 5 }}>
                                <PrimaryButton onPress={() => changeLanguage('en')} buttonText={t('english')} color={theme.color} backgroundColor={theme.primaryColor} style={{}} ></PrimaryButton>
                            </View>
                            <View style={{ paddingBottom: 5 }}>
                                <PrimaryButton onPress={() => changeLanguage('es')} buttonText={t('spanish')} color={theme.color} backgroundColor={theme.primaryColor} style={{}} ></PrimaryButton>
                            </View>
                            <View style={{ paddingBottom: 5 }}>
                                <PrimaryButton onPress={() => changeLanguage('ca')} buttonText={t('catalan')} color={theme.color} backgroundColor={theme.primaryColor} style={{}} ></PrimaryButton>
                            </View>
                            <View style={{ paddingBottom: 5 }}>
                                <PrimaryButton onPress={() => changeLanguage('eo')} buttonText={t('esperanto')} color={theme.color} backgroundColor={theme.primaryColor} style={{}} ></PrimaryButton>
                            </View>
                        </View>
                    </Animated.View>
                ) : (
                    <Animated.View style={[styles.modalContent, { transform: [{ scale: scaleValue }] }]}>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Text>X</Text>
                        </TouchableOpacity>
                        <View style={{ marginTop: 20, width: "100%" }}>
                            <View style={{ paddingBottom: 5 }}>
                                <PrimaryButton buttonText={t('logout')} onPress={() => handleOptionSelection('Logout')} color={theme.color} backgroundColor={theme.primaryColor} style={{}} ></PrimaryButton>
                            </View>
                            <View style={{ paddingBottom: 5 }}>
                                <PrimaryButton buttonText={t('select_language')} onPress={() => handleOptionSelection('Lang')} color={theme.color} backgroundColor={theme.primaryColor} style={{}} ></PrimaryButton>
                            </View>
                            <View style={{ paddingBottom: 5 }}>
                                <PrimaryButton buttonText={theme.theme == "dark" ? t('light_mode') : t('dark_mode')} onPress={() => handleOptionSelection('Dark Mode')} color={theme.color} backgroundColor={theme.primaryColor} style={{}}></PrimaryButton>
                            </View>
                            <View style={{ paddingBottom: 5 }}>
                                <PrimaryButton buttonText={t('contact_form')} onPress={() => handleOptionSelection('Contact Form')} color={theme.color} backgroundColor={theme.primaryColor} style={{}}></PrimaryButton>
                            </View>
                            <View style={{ paddingBottom: 5 }}>
                                <PrimaryButton buttonText={t('delete_account')} onPress={() => handleOptionSelection('Delete Account')} color={theme.color} backgroundColor={theme.primaryColor} style={{}}></PrimaryButton>
                            </View>
                        </View>
                    </Animated.View>
                )}
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
        position: 'absolute',
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        padding: 5,
    },
});

export default PopupSettings;
