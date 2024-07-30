import React, { useContext, useState, useEffect, useRef } from "react";
import { View, Text, SafeAreaView, TouchableOpacity, Image, Dimensions } from "react-native";
import styles from "../styles/Styles";
import themeContext from "../theme/ThemeContext";
import { useNavigation } from "@react-navigation/native";

//IMPORT IMAGE


import { socket } from './components/socket';
import { useQuestion } from "./context/QuestionContext";

function ChooseType() {
    const { width } = Dimensions.get('window');
    const imageWidth = width - 40;  
    const theme = useContext(themeContext);
    const navigation = useNavigation();

    const { setRoomCode, setQuestion, mounted, setMounted } = useQuestion();


    // Ejemplo de cómo actualizar el valor de data

    //USEEFFECT

    useEffect(() => {
        const handleQuizQuestion = (question) => {
            console.log(question);
            //USE CONTEXT
            setRoomCode(question.roomCode);
            setQuestion(question);
            if (question.questions[0].type === 3) navigation.navigate("ImageQuizz");
            else navigation.navigate("HigherOrLower");
        };
        socket.on("quizQuestion", handleQuizQuestion);
    }, []);

    return (
        <View style={[styles.viewContainer, { backgroundColor: theme.backgroundColor }]}>
            <SafeAreaView style={[styles.safeAreaView, { backgroundColor: theme.backgroundColor }]}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Image
                        style={{ width: imageWidth, height: 200, resizeMode: 'contain' }}
                        source={{ uri: 'https://i.gifer.com/72gi.gif' }}
                        alt="Loading"
                        />
                </View>
            </SafeAreaView>
        </View>
    );
}

export default ChooseType;
