import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import RootNavigation from '../navigation/rootNavigation';
import { AuthProvider } from '../configs/authContext';

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <RootNavigation />
      </NavigationContainer>
    </AuthProvider>
  );
}
