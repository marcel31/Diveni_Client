import React, { useContext, useState, useEffect } from "react";
import { View, Text, SafeAreaView, FlatList } from "react-native";
import styles from "../styles/Styles";
import themeContext from "../theme/ThemeContext";
import { useNavigation, useRoute } from "@react-navigation/native";
import TopNavigationBar from "./components/TopNavigationBar";
import GameHistoryCard from "./components/GameHistoryCard.js";
import { useTranslation } from "react-i18next";
import { APP_URL } from "@env";
import { auth } from "../backend/FirebaseConnection";

function GameHistory() {
  const { t } = useTranslation();
  const [user, setUser] = useState(auth.currentUser);
  const theme = useContext(themeContext);
  const navigation = useNavigation();
  const [gameHistory, setGameHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const route = useRoute();

  const handleNavigationProfile = () => {
    navigation.navigate("BottomTabs", { screen: "ProfileTab" });
  };

  useEffect(() => {
    async function getStats() {
      try {
        // Acceder al userId pasado como parámetro
        const userId = route.params?.userId;
        const response = await fetch(
          `${APP_URL}api/v1/stats/playHistory/${userId}`
        );
        const history = await response.json();
        setGameHistory(history);
        setIsLoading(false);
        console.log(history);
      } catch (error) {
        console.error("Error fetching game history:", error);
      }
    }
    getStats();
  }, [route.params]);

  return (
    <View
      style={[
        styles.viewContainer,
        { backgroundColor: theme.backgroundColor, flex: 1 },
      ]}
    >
      <SafeAreaView
        style={[
          styles.safeAreaView,
          { backgroundColor: theme.backgroundColor, flex: 1 },
        ]}
      >
        <View style={[styles.center]}>
          <View style={[styles.appView]}>
            <TopNavigationBar
              titleText={t("gameHistory")}
              onPress={handleNavigationProfile}
            />
            <View style={{ marginTop: 30, height: "700px" }}>
              {isLoading ? (
                <Text>Loading...</Text>
              ) : gameHistory.length === 0 ? (
                <Text>{t("No game history yet")}</Text>
              ) : (
                <FlatList
                  style={{ paddingRight: 12 }}
                  data={gameHistory}
                  renderItem={({ item }) => (
                    <GameHistoryCard
                      result={item.winner ? t("victory") : t("lose")}
                      crownCount={`+${item.crowns}`}
                      xpCount={`+${item.xp}`}
                    />
                  )}
                  keyExtractor={(item, index) => index.toString()}
                />
              )}
            </View>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

export default GameHistory;