import React, { useEffect, useState, useContext } from 'react';
import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { EventRegister } from 'react-native-event-listeners';
import theme from './theme/Theme';
import themeContext from './theme/ThemeContext';
import Home from './src/Home';
import SignIn from './src/SignIn';
import Register from './src/Register';
import RecoveryEnterEmail from './src/RecoveryEnterMail';
import RecoveryEnterCode from './src/RecoveryEnterCode';
import Social from './src/Social';
import Play from './src/Play';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import Profile from './src/Profile';
import { AntDesign } from '@expo/vector-icons';
import PlayButton from './src/components/PlayButton';
import ProfileButton from './src/components/ProfileButton';
import SocialButton from './src/components/SocialButton';
import Statistics from './src/Statistics';
import GameHistory from './src/GameHistory';
import OtherUserProfile from './src/OtherUserProfile';
import WaitRoom from './src/WaitRoom';
import HigherOrLower from './src/HigherOrLower';
import GameOver from './src/GameOver';
import FriendRequests from './src/FirendRequests';
import EditProfile from './src/EditProfile';
import ImageQuizz from './src/ImageQuizz';
import ChooseType from './src/ChooseType';
import RoundManager from './src/RoundManager';
import AdminManager from './src/AdminManager';
import AdminManagerSearches from './src/AdminManagerSearches';
import ContactForm from './src/ContactForm';
import UserRequests from './src/UserRequests';
import EditAdmin from './src/EditAdmin';
import AdminManagerEditSearches from './src/AdminManagerEditSearches';

const Tab = createBottomTabNavigator();

function BottomTabs() {
  const themeContextValue = useContext(themeContext);

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarLabel: () => null,
        tabBarStyle: {
          elevation: 0,
          borderTopWidth: 0,
          borderRadius: 15,
          backgroundColor: themeContextValue.secondaryColor,
        },
      }}
    >
      <Tab.Screen
        name="Social"
        component={Social}
        options={{
          headerShown: false,
          tabBarLabelStyle: { color: "black" },
          tabBarIcon: ({ focused }) =>
            focused ? (
              <SocialButton
                backgroundColor={themeContextValue.reversedBackgroundColor}
              />
            ) : (
              <AntDesign
                name="staro"
                size={24}
                color={themeContextValue.reversedBackgroundColor}
              />
            ),
        }}
      />

      <Tab.Screen
        name="PlayTab"
        component={Play}
        options={{
          headerShown: false,
          tabBarLabelStyle: { color: "black" },
          tabBarIcon: ({ focused }) =>
            focused ? (
              <PlayButton
                backgroundColor={themeContextValue.reversedBackgroundColor}
              />
            ) : (
              <Ionicons
                name="game-controller-outline"
                size={24}
                color={themeContextValue.reversedBackgroundColor}
              />
            ),
        }}
      />

      <Tab.Screen
        name="ProfileTab"
        component={Profile}
        options={{
          headerShown: false,
          tabBarLabelStyle: { color: "black" },
          tabBarIcon: ({ focused }) =>
            focused ? (
              <ProfileButton
                backgroundColor={themeContextValue.reversedBackgroundColor}
              />
            ) : (
              <FontAwesome
                name="user-circle-o"
                size={24}
                color={themeContextValue.reversedBackgroundColor}
              />
            ),
        }}
      />
    </Tab.Navigator>
  );
}

const Stack = createNativeStackNavigator();

function Navigation() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const listener = EventRegister.addEventListener("ChangeTheme", (data) => {
      setDarkMode(data);
    });
    return () => {
      EventRegister.removeAllListeners(listener);
    };
  }, [darkMode]);

    return (
        <themeContext.Provider value={darkMode === true ? theme.dark : theme.light}>

            <NavigationContainer theme={darkMode === true ? DarkTheme : DefaultTheme}>
                <Stack.Navigator>
                    <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
                    <Stack.Screen name="SignIn" component={SignIn} options={{ headerShown: false }} />
                    <Stack.Screen name="Register" component={Register} options={{ headerShown: false }} />
                    <Stack.Screen name="RecoveryEnterMail" component={RecoveryEnterEmail} options={{ headerShown: false }} />
                    <Stack.Screen name="RecoveryEnterCode" component={RecoveryEnterCode} options={{ headerShown: false }} />
                    <Stack.Screen name="BottomTabs" component={BottomTabs} options={{ headerShown: false }} />
                    <Stack.Screen name="Statistics" component={Statistics} options={{ headerShown: false }} />
                    <Stack.Screen name="GameHistory" component={GameHistory} options={{ headerShown: false }} />
                    <Stack.Screen name="OtherUserProfile" component={OtherUserProfile} options={{ headerShown: false }} />
                    <Stack.Screen name="WaitRoom" component={WaitRoom} options={{ headerShown: false }} />
                    <Stack.Screen name="HigherOrLower" component={HigherOrLower} options={{ headerShown: false }} />
                    <Stack.Screen name="GameOver" component={GameOver} options={{ headerShown: false }} />
                    <Stack.Screen name="FriendRequests" component={FriendRequests} options={{ headerShown: false }} />
                    <Stack.Screen name="RoundManager" component={RoundManager} options={{ headerShown: false }} />
                    <Stack.Screen name="ImageQuizz" component={ImageQuizz} options={{ headerShown: false }} />
                    <Stack.Screen name="ChooseType" component={ChooseType} options={{ headerShown: false }} />
                    <Stack.Screen name="EditProfile" component={EditProfile} options={{ headerShown: false }} />
                    <Stack.Screen name="AdminManager" component={AdminManager} options={{ headerShown: false }} />
                    <Stack.Screen name="AdminManagerSearches" component={AdminManagerSearches} options={{ headerShown: false }} />
                    <Stack.Screen name="ContactForm" component={ContactForm} options={{ headerShown: false }} />
                    <Stack.Screen name="UserRequests" component={UserRequests} options={{ headerShown: false }} />
                    <Stack.Screen name="EditAdmin" component={EditAdmin} options={{ headerShown: false }} />
                    <Stack.Screen name="AdminManagerEditSearches" component={AdminManagerEditSearches} options={{ headerShown: false }} />
                </Stack.Navigator>
            </NavigationContainer>
        </themeContext.Provider>
    );
}

export default Navigation;
