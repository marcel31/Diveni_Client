import React, { useState, useContext } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Switch,
  TextInput,
} from "react-native";
import { EventRegister } from "react-native-event-listeners";
import styles from "../styles/Styles";
import themeContext from "../theme/ThemeContext";
import { useNavigation } from "@react-navigation/native";
import PrimaryButton from "./components/PrimaryButton";
import GoogleButton from "./components/GoogleButton";
import TopNavigationBar from "./components/TopNavigationBar";
import {
  signInWithEmailAndPassword,
  getIdToken,
  signInWithPopup,
} from "firebase/auth";
import {
  auth,
  createUserDocument,
  provider,
  isUserAdmin,
  saveToken,
} from "../backend/FirebaseConnection";
import { socket } from "./components/socket";
import { useTranslation } from "react-i18next";

function SignIn() {
  const theme = useContext(themeContext);
  const [darkMode, setDarkMode] = useState(false);
  const navigation = useNavigation();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const { t } = useTranslation();

  const handleLogin = async () => {
    signInWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        if (user) {
          console.log("User logged in");
          EventRegister.emit("login", user);
          socket.connect();
          userCredential.user
            .getIdToken(/* forceRefresh */ true)
            .then(function (idToken) {
              socket.emit("auth", idToken);
            })
            .catch(function (error) {
              alert(error);
            });
          const userRole = await isUserAdmin(auth.currentUser);
          if (userRole) {
            navigation.navigate("AdminManager");
          } else {
            navigation.navigate("BottomTabs", { screen: "PlayTab" });
          }
        } else {
          alert("Error");
        }
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(errorMessage);
      });
  };

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
      await createUserDocument(user, additionalData)
      const userRole = await isUserAdmin(auth.currentUser);
      if (userRole) {
        navigation.navigate("AdminManager");
      } else {
        socket.emit('auth', await auth.currentUser.getIdToken());
        navigation.navigate("BottomTabs", { screen: "PlayTab" });
      }
    } catch (error) {
      console.error("Error al iniciar sesión con Google:", error);
      throw error;
    }
  };
  const handleNavigationRegister = () => {
    navigation.navigate('Register');
  }
  const handleNavigationHome = () => {
    navigation.navigate('Home');
  }
  const handleNavigationRecoveryEnterMail = () => {
    navigation.navigate("RecoveryEnterMail")
  }


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
              titleText={t("signIn")}
              onPress={handleNavigationHome}
            />

            <View style={{ margin: 10 }} />
            <Text style={[styles.someText, { color: theme.color }]}>
              {t("signWith")}
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
            <View style={{ margin: 10 }} />
            <TextInput
              style={[
                styles.mainPlaceholder,
                { backgroundColor: theme.secondaryColor, color: theme.color },
              ]}
              placeholder={t("pswd")}
              placeholderTextColor={theme.color}
              secureTextEntry={true}
              value={password}
              onChangeText={(text) => setPassword(text)}
            />
            <View style={{ margin: 5 }} />
            <TouchableOpacity
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                alignItems: "center",
              }}
              onPress={handleNavigationRecoveryEnterMail}
            >
              <Text style={[styles.someText, { color: theme.color }]}>
                {t("forgot")}
              </Text>
            </TouchableOpacity>
            <View style={{ margin: 20 }} />
            <PrimaryButton
              buttonText={t("login")}
              color={theme.color}
              backgroundColor={theme.primaryColor}
              onPress={handleLogin} /*TODO: ON PRESS LOGIN*/
            />
            <View style={{ margin: 20 }} />
            <Text style={[styles.someText, { color: theme.color }]}>
              {t("otherwiseSignIn")}
            </Text>
            <View style={{ margin: 10 }} />
            <GoogleButton onPress={loginGoogle} ></GoogleButton>

            <View style={{ margin: 10 }} />
            <View style={{ width: "100%", position: "absolute", bottom: -100 }}>
              <Text style={[styles.someText, { color: theme.color }]}>
                {t("noAcc")}
              </Text>
              <View style={{ margin: 10 }} />
              <PrimaryButton
                buttonText={t("register")}
                color={theme.color}
                backgroundColor={theme.accentColor}
                onPress={handleNavigationRegister}
              />
            </View>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

export default SignIn;
