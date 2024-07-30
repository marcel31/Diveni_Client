import React, { useContext } from "react";
import { View, Text, ImageBackground } from "react-native";
import { Entypo, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import themeContext from "../../theme/ThemeContext";
import { LinearGradient } from "expo-linear-gradient";

function HigherOrLowerCard({ name, cardType, num, bordColor, backgrImage, cardHeight, cardWidth }) {
    const theme = useContext(themeContext);

    let iconComponent;

    switch (cardType) {
        case "1":
            iconComponent = <Entypo name="controller-play" size={24} color={theme.Color} />;
            break;
        case "2":
            iconComponent = <FontAwesome5 name="crown" size={20} color={theme.Color} />;
            break;
        case "3":
            iconComponent = <MaterialCommunityIcons name="percent" size={24} color={theme.Color} />;
            break;
        default:
            iconComponent = null;
    }

    return (
        <ImageBackground
            source={{
                uri: backgrImage
            }}
            style={{
                borderRadius: 10,
                width: cardWidth,
                height: cardHeight,
                marginBottom: 10,
                justifyContent: 'center',
                alignItems: 'center',
                borderColor: bordColor,
                borderWidth: 3,
                shadowColor: bordColor,
                shadowOffset: { width: 0, height: 7 },
                shadowOpacity: 0.3,
                shadowRadius: 40,
                overflow: 'hidden',
                resizeMode: "contain"
            }}
        >
            <LinearGradient
                colors={['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.8)']}
                style={{ position: 'absolute', bottom: 0, padding: 10, width: '100%' }}
            >
                <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                    <View style={{ padding: 10 }}>
                        <Text style={{ color: 'white' }}>{name}</Text>
                    </View>
                    <View style={{ padding: 10 }}>
                        <Text style={{ color: 'white' }}>{num}</Text>
                    </View>
                </View>
            </LinearGradient>
        </ImageBackground>
    );
};

export default HigherOrLowerCard;