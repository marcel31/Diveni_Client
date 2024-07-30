import React, { useState, useContext, useEffect } from "react";
import {
  View,
  SafeAreaView,
  Keyboard,
  FlatList,
  Text,
  ScrollView,
} from "react-native";
import { EventRegister } from "react-native-event-listeners";
import { Feather } from "@expo/vector-icons";
import {
  auth,
  getAllUsers,
  getUserProfile,
  getUsersThatAreFriends,
  subscribeToAllUsers,
  subscribeToFriendsUsers,
} from "../backend/FirebaseConnection";
import styles from "../styles/Styles";
import themeContext from "../theme/ThemeContext";
import SearchBar from "./components/SearchBar";
import PopupMenu from "./components/PopupMenu";
import SocialItem from "./components/SocialItem";
import { useTranslation } from "react-i18next";

function Social() {
  const { t } = useTranslation();
  const [userProfile, setUserProfile] = useState(null);
  const [user, setUser] = useState(auth.currentUser);
  const theme = useContext(themeContext);
  const [query, setQuery] = useState("");
  const [searchBarFocused, setSearchBarFocused] = useState(false);
  const [searchBarWidth, setSearchBarWidth] = useState("100%");
  const [allUsers, setAllUsers] = useState([]);
  const [friendsUsers, setFriendsUsers] = useState([]);
  const [selectedOption, setSelectedOption] = useState("Global");

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const users = await getAllUsers();
        const sortedUsers = users.sort(orderByCrownCount);
        setAllUsers(sortedUsers);
      } catch (error) {
        console.log("Error fetching users: ", error);
      }
    };

    fetchAllUsers();
    const unsubscribe = subscribeToAllUsers((users) => {
      const sortedUsers = users.sort(orderByCrownCount);
      setAllUsers(sortedUsers);
    });

    return () => unsubscribe();
  }, []);

  //TODO
  useEffect(() => {
    const fetchFriendsOfUser = async () => {
      if (user) {
        try {
          const profile = await getUserProfile(user.uid);
          setUserProfile(profile);
          const friends = await getUsersThatAreFriends(profile);
          setFriendsUsers(friends);
        } catch (error) {
          console.log("Error: ", error);
        }
      } else {
        setUserProfile(null);
      }
    };

    fetchFriendsOfUser();
    const unsubscribe = subscribeToFriendsUsers(user, (friends) => {
      setFriendsUsers(friends);
    });

    return () => unsubscribe();
  }, [user]);

  const handleSearch = (query) => setQuery(query);
  const onFocus = () => {
    setSearchBarWidth("80%");
    setSearchBarFocused(true);
  };
  const handleBlur = () => {
    //setSearchBarFocused(false);
    setSearchBarWidth("100%");
  };
  const handleCancel = () => {
    console.log("Cancelando búsqueda");
    setQuery("");
    setSearchBarFocused(false);
    setSearchBarWidth("100%");
    Keyboard.dismiss();
    console.log(query);
  };

  const orderByCrownCount = (a, b) => b.crowns - a.crowns;

  const filteredNames = query
    ? allUsers.filter((user) =>
        user.displayName.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return (
    <View
      style={[styles.viewContainer, { backgroundColor: theme.backgroundColor }]}
    >
        <ScrollView>
      <SafeAreaView
        style={[
          styles.safeAreaView,
          { backgroundColor: theme.backgroundColor },
        ]}
      >
        <View style={[styles.center]}>
          <View style={[styles.appView]}>
            <SearchBar
              searchBarWidth={searchBarWidth}
              onChangeText={handleSearch}
              value={query}
              placeholder={t("search")}
              imageComponent={
                <Feather
                  name="search"
                  style={[{ color: theme.color }, { fontSize: 18 }]}
                />
              }
              onFocus={onFocus}
              onBlur={handleBlur}
              onCancel={handleCancel}
              showCancelButton={searchBarFocused}
            />
              {!searchBarFocused ? (
                <>
                  <PopupMenu
                    option1="Global"
                    option2={t("friends")}
                    onSelect={(option) => {
                      setSelectedOption(option);
                    }}
                  />
                  {selectedOption === "Global" ? (
                    <FlatList
                      data={allUsers}
                      renderItem={({ item }) => (
                        <SocialItem
                          name={item.displayName}
                          touchable={true}
                          imageURL={
                            item.photoURL ||
                            "https://images.ctfassets.net/h6goo9gw1hh6/2sNZtFAWOdP1lmQ33VwRN3/24e953b920a9cd0ff2e1d587742a2472/1-intro-photo-final.jpg?w=1200&h=992&fl=progressive&q=70&fm=jpg"
                          }
                          crownCount={item.crowns}
                          user={item}
                        />
                      )}
                      keyExtractor={(item, index) =>
                        item.id || index.toString()
                      }
                    />
                  ) : (
                    <FlatList
                      data={friendsUsers}
                      renderItem={({ item }) => (
                        <SocialItem
                          name={item.displayName}
                          touchable={true}
                          imageURL={
                            item.photoURL ||
                            "https://images.ctfassets.net/h6goo9gw1hh6/2sNZtFAWOdP1lmQ33VwRN3/24e953b920a9cd0ff2e1d587742a2472/1-intro-photo-final.jpg?w=1200&h=992&fl=progressive&q=70&fm=jpg"
                          }
                          crownCount={item.crowns}
                          user={item}
                        />
                      )}
                      keyExtractor={(item, index) =>
                        item.id || index.toString()
                      }
                    />
                  )}
                </>
              ) : (
                <FlatList
                  data={filteredNames}
                  renderItem={({ item }) => (
                    <SocialItem
                      name={item.displayName}
                      touchable={true}
                      imageURL={
                        item.photoURL ||
                        "https://images.ctfassets.net/h6goo9gw1hh6/2sNZtFAWOdP1lmQ33VwRN3/24e953b920a9cd0ff2e1d587742a2472/1-intro-photo-final.jpg?w=1200&h=992&fl=progressive&q=70&fm=jpg"
                      }
                      crownCount={item.crowns}
                      user={item}
                    />
                  )}
                  keyExtractor={(item, index) => item.id || index.toString()}
                  style={{ marginTop: 10 }}
                />
              )}
          </View>
        </View>
      </SafeAreaView>
      </ScrollView>
    </View>
  );
}

export default Social;
