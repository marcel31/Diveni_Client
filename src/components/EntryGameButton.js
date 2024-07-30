import React, {useContext} from "react";
import { TouchableOpacity, Text } from "react-native";
import styles from '../../styles/Styles';
import themeContext from "../../theme/ThemeContext";

function EntryGameButton({ buttonText, onPress, backgroundColor, color }) {
    const theme = useContext(themeContext);
    return (
        <TouchableOpacity style={[styles.singlePlayerMultiPlayerButton, { backgroundColor }]} onPress={onPress}>
            <Text style={[styles.mainTextOfTouchableOpacityLight, { color }]}>
                {buttonText}
            </Text>
        </TouchableOpacity>
    );
}

export default EntryGameButton;