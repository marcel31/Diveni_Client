import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableHighlight, TouchableWithoutFeedback } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Popover from 'react-native-popover-view';
import { useTranslation } from 'react-i18next';

const PasswordRequirements = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { t } = useTranslation();
  
  const togglePopover = () => {
    setIsVisible(!isVisible);
  };

  const renderPopoverContent = () => (
    <View style={styles.popoverContent}>
      <View style={styles.closeButtonContainer}>
        <TouchableHighlight onPress={togglePopover} underlayColor="transparent">
          <Ionicons name="close" size={16} color="black" />
        </TouchableHighlight>
      </View>
      <Text style={styles.requirement}>{t('psswdReq')}</Text>
      <Text>{t('min8')}</Text>
      <Text>{t('onUpp')}</Text>
      <Text>{t('onLow')}</Text>
      <Text>{t('onNum')}</Text>
      <Text>{t('specialChar')}</Text>
    </View>
  );

  return (
    <TouchableWithoutFeedback onPress={() => setIsVisible(false)}>
      <View>
        <Popover
          isVisible={isVisible}
          from={(
            <TouchableHighlight onPress={togglePopover} underlayColor="transparent">
              <View style={styles.infoContainer}>
                <Ionicons name="ios-help-circle-outline" size={24} color="black" />
              </View>
            </TouchableHighlight>
          )}
          onClose={togglePopover}
          placement="left"
        >
          {renderPopoverContent()}
        </Popover>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  infoContainer: {
    width: 25,
    height: 25,
    borderRadius: 20,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  popoverContent: {
    padding: 10,
  },
  requirement: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  closeButtonContainer: {
    alignItems: 'flex-end',
    marginBottom: 10,
  },
});

export default PasswordRequirements;
