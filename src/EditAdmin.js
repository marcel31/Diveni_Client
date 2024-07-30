import React, { useContext, useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import themeContext from "../theme/ThemeContext";
import TopNavigationBar from "./components/TopNavigationBar";
import styles from "../styles/Styles";
import {
  editNameProfile,
  editPhotoProfile,
} from "../backend/FirebaseConnection";
import EntryGameButton from "./components/PrimaryButton";
import * as ImagePicker from "expo-image-picker";

//pass the user as a prop
const EditAdmin = ({ route }) => {
  const { t } = useTranslation();
  const { user } = route.params;
  const theme = useContext(themeContext);
  const navigation = useNavigation();
  const [editName, setEditName] = useState(user?.displayName || "");
  const [showCancelButton, setShowCancelButton] = useState(false);
  const [image, setImage] = useState(user?.photoURL || null);

  const handleGoBack = () => {
    navigation.goBack();
  };

  useEffect(() => {
    setImage(user?.photoURL);
  }, [user.photoURL]);

  const clearName = () => {
    setEditName("");
    setShowCancelButton(false);
  };

  const handleNameChange = (text) => {
    setEditName(text);
    setShowCancelButton(!!text);
  };
  const handleSaveNewProfileInfo = async () => {
    await editNameProfile(user, editName);
  };

  const selectImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      //TODO Cambiar
      Alert.alert("Accepta permisos perrooo!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      const selectedImage = result.assets[0];
      if (selectedImage.uri) {
        await editPhotoProfile(user, selectedImage.uri);
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
              titleText="Edit Admin"
              onPress={() => navigation.goBack()}
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
                placeholder={user?.displayName || "Type..."}
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
              style={{ position: "absolute", bottom: -90, flexDirection: "row" }}
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

export default EditAdmin;
