import React, { useContext } from "react";
import { View, Text } from "react-native";
import { Entypo, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import themeContext from "../../theme/ThemeContext";
import styles from "../../styles/Styles";

function StatisticsCard({ name, cardType, num }) {
    const theme = useContext(themeContext);

    let iconComponent;

    switch (cardType) {
        case "1":
            iconComponent = <Entypo name="controller-play" size={24} color={'white'} />;
            break;
        case "2":
            iconComponent = <FontAwesome5 name="crown" size={20} color={'white'} />;
            break;
        case "3":
            iconComponent = <MaterialCommunityIcons name="percent" size={24} color={'white'} />;
            break;
        default:
            iconComponent = null;
    }

    return (
        <View style={{ backgroundColor: '#4BA063', borderRadius: 10, padding: 15, marginBottom: 10 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
                {iconComponent}
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ color: 'white', fontWeight: 'bold' }}>{name}</Text>
                <Text style={{ color: 'white', fontWeight: 'bold' }}>{num}</Text>
            </View>
        </View>
    );
};

export default StatisticsCard;