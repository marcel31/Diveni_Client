import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
} from "react-native";
import styles from "../styles/Styles";
import themeContext from "../theme/ThemeContext";
import { useNavigation } from "@react-navigation/native";
import {
  getUserProfile,
  sendFriendRequest,
  auth,
  subscribeToUserProfile,
  isUserFriendRequestSent,
  isUserFriend,
  undueFriend,
  deleteFriend,
} from "../backend/FirebaseConnection";
import PrimaryButton from "./components/PrimaryButton";
import CrownCounter from "./components/CrownCounter";
import { LinearGradient } from "expo-linear-gradient";
import ExpProgressBar from "./components/ExpProgressBar";
import { Feather } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { FontAwesome5 } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";

const OtherUserProfile = ({ route }) => {
    const { t } = useTranslation();
    const navigation = useNavigation();
    const [loggedUser, setLoggedUser] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const { user } = route.params;
    const theme = useContext(themeContext);
    const [friendRequestSent, setFriendRequestSent] = useState(false);
    const [isFriend, setIsFriend] = useState(false);
    const [isFriendRequestSent, setIsFriendRequestSent] = useState(false);

    console.log("user: ", user);
    console.log("LoggedUser: ", loggedUser);
    console.log("userProfile: ", userProfile);

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (user) {
                try {
                    const profile = await getUserProfile(user.uid);
                    setUserProfile(profile);
                } catch (error) {
                    console.log("Error fetching user profile: ", error);
                }
            }
        };

        fetchUserProfile();

        const unsubscribe = subscribeToUserProfile(user.uid, (profile) => {
            setUserProfile(profile);
        });
        return () => unsubscribe();
    }, [user]);

    useEffect(() => {
        const fetchLoggedUserProfile = async () => {
            try {
                const user = await getUserProfile(auth.currentUser.uid);
                setLoggedUser(user);
            } catch (error) {
                console.log("Error fetching logged user profile: ", error);
            }
        };
        fetchLoggedUserProfile();

        const unsubscribe = subscribeToUserProfile(auth.currentUser.uid, (profile) => {
            setLoggedUser(profile);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (userProfile) {
            isUserAFriend();
            isUserAFriendRequestSent();
        }
    }, [userProfile]);
  
    const handleNavigationStatistics = () => {
        navigation.navigate('Statistics', { userId: user.uid });
    }

    const handleNavigationGameHistory = () => {
        navigation.navigate('GameHistory', { userId: user.uid });
    }

    function handleNavigationSocial() {
        navigation.goBack();
    }

    const friendsCount = userProfile?.friends ? Object.keys(userProfile.friends).length : 0;

    function calculateExperienceForNextLevel(level) {
        let baseExp = 10;
        for (let i = 1; i < level; i++) {
            baseExp *= 1.1;
        }
        return Math.round(baseExp);
    }

    if (user && user.level !== undefined) {
        var necessaryExp = calculateExperienceForNextLevel(user?.level);
    } else {
        var necessaryExp = 0;
    }

    const handleSendFriendRequest = async () => {
      if (!user || !loggedUser || user.uid === loggedUser.uid) {
        return;
      }

      try {
          await sendFriendRequest(loggedUser, user);
          setFriendRequestSent(true);
      } catch (error) {
          console.log("Error sending friend request: ", error);
      }
    }

    const isUserAFriend = async () => {
        try {
            const isFriend = await isUserFriend(loggedUser, user);
            setIsFriend(isFriend);
        } catch (error) {
            console.log("Error checking if user is a friend: ", error);
        }
    }
    

    const isUserAFriendRequestSent = async () => {
        try {
            const isFriendRequestSent = await isUserFriendRequestSent(loggedUser, user);
            setIsFriendRequestSent(isFriendRequestSent);
        } catch (error) {
            console.log("Error checking if user is a friend: ", error);
        }
    }

    const undueFriends = async () => {
        try {
            await deleteFriend(loggedUser, user.uid);
            setIsFriend(false);
        }
        catch (error) {
            console.log("Error deleting friend: ", error);
        }
    }
    
  return (
    <View
      style={[styles.viewContainer, { backgroundColor: theme.backgroundColor }]}
    >
      <View style={[styles.center]}>
        <View style={[styles.appProfileView]}>
          <View style={{ height: 300 }}>
            <Image
              source={{
                uri:
                  userProfile?.photoURL ||
                  "https://media.color-register.org/color-hex-C8DBD1-3840-2160-wallpaper.png",
              }}
              style={{ flex: 1 }}
            />

            <View
              style={{
                position: "absolute",
                top: 60,
                left: 10,
                width: "100%",
              }}
            >
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  width: "100%",
                }}
              >
                <LinearGradient
                  style={{
                    borderRadius: 20,
                    width: 32,
                    height: 32,
                    position: "absolute",
                    left: 10,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  colors={["rgba(0, 0, 0, 0.2)", "rgba(0, 0, 0, 0.2)"]}
                >
                  <AntDesign
                    name="caretleft"
                    onPress={handleNavigationSocial}
                    size={24}
                    style={{
                      color: "white",
                      zIndex: 999,
                      position: "absolute",
                    }}
                  />
                </LinearGradient>

                {/* Modificación para centrar el segundo LinearGradient */}
                <LinearGradient
                  style={{
                    borderRadius: 20,
                    position: "absolute",
                    height: 32,
                    left: "50%", // Centra horizontalmente
                    transform: [{ translateX: -50 }], // Ajusta para centrar correctamente

                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  colors={["rgba(0, 0, 0, 0.2)", "rgba(0, 0, 0, 0.2)"]}
                >
                  <Text
                    style={[
                      styles.titleTextNavBar,
                      { color: "white", paddingLeft: 15, paddingRight: 15 },
                    ]}
                  >
                    {t("profile")}
                  </Text>
                </LinearGradient>
              </View>
            </View>
            <LinearGradient
              colors={["rgba(0, 0, 0, 0)", "rgba(0, 0, 0, 0.8)"]}
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
              onPress={isFriend ? () => {} : handleSendFriendRequest}
            >
              {isFriend ? (
                <FontAwesome5 name="user-friends" size={24} color="white" /> // Usuario amigo
              ) : friendRequestSent ? (
                <AntDesign name="clockcircle" size={24} color="white" /> // Solicitud de amistad enviada
              ) : (
                <FontAwesome name="user-plus" size={24} color="white" /> // Default
              )}
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
                    {t("level")} {user?.level || 0}
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
                  color={theme.color}
                  backgroundColor={theme.primaryColor}
                  onPress={handleNavigationStatistics}
                />
                <View style={{ margin: 20 }} />
                <PrimaryButton
                  buttonText={t("gameHistory")}
                  color={theme.color}
                  backgroundColor={theme.primaryColor}
                  onPress={handleNavigationGameHistory}
                />
              </View>
            </View>
          </SafeAreaView>
        </View>
      </View>
    </View>
  );
};

export default OtherUserProfile;
