import React, { useContext, useState, useEffect } from "react";
import { View, Text, SafeAreaView, TouchableOpacity } from "react-native";
import styles from "../styles/Styles";
import themeContext from "../theme/ThemeContext";
import { useNavigation, useRoute } from "@react-navigation/native";
import TopNavigationBar from "./components/TopNavigationBar";
import StatisticsCard from "./components/StatisticsCard";
import { useTranslation } from "react-i18next";
import { APP_URL } from "@env";
import {
    auth,
    getUserProfile,
    subscribeToUserProfile,
} from "../backend/FirebaseConnection";

function Statistics() {
    const { t } = useTranslation();
    const theme = useContext(themeContext);
    const navigation = useNavigation();
    const route = useRoute();
    const [selectedMode, setSelectedMode] = useState(t('singleplayer'));
    const [user, setUser] = useState(auth.currentUser);
    const [statistics, setStatistics] = useState({
        gamesPlayed: "0",
        gamesWon: "0",
        winPercentage: "0"
    });

    const handleNavigationProfile = () => {
        navigation.navigate("BottomTabs", { screen: "ProfileTab" });
    };

    const handleModeChange = (mode) => {
        setSelectedMode(mode);
    }
    useEffect(() => {
        async function getStats() {
            const userId = route.params?.userId;
            console.log(userId);
            console.log(user.uid);
            const response = await fetch(`${APP_URL}api/v1/stats/userStats/${userId}`);
            const played = await response.json();
            const playedGames = played.playedGames;
            const wins = played.wins;
            console.log(playedGames);
            console.log(wins);
            setStatistics({
                gamesPlayed: playedGames,
                gamesWon: wins,
                winPercentage: ((wins / playedGames) * 100).toFixed(2) + "%"
            })
        }
        getStats()
    }, [route.params]);

    useEffect(() => {
        if (selectedMode === t("singleplayer")) {
            // Cambiado a "singleplayer"
            setStatistics({
                gamesPlayed: "30",
                gamesWon: "20",
                winPercentage: "60",
            });
        } else {
            setStatistics({
                gamesPlayed: "0",
                gamesWon: "0",
                winPercentage: "0",
            });
        }
    }, [selectedMode]);

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
                        <TopNavigationBar
                            titleText={t("statistics")}
                            onPress={handleNavigationProfile}
                        />
                        <View style={{ marginTop: 30 }}>
                            <StatisticsCard
                                name={t("gamesPlayed")}
                                cardType="1"
                                num={statistics.gamesPlayed}
                            />
                            <StatisticsCard
                                name={t("gamesWon")}
                                cardType="2"
                                num={statistics.gamesWon}
                            />
                            <StatisticsCard
                                name={t("winPercentage")}
                                cardType="3"
                                num={statistics.winPercentage}
                            />
                        </View>
                    </View>
                </View>
            </SafeAreaView>
        </View>
    );
}

export default Statistics;