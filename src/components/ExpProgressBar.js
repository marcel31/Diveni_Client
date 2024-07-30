import React from 'react';
import { View, StyleSheet } from 'react-native';
import styles from "../../styles/Styles";

function ExpProgressBar ({ userExperience, necessaryExp }) {
    const progressPercent = (userExperience / necessaryExp) * 100;

    return (
        <View style={styles.progressBarBackground}>
            <View style={[styles.progressBarProgress, { width: `${progressPercent}%` }]} />
        </View>
    );
};


export default ExpProgressBar;
