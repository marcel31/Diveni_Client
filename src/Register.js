import React, { useContext, useEffect } from "react";
import { View, Text, SafeAreaView, TextInput } from "react-native";
import styles from "../styles/Styles";
import themeContext from "../theme/ThemeContext";
import { useNavigation } from "@react-navigation/native";
import PrimaryButton from "./components/PrimaryButton";
import GoogleButton from "./components/GoogleButton";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import {
  auth,
  createUserDocument,
  auth as firebaseAuth,
  provider,
} from "../backend/FirebaseConnection";
import TopNavigationBar from "./components/TopNavigationBar";
import InfoPsswd from "./components/InfoPsswd";
import { useTranslation } from "react-i18next";
import { socket } from "./components/socket";

function Register() {
  const { t } = useTranslation();
  const theme = useContext(themeContext);
  const [confirmPassword, setConfirmPassword] = React.useState(null);
  const navigation = useNavigation();

  const loginGoogle = async () => {
    try {
      socket.connect();
      const result = await signInWithPopup(auth, provider);
      const user = {
        uid: result.user.uid,
        email: result.user.email,
      };

      const additionalData = {
        displayName: result.user.displayName,
        photoURL: result.user.photoURL,
      };
      await createUserDocument(user, additionalData);
      socket.emit("auth", await auth.currentUser.getIdToken());
      navigation.navigate("BottomTabs", { screen: "PlayTab" });
    } catch (error) {
      console.error("Error al iniciar sesión con Google:", error);
      throw error;
    }
  };

  const handleNavigationHome = () => {
    navigation.navigate("Home");
  };

  const handleNavigationSignIn = () => {
    navigation.navigate("SignIn");
  };

  const [email, onChangeEmail] = React.useState(null);
  const [password, onChangePassword] = React.useState(null);
  const [displayName, onChangeDisplayName] = React.useState(null);
  const [randomImage, setRandomImage] = React.useState(null);

  useEffect(() => {
    fetchRandomImage();
  }, []);

  const fetchRandomImage = async () => {
    try {
      const randomQuery = Math.random().toString(36).substring(7);
      const response = await fetch(`https://picsum.photos/200?${randomQuery}`);
      const imageURL = response.url;
      setRandomImage(imageURL);
      console.log("Random image: ", imageURL);
    } catch (error) {
      console.log("Error fetching random image: ", error);
    }
  };

  const handleCreateAccount = async () => {
    try {
      if (password !== confirmPassword) {
        alert(t("psswdNotMatch"));
        return;
      }
      socket.connect();
      const userCredential = await createUserWithEmailAndPassword(
        firebaseAuth,
        email,
        password
      );
      const user = userCredential.user;

      await createUserDocument(user, { displayName, photoURL: randomImage });
      socket.emit("auth", await auth.currentUser.getIdToken());
      alert(t("accCreated"));
      navigation.navigate("BottomTabs", { screen: "PlayTab" });
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log("Error: ", errorCode, errorMessage);
      alert(errorMessage);
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
              titleText={t("register")}
              onPress={handleNavigationHome}
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
              placeholder={t("username")}
              placeholderTextColor={theme.color}
              onChangeText={(text) => onChangeDisplayName(text)}
              value={displayName}
            />
            <View style={{ margin: 10 }} />
            <TextInput
              style={[
                styles.mainPlaceholder,
                { backgroundColor: theme.secondaryColor, color: theme.color },
              ]}
              placeholder={t("email")}
              placeholderTextColor={theme.color}
              onChangeText={(text) => onChangeEmail(text)}
              value={email}
            />
            <View style={{ margin: 10 }} />
            <TextInput
              style={[
                styles.mainPlaceholder,
                { backgroundColor: theme.secondaryColor, color: theme.color },
              ]}
              placeholder={t("pswd")}
              placeholderTextColor={theme.color}
              secureTextEntry={true}
              onChangeText={(text) => onChangePassword(text)}
              value={password}
            />
            <View style={styles.InfoPsswdContainer}>
              {/* Otros campos del formulario */}
              <InfoPsswd />
              {/* Más campos del formulario */}
            </View>
            <View style={{ margin: 2.5 }} />
            <TextInput
              style={[
                styles.mainPlaceholder,
                { backgroundColor: theme.secondaryColor, color: theme.color },
              ]}
              placeholder={t("confPswd")}
              placeholderTextColor={theme.color}
              secureTextEntry={true}
              onChangeText={(text) => setConfirmPassword(text)}
              value={confirmPassword}
            />
            <View style={{ margin: 20 }} />
            <PrimaryButton
              buttonText={t("register")}
              color={theme.color}
              backgroundColor={theme.primaryColor}
              onPress={handleCreateAccount}
            />
            <View style={{ margin: 10 }} />
            <GoogleButton onPress={loginGoogle}></GoogleButton>
            <View style={{ width: "100%", position: "absolute", bottom: -110 }}>
              <Text style={[styles.someText, { color: theme.color }]}>
                {t("noAcc")}
              </Text>
              <View style={{ margin: 10 }} />
              <PrimaryButton
                buttonText={t("signIn")}
                color={theme.color}
                backgroundColor={theme.accentColor}
                onPress={handleNavigationSignIn}
              />
            </View>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

export default Register;
