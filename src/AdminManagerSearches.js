import React, { useContext, useState, useEffect } from "react";
import {
  View,
  SafeAreaView,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  ScrollView,
} from "react-native";
import styles from "../styles/Styles";
import themeContext from "../theme/ThemeContext";
import TopNavigationBar from "./components/TopNavigationBar";
import { useNavigation } from "@react-navigation/native";
import { auth } from "../backend/FirebaseConnection";
import { APP_URL } from "@env";
import { use } from "i18next";
import PrimaryButton from "./components/PrimaryButton";
import * as ImagePicker from "expo-image-picker";
import { dataURItoBlob } from "./utils/base64ToBlob";
import { useTranslation } from "react-i18next";

function AdminManagerSearches() {
  const theme = useContext(themeContext);
  const navigation = useNavigation();
  const { t } = useTranslation();
  const [term, setTerm] = useState("");
  const [searches, setSearches] = useState(0);
  const [error, setError] = useState("");
  const [searchesList, setSearchesList] = useState([]);
  const [page, setPage] = useState(1);
  const formData = new FormData();
  const [reload, setReload] = useState(false);

  const selectImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Accepta permisos");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      console.log(result);
      formData.append("image", dataURItoBlob(result.assets[0].uri));
      return;
    }
  };

  const handleAddSearches = async () => {
    formData.append("searches", searches);
    formData.append("term", term);
    const response = await fetch(APP_URL + "api/v1/searches", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + (await auth.currentUser.getIdToken()),
      },
      body: formData,
    });
    if (response.status !== 201) {
      const data = await response.json();
      setError(data.message);
      return;
    } else {
      navigation.navigate("AdminManager");
    }
  };

  const handleRemoveSearches = async (searchId) => {
    await fetch(APP_URL + `api/v1/searches/${searchId}`, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + (await auth.currentUser.getIdToken()),
      },
    });
    reloadSearches();
  };

  useEffect(() => {
    const fetchSearches = async () => {
      const response = await fetch(
        APP_URL + `api/v1/searches?limit=10&page=${page}`
      );
      if (response.status !== 200) {
        const data = await response.json();
        setError(data.message);
        return;
      }
      const data = await response.json();
      setSearchesList(data);
    };
    fetchSearches();
  }, [page, reload]);

  const handleNextPage = () => {
    setPage(page + 1);
  };

  const handlePreviousPage = () => {
    if (page === 1) return;
    setPage(page - 1);
  };

  const reloadSearches = async () => {
    setReload(!reload);
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
                    {
                      color: theme.textColor,
                      textAlign: "center",
                      marginTop: 10,
                    },
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
            <Text
              style={[
                styles.someText,
                { color: theme.textColor, textAlign: "center", marginTop: 10 },
              ]}
            >
              {error}
            </Text>
            <Text
              style={[
                styles.someText,
                { color: theme.textColor, textAlign: "center", marginTop: 10 },
              ]}
            >
              {t("term")}
            </Text>
            <TextInput
              style={[
                styles.mainPlaceholder,
                { backgroundColor: theme.secondaryColor, color: theme.color },
              ]}
              placeholder="Term"
              placeholderTextColor={theme.color}
              value={term}
              onChangeText={(text) => setTerm(text)}
            />
            <Text
              style={[
                styles.someText,
                { color: theme.textColor, textAlign: "center", marginTop: 10 },
              ]}
            >
              {t("searches")}
            </Text>
            <TextInput
              style={[
                styles.mainPlaceholder,
                { backgroundColor: theme.secondaryColor, color: theme.color },
              ]}
              placeholder="Searches"
              placeholderTextColor={theme.color}
              value={searches}
              onChangeText={(text) => setSearches(text)}
            />
            <Text
              style={[
                styles.someText,
                { color: theme.textColor, textAlign: "center", marginTop: 10 },
              ]}
            >
              {t("image")}
            </Text>
            
            <TouchableOpacity
              style={[styles.editProfileButton, { borderColor: theme.color }]}
              onPress={selectImage}
            >
              <Text
                style={{
                  color: theme.color,
                  fontFamily: "SpaceGrotesk-Bold",
                  fontSize: 15,
                }}
              >
                {t("uploadImage")}
              </Text>
            </TouchableOpacity>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-around",
                marginTop: 20,
              }}
            >
            <PrimaryButton
              buttonText={t("addSearch")}
              color={theme.color}
              backgroundColor={theme.primaryColor}
              onPress={handleAddSearches}
            />
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-around",
                marginTop: 20,
              }}
            >
              <PrimaryButton
                buttonText={t("previousPage")}
                color={theme.color}
                backgroundColor={theme.primaryColor}
                onPress={handlePreviousPage}
              />
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-around",
                marginTop: 20,
              }}
            >
            <PrimaryButton
              buttonText={t("nextPage")}
              color={theme.color}
              backgroundColor={theme.primaryColor}
              onPress={handleNextPage}
            />
            </View>
            <ScrollView>
              <FlatList
                data={searchesList}
                renderItem={({ item }) => (
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-around",
                      marginBottom: 20,
                      marginTop: 10,
                    }}
                  >
                    <TouchableOpacity
                      style={[
                        styles.someText,
                        {
                          color: theme.textColor,
                          textAlign: "center",
                          marginTop: 10,
                        },
                      ]}
                      onPress={() =>
                        navigation.navigate("AdminManagerEditSearches", {
                          searchId: item.id,
                          oldTerm: item.term,
                          oldSearches: item.searches,
                        })
                      }
                    >
                      <Text>{item.term} - {item.searches}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleRemoveSearches(item.id)}
                    >
                      <Text style={{ color: "red" }}>{t("delete")}</Text>
                    </TouchableOpacity>
                  </View>
                )}
                keyExtractor={(item) => item.id}
              /> 
              </ScrollView>             
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

export default AdminManagerSearches;
