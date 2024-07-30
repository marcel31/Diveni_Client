import React, { useContext } from "react";
import { Text, TouchableOpacity } from "react-native";
import styles from '../../styles/Styles';
import themeContext from "../../theme/ThemeContext";

function PrimaryButton({buttonText, onPress, backgroundColor, color}) {
    const theme = useContext(themeContext);

    return (
        <TouchableOpacity style={[styles.mainTouchableOpacityLight, {backgroundColor}]} onPress={onPress}>
            <Text style={[styles.mainTextOfTouchableOpacityLight, {color}]}>
                {buttonText}
            </Text>
        </TouchableOpacity>
    );
}

export default PrimaryButton;