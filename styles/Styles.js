import React from "react";
import { StyleSheet, Dimensions } from "react-native";
const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({

    viewContainer: {
        flex: 1,
    },
    safeAreaView: {
        flex: 1,
        width: '100%',
        zIndex: -1,
    },
    center: {
        display: "flex",
        alignItems: "center",
    },
    appGameView: {
        margin: 10,
        width: width > 600 ? '80%' : '90%',
    },
    appView: {
        margin: 10,
        width: width > 600 ? '40%' : '90%',
    },
    appGameOverView: {
        height: '93vh',
        justifyContent: 'center',
        alignItems: 'center',
    },
    appProfileView: {
        width: width > 600 ? '40%' : '100%',
    },
    appProfileButtonsView: {
        width: width > 600 ? '85%' : '90%',
    },
    titleText: {
        fontSize: 64,
        fontFamily: "SuezOne-Regular",
        textAlign: "center",
        marginTop: 40
    },
    titleTextNavBar: {
        fontSize: 20,
        fontFamily: "SpaceGrotesk-Bold",
        textAlign: "center",
    },
    someText: {
        fontSize: 13.3,
        fontFamily: "SpaceGrotesk-Bold",
    },
    someText2: {
        fontSize: 20,
        fontFamily: "SpaceGrotesk-Bold",
    },
    goBackIcon: {
        position: "absolute",
        left: 10,
    },
    navBarView: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        width: "100%",
        marginTop: 10,
        marginBottom: 10
    },
    mainTouchableOpacityLight: {
        display: "flex",
        width: "100%",
        height: "auto",
        paddingLeft: 12,
        paddingRight: 12,
        paddingTop: 16,
        paddingBottom: 16,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 16,
    },
    googleButton: {
        display: "flex",
        width: "100%",
        height: "auto",
        paddingLeft: 12,
        paddingRight: 12,
        paddingTop: 8,
        paddingBottom: 8,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 16,
        borderWidth: 2,
        borderColor: "green",
    },    
    mainTextOfTouchableOpacityLight: {
        fontFamily: "SpaceGrotesk-Bold",
        fontSize: 16
    },
    imageGoogle: {
        width: 25,
        height: 25, 
        marginRight: 12,
        borderRadius: 20, 
        left: 10,
    },
    contentGoogle: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    mainPlaceholder: {
        fontFamily: "SpaceGrotesk-Bold",
        display: "flex",
        width: "100%",
        padding: 16,
        height: 52.5,
        justifyContent: "flex-start",
        alignItems: "flex-start",
        borderRadius: 16,
    },
    mainTextOfPlaceholder: {
        fontFamily: "SpaceGrotesk-Bold",
        fontSize: 16,
        opacity: 0.5
    },
    playButton: {
        width: 64,
        height: 64,
        borderRadius: 32,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 40
    },
    crownCounter: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        width: 100,
        height: 40,
        borderRadius: 10,
        borderWidth: 1,
    },
    titlePlay: {
        fontSize: 50,
        fontFamily: "SuezOne-Regular",
        textAlign: "center",
        marginTop: 10
    },
    singlePlayerMultiPlayerButton: {
        display: "flex",
        width: "75%",
        height: "auto",
        paddingLeft: 12,
        paddingRight: 12,
        paddingTop: 16,
        paddingBottom: 16,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 50,
        alignSelf: 'center',
    },

    cancelButton: {
        padding: 5,
        marginLeft: 10,
        marginRight: 10
    },
    popupMenuContainer: {
        position: 'absolute',
        top: 0,
        left: 155,
        backgroundColor: 'lightgray',
        padding: 10,
        borderRadius: 5,
        zIndex: 1000,
    },
    socialItemContainer: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        padding: 8,
        paddingLeft: 10,
        marginBottom: 5,
    },

    logoImage: {
        width: 100,
        height: 100,
        alignSelf: 'center'
    },
    crownCounterText: {
        fontSize: 15,
        color: "green",
        marginLeft: 5,
        fontFamily: "SpaceGrotesk-Bold",
    },
    progressBarBackground: {
        height: 10,
        backgroundColor: '#C7DBCD',
        borderRadius: 10,
        marginTop: 10,
    },
    progressBarProgress: {
        height: '100%',
        backgroundColor: '#5FB477',
        borderRadius: 10,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#FFF',
        padding: 20,
        borderRadius: 10,
        width: '80%',
        alignItems: 'center',
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        padding: 5,
    },
    resultContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: "SpaceGrotesk-Bold",
    },
    resultText: {
        fontSize: 20,
        marginBottom: 10,
        fontFamily: "SpaceGrotesk-Bold",
    },
    editProfileButton: {
        width: 150,
        height: 40,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        alignSelf: 'center',
        marginTop: 20,
        borderWidth: 1,
    },
    correctAnswer: {
        shadowColor: 'green',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    correctText: {
        color: 'green',
    },
    wrongText: {
        color: 'red',
    },
    wrongAnswer: {
        shadowColor: 'red',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    higherOrLowerText: {
        marginTop: 10, 
        alignItems: "center",
    },
    popoverModalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    popoverModalContent: {
        backgroundColor: '#FFF',
        padding: 20,
        borderRadius: 10,
        width: '80%',
        alignItems: 'center',
    },
    InfoPsswdContainer: {
        flex: 1,
        paddingHorizontal: 10,
        paddingTop: 5,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
      },
})

export default styles;
