import React, { useContext, useState, useEffect } from "react";
import { View, Text, SafeAreaView, Image, TouchableOpacity, TextInput } from "react-native";
import TopNavigationBar from "./components/TopNavigationBar";
import styles from "../styles/Styles";
import themeContext from "../theme/ThemeContext";
import { useNavigation } from "@react-navigation/native";
import EntryGameButton from "./components/PrimaryButton";
import * as ImagePicker from 'expo-image-picker';
import { editPhotoProfile, editNameProfile, firestore } from "../backend/FirebaseConnection";
import { useTranslation } from 'react-i18next';

const EditProfile = ({ route }) => {
  const { t } = useTranslation();
  const { userProfile } = route.params;
  const theme = useContext(themeContext);
  const navigation = useNavigation();
  const [editName, setEditName] = useState(userProfile?.displayName || "");
  const [showCancelButton, setShowCancelButton] = useState(false);
  const [image, setImage] = useState(userProfile?.photoURL || null);

  useEffect(() => {
    setImage(userProfile?.photoURL);
  }, [userProfile.photoURL]);

  const handleNameChange = (text) => {
    setEditName(text);
    setShowCancelButton(!!text);
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const clearName = () => {
    setEditName("");
    setShowCancelButton(false);
  };

  const handleSaveNewProfileInfo = async () => {
    await editNameProfile(userProfile, editName);
    navigation.navigate("BottomTabs", { screen: "ProfileTab" });
  };

  const selectImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permisos requeridos");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0,
    });

    if (!result.canceled && result.assets.length > 0) {
      const selectedImage = result.assets[0];
      if (selectedImage.uri) {
        await editPhotoProfile(userProfile, selectedImage.uri);
        setImage(selectedImage.uri);
      }
    }
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
              onPress={handleGoBack}
              titleText={t("editProfile")}
            />
            <Image
              source={{ uri: image }}
              style={{
                width: 130,
                height: 130,
                borderRadius: 1000,
                alignSelf: "center",
                marginTop: 20,
              }}
            />

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
                {t("changePicture")}
              </Text>
            </TouchableOpacity>

            <View style={{ height: 40 }} />
            <Text
              style={[styles.someText2, { color: theme.color, fontSize: 15 }]}
            >
              {t("newName")}
            </Text>
            <View style={{ height: 15 }} />
            <View style={{ flexDirection: "row" }}>
              <TextInput
                style={{
                  fontFamily: "SpaceGrotesk-Bold",
                  fontSize: 15,
                  borderBottomColor: theme.color,
                  borderBottomWidth: 1,
                  paddingBottom: 8,
                  flex: 1,
                }}
                placeholder={userProfile?.displayName || "Type..."}
                placeholderTextColor={theme.placeholderTextColor}
                value={editName}
                onChangeText={handleNameChange}
              />
              {showCancelButton && (
                <TouchableOpacity
                  onPress={clearName}
                  style={{ position: "absolute", right: 15 }}
                >
                  <Text
                    style={{
                      color: theme.color,
                      fontFamily: "SpaceGrotesk-Bold",
                      fontSize: 18,
                    }}
                  >
                    x
                  </Text>
                </TouchableOpacity>
              )}
            </View>
            <View
              style={{
                position: "absolute",
                bottom: -120,
                flexDirection: "row",
              }}
            >
              <EntryGameButton
                buttonText={t("save")}
                color={theme.color}
                backgroundColor={theme.primaryColor}
                onPress={handleSaveNewProfileInfo}
              />
            </View>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default EditProfile;