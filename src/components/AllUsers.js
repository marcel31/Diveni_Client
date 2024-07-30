import Crown from "./CrownCounter";
import React, { useContext } from 'react';
import styles from "../../styles/Styles";
import { View, Text, Image, TouchableOpacity } from "react-native";
import themeContext from "../../theme/ThemeContext";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from 'react-i18next';



const AllUsers = ({ name, imageURL, user, touchable, onPress, onPressEdit }) => {
    const navigation = useNavigation();
    const { t } = useTranslation();
    const theme = useContext(themeContext);

    const navigateToUserProfile = () => {
        if (touchable === true && user !== undefined) {
            navigation.navigate('OtherUserProfile', { user });
        } else {
            console.log("User not found");
        }
    }

    return (
        <TouchableOpacity onPress={navigateToUserProfile}>
            <View style={styles.socialItemContainer}>
                <Image style={{
                    height: 45,
                    aspectRatio: 1,
                    borderRadius: 50,
                }} source={{ uri: imageURL }} />
                <Text style={{ flex: 1, marginLeft: 10, fontFamily: "SpaceGrotesk-Bold", color: theme.color }}>{name}</Text>
                <TouchableOpacity onPress={onPressEdit} style={{ marginRight: 20 }}>
                    <Text style={{ color: "green" }}>{t('Edit')}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={onPress}>
                    <Text style={{ color: "red" }}>{t('delete')}</Text>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );
};

export default AllUsers;