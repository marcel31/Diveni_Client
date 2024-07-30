import React, { useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
import { FontAwesome5 } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import themeContext from "../../theme/ThemeContext";
import styles from "../../styles/Styles";

const GameHistoryCard = ({ result, crownCount, xpCount }) => {
    const { t } = useTranslation();
    const theme = useContext(themeContext);

    const cardBackgroundColor = result === t('victory') ? 'green' : result === t('lose') ? 'red' : 'orange';
    return (
        <View style={[customStyles.cardContainer, { backgroundColor: cardBackgroundColor }]}>
            <View style={customStyles.contentContainer}>
                <Text style={customStyles.resultText}>{result}</Text>
                <View style={customStyles.statsContainer}>
                    <Text style={[customStyles.statsText, { color: theme.Color }]}>{crownCount} <FontAwesome5 name="crown" size={12} color={theme.Color} /> | {xpCount}xp</Text>
                </View>
            </View>
        </View>
    );
};

const customStyles = StyleSheet.create({
    cardContainer: {
        ...styles.socialItemContainer,
        padding: 15,
        borderRadius: 10,
        marginVertical: 10,
    },
    contentContainer: {
        flexDirection: 'column',
        alignItems: 'center',
    },
    resultText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 10,
    },
    statsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statsText: {
        fontSize: 14,
        color: '#fff',
    },
});

export default GameHistoryCard;
