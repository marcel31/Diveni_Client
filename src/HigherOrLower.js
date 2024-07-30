import React, {
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
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
import { useTranslation } from "react-i18next";

import { socket } from "./components/socket";

function HigherOrLower() {
  const { t } = useTranslation();
  const theme = useContext(themeContext);
  const navigation = useNavigation();
  const [showLoadingPopover, setShowLoadingPopover] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState("");
  const [q1, setQ1] = useState("");
  const [q2, setQ2] = useState("");
  const [s1, setS1] = useState("");
  const [s2, setS2] = useState("");
  const [image1, setImage1] = useState("");
  const [image2, setImage2] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [answer, setAnswer] = useState("");
  const [question, setQuestion] = useState({});
  const { roundValue, setRoundValue } = useRound();

  const { roomCodeValue, questionValue, mounted, setMounted } = useQuestion();
  const { width } = Dimensions.get("window");
  const isMobile = width < 600; // Cambia este valor según tus necesidades

  useFocusEffect(
    React.useCallback(() => {
      setShowResult(false);
      console.log("roomCodeValue", roomCodeValue);
      console.log("questionValue", questionValue);
      console.log("round", roundValue);
      setRoomCode(roomCodeValue);
      setQuestion(questionValue.questions[roundValue]);
      setQ1(firstLetterUpperCase(questionValue.questions[roundValue].q1.term));
      setQ2(firstLetterUpperCase(questionValue.questions[roundValue].q2.term));
      setImage1(questionValue.questions[roundValue].q1.image);
      setImage2(questionValue.questions[roundValue].q2.image);
      setS1(questionValue.questions[roundValue].q1.searches.toLocaleString());
      setS2(questionValue.questions[roundValue].q2.searches.toLocaleString());
    }, [roundValue]) // Dependencias en las que reacciona el efecto
  );

  const handleOptionPress = (reply) => {
    setAnswer(reply);
    let questions = question;
    questions.answer = reply;
    questions.roomCode = roomCodeValue;
    socket.emit("quizAnswer", questions);
    if (!showLoadingPopover) {
      setShowLoadingPopover(!showLoadingPopover);
    }
  };

  function firstLetterUpperCase(str) {
    try {
      if (str === undefined) {
        return "";
      }
      return str.charAt(0).toUpperCase() + str.slice(1);
    } catch (error) {
      console.log(error);
      return "";
    }
  }

  const handleNavigationPlay = () => {
    navigation.navigate("BottomTabs", { screen: "PlayTab" });
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
              <TopNavigationBar
                titleText={t("searchesQuiz")}
                onPress={handleNavigationPlay}
              />
              <View style={styles.higherOrLowerText}>
                <Text style={{ color: theme.color }}>
                  {t("round")} {roundValue + 1}/10
                </Text>
              </View>
              <View
                style={{
                  marginTop: 10,
                  alignItems: "center",
                  marginBottom: 20,
                }}
              >
                <Text style={{ color: theme.color }}>{t("higherOrLowerQuestion")}</Text>
              </View>
              {!isMobile && (
                <>
                  <View
                    style={{
                      flex: 1,
                      marginTop: 15,
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {showLoadingPopover && <LoadingPopover />}

                    <TouchableOpacity
                      onPress={() =>
                        !showResult && handleOptionPress(question.q1.id)
                      }
                      style={{ flex: 1, marginRight: 30 }}
                    >
                      <HigherOrLowerCard
                        cardHeight="70vh"
                        cardWidth="40vw"
                        name={q1}
                        cardType="1"
                        num={s1}
                        backgrImage={image1}
                        bordColor={
                          showResult
                            ? question.q1.id === result
                              ? "green"
                              : "red"
                            : "black"
                        }
                        style={{ width: "100%", height: "100%" }}
                      />
                    </TouchableOpacity>
                    <Text style={{ color: theme.color }}>{t("or")}</Text>
                    <TouchableOpacity
                      onPress={() =>
                        !showResult && handleOptionPress(question.q2.id)
                      }
                      style={{ flex: 1, marginLeft: 30 }}
                    >
                      <HigherOrLowerCard
                        cardHeight="70vh"
                        cardWidth="40vw"
                        name={q2}
                        cardType="1"
                        num={showResult ? s2 : ""}
                        backgrImage={image2}
                        bordColor={
                          showResult
                            ? question.q2.id === result
                              ? "green"
                              : "red"
                            : "black"
                        }
                        style={{ width: "100%", height: "100%" }}
                      />
                    </TouchableOpacity>
                  </View>
                </>
              )}

              {isMobile && (
                <View
                  style={{
                    flex: 1,
                    marginTop: 15,
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {showLoadingPopover && <LoadingPopover />}
                  <>
                    <TouchableOpacity
                      onPress={() =>
                        !showResult && handleOptionPress(question.q1.id)
                      }
                    >
                      <HigherOrLowerCard
                        cardHeight="300px"
                        cardWidth="300px"
                        name={q1}
                        cardType="1"
                        num={s1}
                        backgrImage={image1}
                        bordColor={
                          showResult
                            ? question.q1.id === result
                              ? "green"
                              : "red"
                            : "black"
                        }
                        style={{ width: "100%", height: "100%" }}
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
                        !showResult && handleOptionPress(question.q2.id)
                      }
                    >
                      <HigherOrLowerCard
                        cardHeight="300px"
                        cardWidth="300px"
                        name={q2}
                        cardType="1"
                        num={showResult ? s2 : ""}
                        backgrImage={image2}
                        bordColor={
                          showResult
                            ? question.q2.id === result
                              ? "green"
                              : "red"
                            : "black"
                        }
                        style={{ width: "100%", height: "100%" }}
                      />
                    </TouchableOpacity>
                  </>
                </View>
              )}
            </View>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

export default HigherOrLower;
