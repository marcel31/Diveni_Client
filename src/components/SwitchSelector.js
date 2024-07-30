import React, { useState, useContext } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import themeContext from "../../theme/ThemeContext";

function SwitchSelector({ option1, option2, onSelect }) {
    const theme = useContext(themeContext);
    const [selectedOption, setSelectedOption] = useState(option1);

    const handleOptionChange = (option) => {
        setSelectedOption(option);
        onSelect(option);
    };

    return (
        <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity
                style={{ paddingHorizontal: 20 }}
                onPress={() => handleOptionChange(option1)}
            >
                <Text style={[styles.text, selectedOption === option1 ? {color: theme.color} : styles.unselectedText]}>{option1}</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={{ paddingHorizontal: 20 }}
                onPress={() => handleOptionChange(option2)}
            >
                <Text style={[styles.text, selectedOption === option2 ? {color: theme.color} : styles.unselectedText]}>{option2}</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({

    
    unselectedText: {
        color: 'gray',
    },
});

export default SwitchSelector;
