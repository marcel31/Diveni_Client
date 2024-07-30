import React, { useContext } from "react";
import { Text, TouchableOpacity, View, Image } from "react-native"; 
import styles from '../../styles/Styles';
import themeContext from "../../theme/ThemeContext";

function GoogleButton({onPress, backgroundColor}) {
    const theme = useContext(themeContext);

    return (
        <TouchableOpacity style={[styles.googleButton, { backgroundColor }]} onPress={onPress}>
            <View style={styles.contentGoogle}>
                <Image source={{uri: "https://rotulosmatesanz.com/wp-content/uploads/2017/09/2000px-Google_G_Logo.svg_.png"}} style={styles.imageGoogle} /> {/* Use source as an object with uri key */}
                <Text style={[styles.mainTextOfTouchableOpacityLight, { color: theme.color }]}>
                    Google
                </Text>
            </View>
        </TouchableOpacity>
    );
}

export default GoogleButton;
