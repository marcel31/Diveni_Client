import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import {
  auth,
  getUserProfile,
  subscribeToUserProfile,
  countNumberOfFriendRequestsFromUser,
  subscribeToFriendRequestsCount,
} from "../backend/FirebaseConnection";
import styles from "../styles/Styles";
import themeContext from "../theme/ThemeContext";
import { useNavigation } from "@react-navigation/native";
import EntryGameButton from "./components/EntryGameButton";
import CrownCounter from "./components/CrownCounter";
import PopupSingleplayer from "./components/PopupSingleplayer";
import PopupMultiplayer from "./components/PopupMultiplayer";
import { Feather } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { socket } from "./components/socket";

function Play() {
     const { t } = useTranslation();

  const [showPopupSingle, setShowPopupSingle] = useState(false);
  const [showPopupMulti, setShowPopupMulti] = useState(false);
  const [numberFR, setNumberFR] = useState(0);
  const [friendRequestSent, setFriendRequestSent] = useState(false);

  const togglePopupSingle = () => {
    setShowPopupSingle(!showPopupSingle);
  };

  const togglePopupMulti = () => {
    setShowPopupMulti(!showPopupMulti);
  };

  const theme = useContext(themeContext);

  const [userProfile, setUserProfile] = useState(null);
  const [user, setUser] = useState(auth.currentUser);

  const navigation = useNavigation();

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

    const unsubscribeUserProfile = subscribeToUserProfile(user.uid, (profile) => {
        setUserProfile(profile);
    });

    const unsubscribeFriendRequests = subscribeToFriendRequestsCount(user, setNumberFR);

    numbere();

    return () => {
        unsubscribeUserProfile();
        unsubscribeFriendRequests();
    };
}, [user]);

    const handleNavigateFriendRequests = () => {
        navigation.navigate("FriendRequests");
    };

    const handleNavigateSinglePlayer = () => {
        socket.emit('createRoom', user);
        socket.on('createRoom', (code) => {
            socket.emit("startGame", (code));
        });
        navigation.navigate("ChooseType");
    };

    const numbere = async () => {
        const number = await countNumberOfFriendRequestsFromUser(user);
        const parsedNumber = parseInt(number);
        if (!isNaN(parsedNumber)) {
            setNumberFR(parsedNumber);
            console.log(parsedNumber)
        } else {
            console.log("Error: El número de solicitudes de amistad no es válido");
        }
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
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                margin: 10,
              }}
            >
              <CrownCounter
                borderColor={theme.primaryColor}
                color={theme.primaryColor}
                crownCount={userProfile?.crowns || "0"}
              />
              <TouchableOpacity
                onPress={handleNavigateFriendRequests}
                style={{ display: "flex", justifyContent: "center" }}
              >
                <Feather name="bell" size={30} color={theme.color} />
                {numberFR > 0 && (
                  <View
                    style={{
                      width: 25,
                      height: 25,
                      backgroundColor: "red",
                      borderRadius: 9999,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      position: "absolute",
                      top: 20,
                      right: 20,
                    }}
                  >
                    <Text
                      style={[
                        styles.someText2,
                        { color: "white", fontSize: 16 },
                      ]}
                    >
                      {numberFR}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
            <View style={{ margin: 40 }} />
            <Text style={[styles.titlePlay, { color: theme.color }]}>
              Diveni
            </Text>
            <View style={{ marginTop: 50 }}>
              {showPopupSingle && (
                <PopupSingleplayer onClose={togglePopupSingle} />
              )}
              {showPopupMulti && (
                <PopupMultiplayer onClose={togglePopupMulti} />
              )}
              <EntryGameButton
                buttonText={t("singleplayer")}
                onPress={handleNavigateSinglePlayer}
                color={theme.color}
                backgroundColor={theme.primaryColor}
              />
              <View style={{ margin: 25 }} />
              <EntryGameButton
                buttonText={t("multiplayer")}
                onPress={togglePopupMulti}
                color={theme.color}
                backgroundColor={theme.primaryColor}
              />
            </View>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

export default Play;
