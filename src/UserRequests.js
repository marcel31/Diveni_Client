import React, { useContext, useEffect, useState } from "react";
import { View, Text, SafeAreaView, TouchableOpacity } from "react-native";
import styles from "../styles/Styles";
import themeContext from "../theme/ThemeContext";
import TopNavigationBar from "./components/TopNavigationBar";
import { useNavigation } from "@react-navigation/native";
import {
  auth,
  getUserProfile,
  subscribeToUserProfile,
} from "../backend/FirebaseConnection";
import { useTranslation } from "react-i18next";

function UserRequests() {
  const { t } = useTranslation();
  const theme = useContext(themeContext);
  const navigation = useNavigation();
  const [user, setUser] = useState(auth.currentUser);
  const [userProfile, setUserProfile] = useState(null);

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

  console.log(userProfile);

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
              titleText="Admin Manager"
              onPress={() => navigation.goBack()}
            />
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-around",
                marginBottom: 20,
                marginTop: 10,
              }}
            >
              <TouchableOpacity
                onPress={() => navigation.navigate("AdminManager")}
              >
                <Text
                  style={[
                    styles.someText,
                    { color: "grey", textAlign: "center", marginTop: 10 },
                  ]}
                >
                  {t("userMan")}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => navigation.navigate("AdminManagerSearches")}
              >
                <Text
                  style={[
                    styles.someText,
                    { color: "grey", textAlign: "center", marginTop: 10 },
                  ]}
                >
                  {t("searches")}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => navigation.navigate("UserRequests")}
              >
                <Text
                  style={[
                    styles.someText,
                    {
                      color: theme.textColor,
                      textAlign: "center",
                      marginTop: 10,
                    },
                  ]}
                >
                  {t("userReq")}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={{ marginTop: 20 }}>
              {userProfile && userProfile.doubts && (
                <View style={{ marginLeft: 20 }}>
                  {Object.entries(userProfile.doubts).map(([key, value]) => (
                    <View
                      key={key}
                      style={{ flexDirection: "row", marginBottom: 25 }}
                    >
                      <Text
                        style={[
                          styles.someText,
                          { color: theme.primaryColor, fontSize: 16.3 },
                        ]}
                      >{`${key}: `}</Text>
                      <Text
                        style={[
                          styles.someText,
                          { color: theme.textColor, fontSize: 16.3 },
                        ]}
                      >
                        {value}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

export default UserRequests;
