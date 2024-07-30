import AsyncStorage from "@react-native-async-storage/async-storage"

export const saveStorage = async (key, value) => {
    try {
        await AsyncStorage.setItem(key, value);
    } catch (error) {
        console.log("Error saving data: ", error);
    }
}

export const getStorage = async (key) => {
    try {
        const value = await AsyncStorage.getItem(key);
        return value;
    } catch (error) {
        console.log("Error getting data: ", error);
    }
}