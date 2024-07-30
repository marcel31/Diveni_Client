import React, { useContext } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  Switch,
  TouchableOpacity,
} from "react-native";
import styles from "../styles/Styles";
import themeContext from "../theme/ThemeContext";
import { useNavigation } from "@react-navigation/native";
import PrimaryButton from "./components/PrimaryButton";
import TopNavigationBar from "./components/TopNavigationBar";
import { useTranslation } from "react-i18next";

function RecoveryEnterCode() {
  const { t } = useTranslation();

  const theme = useContext(themeContext);
  const navigation = useNavigation();
  const handleNavigationRecoveryEnterNewPassword = () => {
    navigation.navigate("Home");
  };
  const handleNavigationRecoveryEnterMail = () => {
    navigation.navigate("RecoveryEnterMail");
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
            <TopNavigationBar
              titleText={t("recovery")}
              onPress={handleNavigationRecoveryEnterMail}
            />
            <View style={{ margin: 10 }} />
            <Text
              style={[
                styles.someText2,
                { color: theme.color, textAlign: "center", marginTop: 250 },
              ]}
            >
              {t("checkMail")}
            </Text>
            <View style={{ margin: 10 }} />
            <View style={{ width: "100%", position: "absolute", bottom: -300 }}>
              <PrimaryButton
                buttonText={t("confirm")}
                color={theme.color}
                backgroundColor={theme.accentColor}
                onPress={handleNavigationRecoveryEnterNewPassword}
              />
            </View>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

export default RecoveryEnterCode;
