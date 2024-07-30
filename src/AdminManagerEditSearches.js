import React, { useContext, useState, useEffect } from "react";
import { View, SafeAreaView, Text, TouchableOpacity, TextInput, FlatList } from "react-native";
import styles from "../styles/Styles";
import themeContext from "../theme/ThemeContext";
import TopNavigationBar from "./components/TopNavigationBar";
import { useNavigation, useRoute } from "@react-navigation/native";
import { auth } from "../backend/FirebaseConnection";
import { APP_URL } from '@env';
import { use } from "i18next";
import PrimaryButton from "./components/PrimaryButton";
import * as ImagePicker from 'expo-image-picker';
import { dataURItoBlob } from "./utils/base64ToBlob";
import { useTranslation } from 'react-i18next';


export default function AdminManagerEditSearches() {
  const theme = useContext(themeContext);
  const { t } = useTranslation();
  const route = useRoute();
  const navigation = useNavigation();
  const { searchId, oldTerm, oldSearches } = route.params;
  const [term, setTerm] = useState(oldTerm);
  const [searches, setSearches] = useState(oldSearches);
  const [error, setError] = useState("");
  const formData = new FormData();

  const handleEditSearches = async () => {
    formData.append("searches", searches);
    formData.append("term", term);
    const response = await fetch(APP_URL + `api/v1/searches/${searchId}`, {
      method: "PUT",
      headers: {
        "Authorization": "Bearer " + await auth.currentUser.getIdToken(),
      },
      body: formData,
    });
    if (response.status !== 200) {
      const data = await response.json();
      setError(data.message);
      return;
    } else {
      navigation.navigate('AdminManager');
    }
  }

  const selectImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Accepta permisos');
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
  }
  return (
    <View style={[styles.viewContainer, { backgroundColor: theme.backgroundColor }]}>
        <SafeAreaView style={[styles.safeAreaView, { backgroundColor: theme.backgroundColor }]}>
        <View style={[styles.center]}>
          <View style={[styles.appView]}>
            <TopNavigationBar titleText="Admin Manager" onPress={() => navigation.goBack()} />
            <View style={{ flexDirection: "row", justifyContent: "space-around", marginBottom: 20, marginTop: 10 }}>

                    <TouchableOpacity onPress={() => navigation.navigate('AdminManager')}>
                        <Text style={[styles.someText,  { color: "grey", textAlign: "center", marginTop: 10 }]}>{t('userMan')}</Text>
                    </TouchableOpacity>       

                    <TouchableOpacity onPress={() => navigation.navigate('AdminManagerSearches')}>
                        <Text style={[styles.someText, { color: theme.textColor, textAlign: "center", marginTop: 10 }]}>{t('searches')}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity   onPress={() => navigation.navigate('UserRequests')}>
                        <Text style={[styles.someText, { color: "grey", textAlign: "center", marginTop: 10 }]}>{t('userReq')}</Text>
                    </TouchableOpacity>

                </View>
            <Text style={[styles.someText, { color: theme.textColor, textAlign: "center", marginTop: 10 }]}>{error}</Text>

            <Text style={[styles.someText, { color: theme.textColor, textAlign: "center", marginTop: 10 }]}>{t('term')}</Text>
            <TextInput style={[styles.mainPlaceholder, { backgroundColor: theme.secondaryColor, color: theme.color }]} placeholder="Term" placeholderTextColor={theme.color} value={term} onChangeText={(text) => setTerm(text)} />
            <Text style={[styles.someText, { color: theme.textColor, textAlign: "center", marginTop: 10 }]}>{t('searches')}</Text>
            <TextInput style={[styles.mainPlaceholder, { backgroundColor: theme.secondaryColor, color: theme.color }]} placeholder="Searches" placeholderTextColor={theme.color} value={searches} onChangeText={(text) => setSearches(text)} />
            <Text style={[styles.someText, { color: theme.textColor, textAlign: "center", marginTop: 10 }]}>{t('image')}</Text>
            <TouchableOpacity style={[styles.editProfileButton, { borderColor: theme.color }]} onPress={selectImage}>
                <Text style={{ color: theme.color, fontFamily: "SpaceGrotesk-Bold", fontSize: 15 }}>{t('uploadImage')}</Text>
            </TouchableOpacity>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-around",
                marginTop: 20,
              }}
            >
            <PrimaryButton
                buttonText={t('editSearch')}
                color={theme.color}
                backgroundColor={theme.primaryColor}
                onPress={handleEditSearches}
            />
            </View>
          </View>
        </View>

        </SafeAreaView>
    </View>
)
}