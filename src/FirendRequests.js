import React, { useContext, useState, useEffect } from "react";
import { View, Text, SafeAreaView, FlatList, TouchableOpacity } from "react-native";
import styles from "../styles/Styles";
import themeContext from "../theme/ThemeContext";
import { auth, getUserProfile, acceptFriendRequest, getUsersFromFriendsRequests, declineFriendRequest, subscribeToFriendRequests } from "../backend/FirebaseConnection";
import TopNavigationBar from "./components/TopNavigationBar";
import { useNavigation } from "@react-navigation/native";
import UsersFromFriendsRequests from "./components/UserFromFriendsRequests";
import { useTranslation } from 'react-i18next';

function FriendRequests() {
  const { t } = useTranslation();

  const theme = useContext(themeContext);
  const [userProfile, setUserProfile] = useState(null);
  const [user, setUser] = useState(auth.currentUser);
  const [friendsRequests, setFriendsRequests] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = subscribeToFriendRequests(user, setFriendsRequests);
    return () => {
      unsubscribe();
    };
  }, [user]);

  useEffect(() => {
    const fetchFriendsRequestsOfUser = async () => {
      if (user) {
        try {
          const profile = await getUserProfile(user.uid);
          setUserProfile(profile);
          const friendsRequests = await getUsersFromFriendsRequests(profile);
          setFriendsRequests(friendsRequests);
        } catch (error) {
          console.log("Error: ", error);
        }
      } else {
        setUserProfile(null);
      }
    };

    fetchFriendsRequestsOfUser();
  }, [user]);

  const handleAcceptFriendRequest = async (friendUid) => {
    try {
      await acceptFriendRequest(userProfile, friendUid);
    } catch (error) {
      console.log("Error accepting friend request: ", error);
    }
  };

  const handleDeclineFriendRequest = async (friendUid) => {
    try {
      await declineFriendRequest(userProfile, friendUid);
    } catch (error) {
      console.log("Error declining friend request: ", error);
    }
  };

  const handleNavigatePlay = () => {
    navigation.navigate("BottomTabs", { screen: "Play" });
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
              titleText={t("friendRequests")}
              onPress={handleNavigatePlay}
            />
            <View style={{ margin: 20 }} />
            <FlatList
              data={friendsRequests}
              renderItem={({ item }) => (
                <UsersFromFriendsRequests
                  name={item.displayName}
                  imageURL={
                    item.photoURL ||
                    "https://i.pinimg.com/564x/9e/fb/81/9efb81966bb3eb79450d89cbd9825ccf.jpg"
                  }
                  user={item}
                  touchable={true}
                  onPressAccept={() => handleAcceptFriendRequest(item.uid)}
                  onPressDecline={() => handleDeclineFriendRequest(item.uid)}
                />
              )}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

export default FriendRequests;
