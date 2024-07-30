import React, { useContext, useState, useEffect } from "react";
import { View, SafeAreaView, Text, TouchableOpacity, TextInput, FlatList } from "react-native";
import styles from "../styles/Styles";
import themeContext from "../theme/ThemeContext";
import TopNavigationBar from "./components/TopNavigationBar";
import { useNavigation } from "@react-navigation/native";
import { auth } from "../backend/FirebaseConnection";
import { APP_URL } from '@env';
import { use } from "i18next";
import PrimaryButton from "./components/PrimaryButton";
import * as ImagePicker from 'expo-image-picker';
import { dataURItoBlob } from "./utils/base64ToBlob";

function AdminManagerSearches() {
    const theme = useContext(themeContext);
    const navigation = useNavigation();

    const image = [];
    const [error, setError] = useState("");
    const [searchesList, setSearchesList] = useState([]);
    const [ page, setPage ] = useState(1);
    const formData = new FormData();

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
    }

    const handleAddSearches = async () => {

        const response = await fetch(APP_URL + "api/v1/aiimages", {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + await auth.currentUser.getIdToken(),
            },
            body: formData,
        });
        if (response.status !== 201) {
            const data = await response.json();
            setError(data.message);
            return;
        } else {
            navigation.navigate('AdminManager');
        }
    }

    return (
        <View style={[styles.viewContainer, { backgroundColor: theme.backgroundColor }]}>
            <SafeAreaView style={[styles.safeAreaView, { backgroundColor: theme.backgroundColor }]}>
                <TopNavigationBar titleText="Admin Manager" onPress={() => navigation.goBack()} />
                <View style={{ flexDirection: "row", justifyContent: "space-around", marginBottom: 20, marginTop: 10 }}>

                    <TouchableOpacity onPress={() => navigation.navigate('AdminManager')}>
                        <Text style={[styles.someText, { color: "grey", textAlign: "center", marginTop: 10 }]}>User Managment</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => navigation.navigate('AdminManagerSearches')}>
                        <Text style={[styles.someText, { color: theme.textColor, textAlign: "center", marginTop: 10 }]}>Searches</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => navigation.navigate('UserRequests')}>
                        <Text style={[styles.someText, { color: "grey", textAlign: "center", marginTop: 10 }]}>User Requests</Text>
                    </TouchableOpacity>

                </View>
                <Text style={[styles.someText, { color: theme.textColor, textAlign: "center", marginTop: 10 }]}>{error}</Text>

                <Text style={[styles.someText, { color: theme.textColor, textAlign: "center", marginTop: 10 }]}>Term</Text>
                <TextInput style={[styles.mainPlaceholder, { backgroundColor: theme.secondaryColor, color: theme.color }]} placeholder="Term" placeholderTextColor={theme.color} value={term} onChangeText={(text) => setTerm(text)} />
                <Text style={[styles.someText, { color: theme.textColor, textAlign: "center", marginTop: 10 }]}>Searches</Text>
                <TextInput style={[styles.mainPlaceholder, { backgroundColor: theme.secondaryColor, color: theme.color }]} placeholder="Searches" placeholderTextColor={theme.color} value={searches} onChangeText={(text) => setSearches(text)} />
                <Text style={[styles.someText, { color: theme.textColor, textAlign: "center", marginTop: 10 }]}>Image</Text>
                <TouchableOpacity style={[styles.editProfileButton, { borderColor: theme.color }]} onPress={selectImage}>
                    <Text style={{ color: theme.color, fontFamily: "SpaceGrotesk-Bold", fontSize: 15 }}>Upload Image</Text>
                </TouchableOpacity>
                <PrimaryButton
                    buttonText="Add Searches"
                    color={theme.color}
                    backgroundColor={theme.primaryColor}
                    onPress={handleAddSearches}
                />
                <FlatList
                    data={searchesList}
                    renderItem={({ item }) => (
                        <Text style={[styles.someText, { color: theme.textColor, textAlign: "center", marginTop: 10 }]}>{item.term} - {item.searches}</Text>
                    )}
                    keyExtractor={item => item.id}
                />

            </SafeAreaView>
        </View>
    )
}

export default AdminManagerSearches;