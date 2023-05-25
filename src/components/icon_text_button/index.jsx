import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from './styles';

export const IconTextButton = ({ icon, title, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      {icon}
      <Text style={styles.txtTitle}>{title}</Text>
    </TouchableOpacity>
  );
};
