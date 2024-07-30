import React, { useContext, useState } from "react";
import { View, Text, SafeAreaView, TextInput } from "react-native";
import styles from "../styles/Styles";
import themeContext from "../theme/ThemeContext";
import { useNavigation } from "@react-navigation/native";
import PrimaryButton from "./components/PrimaryButton";
import TopNavigationBar from "./components/TopNavigationBar";
import { useTranslation } from "react-i18next";
import { sendPasswordResetEmail } from "firebase/auth"; // Import the function for sending password reset email
import { auth } from "../backend/FirebaseConnection";

function RecoveryEnterEmail() {
  const { t } = useTranslation();
  const theme = useContext(themeContext);
  const navigation = useNavigation();
  const [email, setEmail] = useState(""); // State to hold the user's email address

  const handleNavigationSignIn = () => {
    navigation.navigate("SignIn");
  };

  const handleNavigationRecoveryEnterCode = () => {
    navigation.navigate("RecoveryEnterCode");
  };

  const handleResetPassword = async () => {
    try {
      await sendPasswordResetEmail(auth, email); // Send password reset email
      alert("Password reset email sent. Please check your inbox.");
      navigation.navigate("RecoveryEnterCode"); // Navigate to the next step
    } catch (error) {
      alert("Error sending password reset email: " + error.message);
    }
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
              onPress={handleNavigationSignIn}
            />
            <View style={{ margin: 10 }} />
            <Text style={[styles.someText, { color: theme.color }]}>
              {t("enterCredentials")}
            </Text>
            <View style={{ margin: 10 }} />
            <TextInput
              style={[
                styles.mainPlaceholder,
                { backgroundColor: theme.secondaryColor, color: theme.color },
              ]}
              placeholder="Email"
              placeholderTextColor={theme.color}
              value={email}
              onChangeText={(text) => setEmail(text)}
            />
            <View style={{ width: "100%", position: "absolute", bottom: -75 }}>
              <PrimaryButton
                buttonText={t("getRecoveryCode")}
                color={theme.color}
                backgroundColor={theme.accentColor}
                onPress={handleResetPassword}
              />
            </View>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

export default RecoveryEnterEmail;
