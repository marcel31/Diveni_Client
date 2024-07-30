import React, { useContext } from "react";
import { View } from "react-native";
import { AntDesign } from '@expo/vector-icons';
import styles from "../../styles/Styles";
import themeContext from "../../theme/ThemeContext";

function SocialButton({ backgroundColor }) {
    const theme = useContext(themeContext);
    return (
        <View style={[styles.playButton, { backgroundColor }]}>
            <AntDesign name="star" size={24} color={theme.backgroundColor} />
        </View>
    )
}

export default SocialButton;