import Crown from "./CrownCounter";
import React, { useContext } from 'react';
import styles from "../../styles/Styles";
import { View, Text, Image, TouchableOpacity } from "react-native";
import themeContext from "../../theme/ThemeContext";
import { useNavigation } from "@react-navigation/native";


const SocialItem = ({ name, crownCount, imageURL, user, touchable }) => {
    const navigation = useNavigation();
    const theme = useContext(themeContext);

    const navigateToUserProfile = () => {
        if(touchable === true && user !== undefined){
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
            <Text style={{ flex: 1, marginLeft: 10, fontFamily: "SpaceGrotesk-Bold", color: theme.color }}>{name}</Text>
            <Crown color={theme.color} borderColor={theme.color} crownCount={crownCount} />
        </View>
    </TouchableOpacity>
);
};

export default SocialItem;