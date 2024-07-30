import React, {
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import styles from "../styles/Styles";
import themeContext from "../theme/ThemeContext";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import TopNavigationBar from "./components/TopNavigationBar";
import HigherOrLowerCard from "./components/HigherOrLowerCard";
import LoadingPopover from "./components/LoadingPopover";
import { useQuestion } from "./context/QuestionContext";
import { useRound } from "./context/RoundContext.js";
import { socket } from "./components/socket";
import { IMAGE_URL } from "@env";
import { useTranslation } from "react-i18next";

function ImageQuizz() {
  const { t } = useTranslation();
  const theme = useContext(themeContext);
  const navigation = useNavigation();

  const [imageR1, setImageR1] = useState("");
  const [imageR2, setImageR2] = useState("");
  const [response1, setResponse1] = useState("");
  const [response2, setResponse2] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [result, setResult] = useState("");
  const [showLoadingPopover, setShowLoadingPopover] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [question, setQuestion] = useState({});
  const { roundValue, setRoundValue } = useRound();

  const { roomCodeValue, questionValue, mounted, setMounted } = useQuestion();
  const { width } = Dimensions.get("window");
  const isMobile = width < 600;

  //USEEFFECT
  useFocusEffect(
    React.useCallback(() => {
      console.log("questionValue", questionValue);
      console.log("roundValue", roundValue);
      setRoomCode(roomCodeValue);
      setShowResult(false);
      setQuestion(questionValue.questions[roundValue]);

      const random = Math.floor(Math.random() * 2);
      if (random === 0) {
        setImageR1(IMAGE_URL + questionValue.questions[roundValue].q1.urlI);
        setImageR2(IMAGE_URL + questionValue.questions[roundValue].q1.urlP);
        setResponse1(questionValue.questions[roundValue].q1.urlI);
        setResponse2(questionValue.questions[roundValue].q1.urlP);
      } else {
        setImageR1(IMAGE_URL + questionValue.questions[roundValue].q1.urlP);
        setImageR2(IMAGE_URL + questionValue.questions[roundValue].q1.urlI);
        setResponse1(questionValue.questions[roundValue].q1.urlP);
        setResponse2(questionValue.questions[roundValue].q1.urlI);
      }
    }, [roundValue])
  );

  const handleOptionPress = (reply) => {
    let questions = question;
    questions.answer = reply;
    questions.roomCode = roomCodeValue;
    socket.emit("quizAnswer", questions);
    setShowLoadingPopover(true);
  };

  socket.on("questionResult", (result) => {
    setResult(result);
    setShowResult(true);
    setShowLoadingPopover(false);
  });
  socket.on("nextRound", (round) => {
    console.log("nextRound", round);
    setRoundValue(round);
    navigation.navigate("RoundManager");
  });
  socket.on("gameOver", () => {
    navigation.navigate("GameOver");
  });

  return (
    <View
      style={[styles.viewContainer, { backgroundColor: theme.backgroundColor }]}
    >
      <SafeAreaView
        style={[
          styles.safeAreaView,
          { backgroundColor: theme.backgroundColor },
        ]}
      >
        <View style={[styles.center]}>
          <View style={[styles.appGameView]}>
            <View style={[styles.center]}>
              <TopNavigationBar titleText="Image Quizz" />
              <View style={{ marginTop: 10, alignItems: "center" }}>
                <Text style={{ color: theme.color }}>
                  {t("round")} {roundValue + 1}/10
                </Text>
              </View>
              <View style={{ marginTop: 30, alignItems: "center" }}>
                <Text style={{ color: theme.color }}>{t("whichMadeByHuman")}</Text>
              </View>
              {!isMobile && (
                <>
                  <View
                    style={{
                      flex: 1,
                      marginTop: 30,
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {showLoadingPopover && <LoadingPopover />}
                    <TouchableOpacity
                      style={{ flex: 1 }}
                      onPress={() =>
                        !showResult && handleOptionPress(response1)
                      }
                    >
                      <HigherOrLowerCard
                        cardHeight="70vh"
                        cardWidth="40vw"
                        cardType="1"
                        backgrImage={imageR1}
                        bordColor={
                          showResult
                            ? response1 === result
                              ? "green"
                              : "red"
                            : "black"
                        }
                      />
                    </TouchableOpacity>

                    <View
                      style={{
                        marginHorizontal: 30,
                        alignItems: "center",
                        paddingBottom: "3px",
                      }}
                    >
                      <Text style={{ color: theme.color }}>{t("or")}</Text>
                    </View>

                    <TouchableOpacity
                      style={{ flex: 1 }}
                      onPress={() =>
                        !showResult && handleOptionPress(response2)
                      }
                    >
                      <HigherOrLowerCard
                        cardHeight="70vh"
                        cardWidth="40vw"
                        cardType="1"
                        backgrImage={imageR2}
                        bordColor={
                          showResult
                            ? response2 === result
                              ? "green"
                              : "red"
                            : "black"
                        }
                      />
                    </TouchableOpacity>
                  </View>
                </>
              )}

              {isMobile && (
                <>
                  <View
                    style={{
                      marginTop: 30,
                      flex: 1,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {showLoadingPopover && <LoadingPopover />}
                    <TouchableOpacity
                      onPress={() =>
                        !showResult && handleOptionPress(response1)
                      }
                    >
                      <HigherOrLowerCard
                        cardHeight="300px"
                        cardWidth="300px"
                        cardType="1"
                        backgrImage={imageR1}
                        bordColor={
                          showResult
                            ? response1 === result
                              ? "green"
                              : "red"
                            : "black"
                        }
                      />
                    </TouchableOpacity>

                    <View
                      style={{
                        marginHorizontal: 30,
                        alignItems: "center",
                        paddingBottom: "10px",
                      }}
                    >
                      <Text style={{ color: theme.color }}>{t("or")}</Text>
                    </View>

                    <TouchableOpacity
                      onPress={() =>
                        !showResult && handleOptionPress(response2)
                      }
                    >
                      <HigherOrLowerCard
                        cardHeight="300px"
                        cardWidth="300px"
                        cardType="1"
                        backgrImage={imageR2}
                        bordColor={
                          showResult
                            ? response2 === result
                              ? "green"
                              : "red"
                            : "black"
                        }
                      />
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </View>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

export default ImageQuizz;
