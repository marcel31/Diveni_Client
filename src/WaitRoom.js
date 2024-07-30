import React, { useState, useContext, useEffect } from "react";
import { View, SafeAreaView, Keyboard, FlatList, Text } from "react-native";
import {
    auth,
    getAllUsers,
    getUserProfile,
} from "../backend/FirebaseConnection";
import styles from "../styles/Styles";
import themeContext from "../theme/ThemeContext";
import SocialItem from "./components/SocialItem";
import TopNavigationBar from "./components/TopNavigationBar";
import { useNavigation, useRoute } from "@react-navigation/native";
import { socket } from "./components/socket";
import PrimaryButton from "./components/PrimaryButton";
import { useTranslation } from "react-i18next";

function WaitRoom() {
    const { t } = useTranslation();
    const route = useRoute();
    const { isCreator } = route.params;
    const { inviteCode } = route.params;
    const [user, setUser] = useState(auth.currentUser);
    const [roomCode, setRoomCode] = useState("");
    const theme = useContext(themeContext);
    const [query, setQuery] = useState("");
    const [allUsers, setAllUsers] = useState([]);
    const navigation = useNavigation();

    useEffect(() => {
        const getRoomCode = async () => {
            if (isCreator) {
                try {
                    //console.log("Creator: "+inviteCode);
                    socket.emit("createRoom", user);
                    socket.on("createRoom", (code) => {
                        setRoomCode(code);
                    });
                } catch (error) {º
                    console.log("Error creating code: ", error);
                }
            } else {
                //console.log("Joined "+inviteCode);

                setRoomCode(inviteCode);
            }
        };
        getRoomCode();
    }, []);

    socket.on("playerJoined", async (playerList) => {
        const players = [];
        //console.log(playerList)
        for (let index = 0; index < playerList.length; index++) {
            //console.log(playerList[index].uuid);
            players.push(await getUserProfile(playerList[index].uuid));
            //console.log(players.length)
            //console.log(playerList.length)
            if (players.length === playerList.length) {
                //console.log(players)
                setAllUsers(players);
                //console.log(allUsers);
            }
        }
        //console.log(players)
    });

    const handleNavigationPlay = () => {
        navigation.navigate("BottomTabs", { screen: "PlayTab" });
    };

    const handleNavigationGame = () => {
        socket.emit("startGame", roomCode);
    };

    socket.on("startGame", async () => {
        navigation.navigate("ChooseType");
    });

    const handleSearch = (query) => setQuery(query);
    const onFocus = () => {
        setSearchBarWidth("80%");
        setSearchBarFocused(true);
    };
    const handleBlur = () => {
        setSearchBarFocused(false);
        setSearchBarWidth("100%");
    };
    const handleCancel = () => {
        setSearchBarFocused(false);
        setSearchBarWidth("100%");
        Keyboard.dismiss();
        setQuery("");
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
            <SafeAreaView
                style={[
                    styles.safeAreaView,
                    { backgroundColor: theme.backgroundColor },
                ]}
            >
                <View style={[styles.center]}>
                    <View style={[styles.appView]}>
                        <TopNavigationBar
                            titleText={t("waitRoom")}
                            onPress={handleNavigationPlay}
                        />
                        <Text
                            style={[
                                styles.someText2,
                                { textAlign: "center", color: theme.color, padding: 15 },
                            ]}
                        >
                            {roomCode}
                        </Text>
                        {isCreator && (
                            <View style={{ width: "100%", paddingBottom: 20, paddingTop: 20 }}>
                                <PrimaryButton
                                    buttonText={t("play")}
                                    onPress={handleNavigationGame}
                                    color={theme.color}
                                    backgroundColor={theme.primaryColor}
                                />
                            </View>
                        )}
                        <FlatList
                            data={allUsers}
                            renderItem={({ item }) => (
                                <SocialItem
                                    name={item.displayName}
                                    imageURL={
                                        item.photoURL ||
                                        "https://images.ctfassets.net/h6goo9gw1hh6/2sNZtFAWOdP1lmQ33VwRN3/24e953b920a9cd0ff2e1d587742a2472/1-intro-photo-final.jpg?w=1200&h=992&fl=progressive&q=70&fm=jpg"
                                    }
                                    crownCount={item.crowns}
                                    user={item}
                                />
                            )}
                            keyExtractor={(item, index) => item.id || index.toString()}
                        />

                    </View>
                </View>
            </SafeAreaView>
        </View>
    );
}

export default WaitRoom;
