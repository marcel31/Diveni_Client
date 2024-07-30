import React, { useState, useContext, useEffect } from "react";
import {
    View,
    Text,
    SafeAreaView,
    TouchableOpacity,
    Switch,
} from "react-native";
import { EventRegister } from "react-native-event-listeners";
import { useFonts } from "expo-font";
import { useNavigation } from "@react-navigation/native";
import styles from "../styles/Styles";
import themeContext from "../theme/ThemeContext";
import PrimaryButton from "./components/PrimaryButton";
import SignIn from "./SignIn";
import { useTranslation } from "react-i18next";
import { use } from "i18next";
import { getStorage } from "./utils/storage";

function Home() {
    const navigation = useNavigation();
    const { t } = useTranslation();
    const theme = useContext(themeContext);
    const [darkMode, setDarkMode] = useState(false);
    const [fontsLoaded] = useFonts({
        "SpaceGrotesk-Bold": require("../assets/fonts/SpaceGrotesk-Bold.ttf"),
        "SpaceGrotesk-Medium": require("../assets/fonts/SpaceGrotesk-Medium.ttf"),
        "SpaceGrotesk-Regular": require("../assets/fonts/SpaceGrotesk-Regular.ttf"),
        "SpaceGrotesk-SemiBold": require("../assets/fonts/SpaceGrotesk-SemiBold.ttf"),
        "SuezOne-Regular": require("../assets/fonts/SuezOne-Regular.ttf"),
    });

    useEffect(async () => {
        if (await getStorage("theme") === "dark") {
            EventRegister.emit("ChangeTheme", false);
        } else if (await getStorage("theme") === "light"){
            EventRegister.emit("ChangeTheme", true);
        }
    }, []);

    if (!fontsLoaded) {
        return null;
    }
    const handleNavigationSingIn = () => {
        navigation.navigate("SignIn");
    };

    const handleNavigationRegister = () => {
        navigation.navigate("Register");
    };

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
                        <Text style={[styles.titleText, { color: theme.color }]}>
                            Diveni
                        </Text>
                        <View
                            style={{
                                flex: 1,
                                display: "flex",
                                marginTop: 150,
                                alignItems: "center",
                            }}
                        >
                            <PrimaryButton
                                buttonText={t("login")}
                                onPress={handleNavigationSingIn}
                                color={theme.color}
                                backgroundColor={theme.primaryColor}
                            />
                            <View style={{ margin: 10 }} />
                            <PrimaryButton
                                buttonText={t("register")}
                                onPress={handleNavigationRegister}
                                color={theme.color}
                                backgroundColor={theme.primaryColor}
                            />
                            <View style={{ margin: 10 }} />
                        </View>
                    </View>
                </View>
            </SafeAreaView>
        </View>
    );
}

export default Home;
