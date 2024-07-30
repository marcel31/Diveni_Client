import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
  Alert,
} from "react-native";
import styles from "../styles/Styles";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import themeContext from "../theme/ThemeContext";
import TopNavigationBar from "./components/TopNavigationBar";
import PrimaryButton from "./components/PrimaryButton";
import {
  auth,
  sendEmailAndDoubtFromUserToAdmin,
} from "../backend/FirebaseConnection"; // Import the function to send info to admin

const ContactForm = () => {
  const { t } = useTranslation();
  const theme = useContext(themeContext);
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [info, setInfo] = useState("");
  const [user, setUser] = useState(null); // Initialize user state with null

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user); // Update user state when authentication state changes
    });

    return () => unsubscribe();
  }, []);

  const sendInfo = async () => {
    if (!user) {
      Alert.alert("Not logged in", "Please log in before sending information.");
      return;
    }

    if (email.trim() === "" || info.trim() === "") {
      Alert.alert("Missing Information", "Please fill in all the fields.");
      return;
    }

    try {
      await sendEmailAndDoubtFromUserToAdmin(user, email, info);
      setEmail("");
      setInfo("");
      Alert.alert(
        "Information Sent",
        "Your information has been sent to the admin."
      );
    } catch (error) {
      console.error("Error sending information:", error);
      Alert.alert(
        "Error",
        "Failed to send information. Please try again later."
      );
    }
  };

  const handlleGoBack = () => {
    navigation.goBack();
  };

  const handleSubmitEdditing = () => {
    Keyboard.dismiss();
  };

  return (
      <View
        style={[
          styles.viewContainer,
          { backgroundColor: theme.backgroundColor },
        ]}
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
                titleText={t("contact")}
                onPress={handlleGoBack}
              />
              <View style={{ margin: 20 }} />

              <TextInput
                style={[
                  styles.mainPlaceholder,
                  { backgroundColor: theme.secondaryColor, color: theme.color },
                ]}
                placeholder="Email"
                placeholderTextColor={theme.color05}
                onChangeText={(text) => setEmail(text)}
                value={email}
              />
              <View style={{ margin: 20 }} />
              <TextInput
                style={[
                  styles.mainPlaceholder,
                  {
                    backgroundColor: theme.secondaryColor,
                    color: theme.color,
                    justifyContent: "center",
                    height: 200,
                    paddingTop: 20,
                  },
                ]}
                placeholder={t("doubt")}
                numberOfLines={4}
                placeholderTextColor={theme.color05}
                onChangeText={(text) => setInfo(text)}
                value={info}
                multiline={true}
              />
              <View style={{ margin: 20 }} />

              <View
                style={{ width: "100%", position: "absolute", bottom: -30 }}
              >
                <PrimaryButton
                  buttonText={t("send")}
                  onPress={sendInfo}
                  color={theme.color}
                  backgroundColor={theme.primaryColor}
                />
              </View>
            </View>
          </View>
        </SafeAreaView>
      </View>
  );
};

export default ContactForm;
