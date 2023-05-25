import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from './styles';

export const IconButton = ({ icon, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      {icon}
    </TouchableOpacity>
  );
};
