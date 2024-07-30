import React, { useState, useContext, useEffect } from "react";
import { View, SafeAreaView, Keyboard, FlatList, Text } from "react-native";
import {
  auth,
  getAllUsers,
  getUserProfile,
} from "../backend/FirebaseConnection";
import styles from "../styles/Styles";
import themeContext from "../theme/ThemeContext";
import TopTitle from "./components/TopTitle";
import { useNavigation, useRoute } from "@react-navigation/native";
import { socket } from "./components/socket";
import PrimaryButton from "./components/PrimaryButton";
import { useTranslation } from "react-i18next";
import ExpProgressBar from "./components/ExpProgressBar";
import { updateLevel, updateExperience } from "../backend/FirebaseConnection";

function GameOver() {
  const [user, setUser] = useState(auth.currentUser);
  const [positionMessage, setPositionMessage] = useState("");
  const [xpGained, setXpGained] = useState("");
  const [points, setPoints] = useState("");
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user) {
        try {
          const profile = await getUserProfile(user.uid);
          setUserProfile(profile);
        } catch (error) {
          console.log("Error: ", error);
        }
      } else {
        setUserProfile(null);
      }
    };

    fetchUserProfile();
  }, [user]);
  const theme = useContext(themeContext);
  const navigation = useNavigation();
  const { t } = useTranslation();

  const handleResults = (playerList) => {
    for (let index = 0; index < playerList.length; index++) {
      if (playerList[index].uuid === user.uid) {
        setPositionMessage(getPositionMessage(index + 1));
        setPoints(playerList[index].points);
        setXpGained(playerList[index].xp);
      }
    }
  };

  socket.on("results", handleResults);

  const getPositionMessage = (position) => {
    switch (position) {
      case 1:
        return t("1st");
      case 2:
        return t("2nd");
      case 3:
        return t("3rd");
      default:
        return `${t("youPlaced")} ${position}${t("th")}`;
    }
  };

  function calculateExperienceForNextLevel(level) {
    let baseExp = 10;
    for (let i = 1; i < level; i++) {
      baseExp *= 1.1;
    }
    return Math.round(baseExp);
  }

  if (userProfile && userProfile.level !== undefined) {
    var necessaryExp = calculateExperienceForNextLevel(userProfile?.level);

    while (userProfile.experience >= necessaryExp) {
      userProfile.experience -= necessaryExp;
      userProfile.level++;
      necessaryExp = calculateExperienceForNextLevel(userProfile.level);
      updateLevel(user, userProfile.level);
      updateExperience(user, userProfile.experience);
      user.previousLevel = userProfile.level;
    }
  } else {
    var necessaryExp = 0;
  }

  const handleNavigationPlay = () => {
    navigation.navigate("BottomTabs", { screen: "PlayTab" });
  };

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
          <View style={[styles.appView]}>
            <View style={[styles.appGameOverView]}>
              <TopTitle titleText={t("result")} />
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                }}
              >
                <View style={[styles.resultContainer]}>
                  <Text style={styles.resultText}>{positionMessage}</Text>
                  <Text style={styles.resultText}>
                    {t("pointsMade")}: {points}
                  </Text>
                  <Text style={styles.resultText}>
                    {t("xpGained")}: {xpGained}
                  </Text>
                </View>
              </View>
              <View style={{ marginHorizontal: 100, width: "100%" }}>
                <View
                  style={{
                    width: "100%",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "SpaceGrotesk-Bold",
                      fontSize: 15,
                      color: theme.color,
                    }}
                  >
                    {t("level")} {userProfile?.level || 0}
                  </Text>
                  <Text
                    style={{
                      fontFamily: "SpaceGrotesk-Bold",
                      fontSize: 15,
                      color: theme.color,
                    }}
                  >
                    {userProfile?.experience || 0}/{necessaryExp} xp
                  </Text>
                </View>
                <ExpProgressBar
                  userExperience={userProfile?.experience}
                  necessaryExp={necessaryExp}
                />
              </View>
              <View
                style={{
                  alignSelf: "flex-end",
                  width: "100%",
                  paddingTop: 30,
                }}
              >
                <PrimaryButton
                  buttonText={t("goHome")}
                  onPress={handleNavigationPlay}
                  color={theme.color}
                  backgroundColor={theme.primaryColor}
                />
              </View>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

export default GameOver;
