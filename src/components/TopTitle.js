import React, {useContext, useState} from "react";
import { View, Text, Switch } from "react-native";
import themeContext from "../../theme/ThemeContext";
import styles from '../../styles/Styles';

function TopTitle({titleText}) {
    const theme = useContext(themeContext);
    return (
        <View style={styles.navBarView}>
            <Text style={[styles.titleTextNavBar, { color: theme.color }]}>{titleText}</Text>
        </View>
    );
}

export default TopTitle;