import React, { useContext } from 'react';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';
import styles from "../../styles/Styles";
import themeContext from "../../theme/ThemeContext";

function SearchBar({ onChangeText, value, placeholder, imageComponent, onFocus, onBlur, onCancel, showCancelButton }) {
  const theme = useContext(themeContext);

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <View style={[styles.mainPlaceholder, { backgroundColor: theme.secondaryColor, color: theme.color, flexDirection: 'row', alignItems: 'center', flex: 1 }]}>
        {imageComponent && imageComponent}
        <TextInput
          style={{ width: '100%', color: theme.color, marginLeft: 10, fontFamily: "SpaceGrotesk-Bold" }}
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          onFocus={onFocus}
          onBlur={onBlur}
          placeholderTextColor={theme.placeholderTextColor}
        />
      </View>

      {showCancelButton && onCancel && (
        <TouchableOpacity onPress={onCancel} style={styles.cancelButton}>
          <Text style={{ color: theme.color, fontFamily: "SpaceGrotesk-Bold" }}>Cancel</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default SearchBar;
