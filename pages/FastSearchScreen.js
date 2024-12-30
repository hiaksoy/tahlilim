// screens/FastSearchScreen.js

import React from 'react';
import { View, StyleSheet } from 'react-native';
import FastSearch from '../components/FastSearch';

export default function FastSearchScreen() {
  return (
    <View style={styles.container}>
      <FastSearch />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F8FE', // Pastel mavi arkaplan
    padding: 16,
  },
});
