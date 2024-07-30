import React, { useContext } from "react";
import { View } from "react-native";
import { FontAwesome } from '@expo/vector-icons';
import styles from "../../styles/Styles";
import themeContext from "../../theme/ThemeContext";

function ProfileButton({ backgroundColor }) {
    const theme = useContext(themeContext);
    return (
        <View style={[styles.playButton, { backgroundColor }]}>
            <FontAwesome name="user-circle" size={24} color={theme.backgroundColor} />
        </View>
    )
}

export default ProfileButton;