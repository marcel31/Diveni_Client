import React, {useContext, useState} from "react";
import { View, Text, Switch } from "react-native";
import { AntDesign } from '@expo/vector-icons';
import themeContext from "../../theme/ThemeContext";
import styles from '../../styles/Styles';

function TopNavigationBar({onPress, titleText}) {
    const theme = useContext(themeContext);
    return (
        <View style={styles.navBarView}>
            <AntDesign name="caretleft" size={24} onPress={onPress} style={[styles.goBackIcon, {color: theme.color}]} />
            <Text style={[styles.titleTextNavBar, { color: theme.color }]}>{titleText}</Text>
        </View>
    );
}

export default TopNavigationBar;