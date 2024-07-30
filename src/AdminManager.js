import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
} from "react-native";
import styles from "../styles/Styles";
import themeContext from "../theme/ThemeContext";
import { useNavigation } from "@react-navigation/native";
import {
  deleteUserFromAdmin,
  getAllUsers,
  subscribeToAllUsers,
} from "../backend/FirebaseConnection";
import SocialItem from "./components/SocialItem";
import AllUsers from "./components/AllUsers";
import { deleteUser } from "../backend/FirebaseConnection";
import TopNavigationBar from "./components/TopNavigationBar";
import { useTranslation } from "react-i18next";

function AdminManager() {
  const theme = useContext(themeContext);
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const users = await getAllUsers();
        setAllUsers(users);
      } catch (error) {
        console.log("Error fetching users: ", error);
      }
    };

    fetchAllUsers();

    const unsubscribe = subscribeToAllUsers((users) => {
      setAllUsers(users);
    });

    return () => unsubscribe();
  }, []);

  const handleDeleteUser = async (user) => {
    await deleteUserFromAdmin(user);
    const users = await getAllUsers();
    const sortedUsers = users.sort((a, b) =>
      a.displayName.localeCompare(b.displayName)
    );
    setAllUsers(sortedUsers);
  };

  const handleTest = (user) => {
    navigation.navigate("EditAdmin", { user });
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
                    {
                      color: theme.textColor,
                      textAlign: "center",
                      marginTop: 10,
                    },
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
                    { color: "grey", textAlign: "center", marginTop: 10 },
                  ]}
                >
                  {t("userReq")}
                </Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={allUsers}
              renderItem={({ item }) => (
                <AllUsers
                  name={item.displayName}
                  imageURL={
                    item.photoURL ||
                    "https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png"
                  }
                  user={item}
                  touchable={true}
                  onPress={() => handleDeleteUser(item)}
                  onPressEdit={() => handleTest(item)}
                />
              )}
              keyExtractor={(item) => item.uid}
            />
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

export default AdminManager;
