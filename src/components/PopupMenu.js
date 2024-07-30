import React, { useState, useContext } from 'react';
import { View, Text, TouchableOpacity, LayoutAnimation } from 'react-native';
import styles from "../../styles/Styles";
import themeContext from "../../theme/ThemeContext";

function PopupMenu ({ option1, option2, onSelect }) {
    const theme = useContext(themeContext);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState(option1);

    const toggleMenu = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setIsOpen(!isOpen);
    };

    const handleOptionClick = (option) => {
        onSelect(option);
        setSelectedOption(option);
        toggleMenu();
    };

    return (
        <View style={{marginTop: 15, zIndex: 999}}>
        <TouchableOpacity onPress={toggleMenu} style={{padding: 10, flexDirection: 'row'}}>
            <Text style={{marginRight: 5, color: theme.color, fontFamily:"SpaceGrotesk-Bold"}}>{'Ranking '+selectedOption}</Text>
            <Text style={{fontSize: 14, color: theme.color}}>{isOpen ? '►' : '▼'}</Text>
        </TouchableOpacity>
        {isOpen && (
            <View style={styles.popupMenuContainer}>
            <TouchableOpacity onPress={() => handleOptionClick(option1)} style={{marginBottom: 5}}>
                <Text style={{fontFamily:"SpaceGrotesk-Bold"}}>{option1}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleOptionClick(option2)} style={{marginBottom: 5}}>
                <Text style={{fontFamily:"SpaceGrotesk-Bold"}}>{option2}</Text>
            </TouchableOpacity>
            </View>
        )}
        </View>
    );
};



export default PopupMenu;
