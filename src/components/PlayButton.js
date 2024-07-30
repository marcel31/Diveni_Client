import React, { useContext } from "react";
import { View } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import styles from "../../styles/Styles";
import themeContext from "../../theme/ThemeContext";

function PlayButton({ backgroundColor }) {
    const theme = useContext(themeContext);
    return (
        <View style={[styles.playButton, { backgroundColor } ]}>
            <Ionicons name="game-controller" size={24} color={theme.backgroundColor} />
        </View>
    )
}

export default PlayButton;