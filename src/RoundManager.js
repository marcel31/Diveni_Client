import React, { useContext, useRef, useState, useEffect, useCallback } from "react";
import { View, Text, SafeAreaView, Image } from "react-native";
import styles from "../styles/Styles";
import themeContext from "../theme/ThemeContext";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useQuestion } from './context/QuestionContext';
import { DELAY } from "./constants.js";
import { useRound } from "./context/RoundContext.js";
//IMPORT IMAGE

function RoundManager() {
    const theme = useContext(themeContext);
    const navigation = useNavigation();

    const { questionValue, mounted, setMounted } = useQuestion();
    const { roundValue, addRound } = useRound();

    useFocusEffect(
        React.useCallback(() => {
            console.log("aqui es" + roundValue);
                console.log("RoundManager round" + roundValue);
                if (questionValue.questions[parseInt(roundValue)].type === 3) {
                    console.log("Imagequizz")
                    navigation.navigate("ImageQuizz");
                } else {
                    console.log("HigherOrLower")
                    navigation.navigate("HigherOrLower");
                }
        }, [navigation, roundValue]) // Dependencias del useCallback
    );

    return (
        <View style={[styles.viewContainer, { backgroundColor: theme.backgroundColor }]}>
            <SafeAreaView style={[styles.safeAreaView, { backgroundColor: theme.backgroundColor }]}>
                <Image className='imageBio' src="https://i.gifer.com/72gi.gif" alt="Loading" />
            </SafeAreaView>
            
        </View>
    );
}

export default RoundManager;
