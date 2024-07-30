import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, Modal, Animated, TextInput } from 'react-native';
import styles from '../../styles/Styles';
import { useNavigation } from "@react-navigation/native";
import themeContext from "../../theme/ThemeContext";
import PrimaryButton from './PrimaryButton';
import { socket } from "./socket";
import { useTranslation } from 'react-i18next';

const PopupMultiplayer = ({ onClose }) => {
    const navigation = useNavigation();

    const [showForm, setShowForm] = useState(false);
    const [code, setCode] = useState(''); 
    const [errorMessage, setErrorMessage] = useState('');
    const theme = useContext(themeContext);
    const scaleValue = new Animated.Value(0);
    const { t } = useTranslation();

    useEffect(() => {
        if (!showForm) {
            Animated.spring(scaleValue, {
                toValue: 1,
                friction: 4,
                useNativeDriver: true,
            }).start();
        }
    }, [showForm, scaleValue]);

    const handleOptionSelection = (option) => {
        switch (option) {
            case 'Create room':
                onClose();
                navigation.navigate('WaitRoom', { isCreator: true, inviteCode:'' });
                break;
            case 'Join':
                setShowForm(true); 
                break;
            default:
                break;
        }
    };

    const handleJoinRoom = () => {
        const trimmedCode = code.trim();
        try {
            socket.emit('joinRoom', trimmedCode);
            socket.on('joinRoom', (playerList) => {
                if (Array.isArray(playerList)){
                    onClose();
                    navigation.navigate('WaitRoom', { isCreator: false, inviteCode: trimmedCode });
                }else{
                    //TODO: Que devuelva en el server algo que no sea un array
                    setErrorMessage(t('gameNotFound'));
                }
            });
        } catch (error) {
            console.log("Error creating code: ", error);
        }
    };

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={true}
            onRequestClose={onClose}
        >
            <View style={styles.modalContainer}>
                <Animated.View style={[styles.modalContent, { transform: showForm ? [] : [{ scale: scaleValue }] }]}>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <Text>X</Text>
                    </TouchableOpacity>
                    {!showForm && (
                        <View style={{ marginTop: 20, padding: 20, width: "100%" }}>
                            <View style={{ paddingBottom: 25 }}>
                                <PrimaryButton buttonText={t('createRoom')} onPress={() => handleOptionSelection('Create room')} color={theme.color} backgroundColor={theme.primaryColor} style={{}}></PrimaryButton>
                            </View>
                            <PrimaryButton buttonText={t('joinRoom')} onPress={() => handleOptionSelection('Join')} color={theme.color} backgroundColor={theme.primaryColor} style={{}}></PrimaryButton>
                        </View>
                    )}
                    {showForm && (
                        <View style={{ padding: 20, width: "100%" }}>
                            <TextInput
                                style={[styles.mainPlaceholder, { backgroundColor: theme.secondaryColor, color: theme.color, marginBottom: 10 }]}
                                placeholder={t('enterCode')}
                                onChangeText={text => setCode(text)}
                                value={code}
                            />
                            {errorMessage !== '' && <Text style={{ color: 'red', marginTop: 5 }}>{errorMessage}</Text>}
                            <PrimaryButton buttonText={t('joinRoom')} onPress={handleJoinRoom} color={theme.color} backgroundColor={theme.primaryColor}></PrimaryButton>
                        </View>
                    )}
                </Animated.View>
            </View>
        </Modal>
    );
};

export default PopupMultiplayer;
