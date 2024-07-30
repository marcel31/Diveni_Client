import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import styles from "../styles/Styles";
import themeContext from "../theme/ThemeContext";
import { useNavigation } from "@react-navigation/native";
import {
  auth,
  getUserProfile,
  subscribeToUserProfile,
} from "../backend/FirebaseConnection";
import PrimaryButton from "./components/PrimaryButton";
import ExpProgressBar from "./components/ExpProgressBar";
import { Entypo, AntDesign } from "@expo/vector-icons";
import PopupSettings from "./components/PopupSettings";
import CrownCounter from "./components/CrownCounter";
import { LinearGradient } from "expo-linear-gradient";
import { useTranslation } from "react-i18next";
import { FontAwesome5 } from "@expo/vector-icons";

function Profile() {
  const { t } = useTranslation();
  const theme = useContext(themeContext);
  const [user, setUser] = useState(auth.currentUser);
  const [userProfile, setUserProfile] = useState(null);
  const navigation = useNavigation();
  const [showPopup, setShowPopup] = useState(false);

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

    const unsubscribe = subscribeToUserProfile(user.uid, (profile) => {
      setUserProfile(profile);
    });

    return () => unsubscribe();
  }, [user]);

  const togglePopup = () => setShowPopup(!showPopup);

  const handleNavigationStatistics = () =>
    navigation.navigate("Statistics", { userId: user.uid });

  const handleNavigationGameHistory = () =>
    navigation.navigate("GameHistory", { userId: user.uid });

  const handleEditProfile = () =>
    navigation.navigate("EditProfile", { userProfile });

  const friendsCount = userProfile?.friends
    ? Object.keys(userProfile.friends).length
    : 0;

  // Función para calcular la experiencia necesaria para el próximo nivel
  const calculateExperienceForNextLevel = (level) => {
    let baseExp = 10;
    for (let i = 1; i < level; i++) {
      baseExp *= 1.1;
    }
    return Math.round(baseExp);
  };

  var necessaryExp = calculateExperienceForNextLevel(userProfile?.level);
  
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

  return (
    <SafeAreaView
      style={[styles.safeAreaView, { backgroundColor: theme.backgroundColor }]}
    >
      <View style={[styles.center]}>
        <View style={[styles.appProfileView]}>
          <ScrollView
            style={[
              styles.viewContainer,
              { backgroundColor: theme.backgroundColor },
            ]}
          >
            <View style={{ height: 300 }}>
              <Image
                source={{
                  uri:
                    userProfile?.photoURL ||
                    "https://www.kindpng.com/picc/m/78-785827_user-profile-avatar-login-account",
                }}
                style={{ flex: 1 }}
              />
              <LinearGradient
                style={{
                  position: "absolute",
                  top: 60,
                  right: 16,
                  borderRadius: 20,
                  width: 32,
                  height: 32,
                  justifyContent: "center",
                  alignItems: "center",
                }}
                colors={["rgba(0, 0, 0, 0.2)", "rgba(0, 0, 0, 0.2)"]}
              >
                <TouchableOpacity title="Open Settings" onPress={togglePopup}>
                  <Entypo name="cog" size={24} color="white" />
                </TouchableOpacity>
              </LinearGradient>
              <LinearGradient
                colors={[
                  "rgba(0, 0, 0, 0)",
                  "rgba(0, 0, 0, 0.3)",
                  "rgba(0, 0, 0, 0.5)",
                ]}
                style={{
                  position: "absolute",
                  bottom: 0,
                  padding: 10,
                  width: "100%",
                  flex: 1,
                }}
              >
                <Text
                  style={{
                    fontFamily: "SpaceGrotesk-Bold",
                    fontSize: 48,
                    color: "#EDE6EF",
                  }}
                >
                  {userProfile?.displayName || "guest"}
                </Text>
              </LinearGradient>
              <TouchableOpacity
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 100,
                  backgroundColor: "#885B95",
                  position: "absolute",
                  top: 270,
                  right: 16,
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onPress={handleEditProfile}
              >
                <FontAwesome5 name="user-edit" size={24} color="white" />
              </TouchableOpacity>
            </View>
            <View style={{ margin: 10 }}></View>
            <SafeAreaView
              style={[
                styles.safeAreaView,
                { backgroundColor: theme.backgroundColor },
              ]}
            >
              <View style={[styles.center]}>
                <View style={[styles.appProfileButtonsView]}>
                  <View>
                    <Text
                      style={{
                        fontFamily: "SpaceGrotesk-Bold",
                        fontSize: 15,
                        color: theme.color,
                      }}
                    >
                      {t("friends")}
                    </Text>
                    <Text style={[styles.someText2, { color: theme.color }]}>
                      {friendsCount}
                    </Text>
                  </View>
                  {showPopup && <PopupSettings onClose={togglePopup} />}
                  <View style={{ margin: 10 }}></View>
                  <Text
                    style={{
                      fontFamily: "SpaceGrotesk-Bold",
                      fontSize: 15,
                      marginBottom: 10,
                      color: theme.color,
                    }}
                  >
                    {t("crowns")}
                  </Text>
                  <CrownCounter
                    borderColor={theme.primaryColor}
                    color={theme.primaryColor}
                    crownCount={userProfile?.crowns || 0}
                  />
                  <View style={{ margin: 10 }}></View>
                  <View
                    style={{
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
                  <View style={{ margin: 20 }}></View>
                  <PrimaryButton
                    buttonText={t("statistics")}
                    onPress={handleNavigationStatistics}
                    backgroundColor={theme.primaryColor}
                  />
                  <View style={{ margin: 10 }}></View>
                  <PrimaryButton
                    buttonText={t("gameHistory")}
                    onPress={handleNavigationGameHistory}
                    backgroundColor={theme.primaryColor}
                  />
                </View>
              </View>
            </SafeAreaView>
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
}
export default Profile;
