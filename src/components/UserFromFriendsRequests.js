import React, { useContext, useEffect } from 'react';
import styles from "../../styles/Styles";
import { View, Text, Image, TouchableOpacity } from "react-native";
import themeContext from "../../theme/ThemeContext";
import { useNavigation } from "@react-navigation/native";
import { AntDesign } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';


const UsersFromFriendsRequests = ({ name, imageURL, user, touchable, onPressAccept, onPressDecline }) => {
    const { t } = useTranslation();
    const navigation = useNavigation();
    const theme = useContext(themeContext);


    const navigateToUserProfile = () => {
        if (touchable === true && user !== undefined) {
            navigation.navigate('OtherUserProfile', { user });
        } else {
            console.log("User not found");
        }
    };

    return (
        <TouchableOpacity onPress={navigateToUserProfile}>
            <View style={styles.socialItemContainer}>
                <Image style={{
                    height: 45,
                    aspectRatio: 1,
                    borderRadius: 50,
                }} source={{ uri: imageURL }} />
                <View style={{ display: "flex", flexDirection: "column" }}>
                    <Text style={{ flex: 1, marginLeft: 10, fontFamily: "SpaceGrotesk-Bold", color: theme.color }}>{name}</Text>
                    <Text style={{ flex: 1, marginLeft: 10, fontFamily: "SpaceGrotesk-Bold", color: theme.color }}>{t('wantToFriend')}</Text>
                </View>
                <View style={{ display: "flex", flexDirection: "row", flex: 1, justifyContent: "flex-end" }}>
                    <TouchableOpacity onPress={onPressAccept}>
                        <AntDesign name="checkcircle" size={32} color="green" />
                    </TouchableOpacity>
                    <View style={{ width: 15 }} />
                    <TouchableOpacity onPress={onPressDecline}>
                        <AntDesign name="closecircle" size={32} color="red" />
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    );
};

export default UsersFromFriendsRequests;