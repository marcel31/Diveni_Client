import React, { useContext } from 'react';
import { View, Image, Text } from 'react-native';
import styles from "../../styles/Styles";
import themeContext from "../../theme/ThemeContext";
import { FontAwesome5 } from '@expo/vector-icons';


function CrownCounter({ borderColor, crownCount, color }) {
    const theme = useContext(themeContext);
    return (
        <View style={[styles.crownCounter, { borderColor }]}>
            <FontAwesome5 name="crown" size={20} color={color} />
            <Text style={[styles.crownCounterText, { color }]}>{crownCount}</Text>
        </View>
    );
};

export default CrownCounter;