import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import UserDashboard from '../pages/UserDashboardScreen';
import ShowUserTests from '../pages/ShowUserTestsScreen';
import UserProfile from '../pages/UserProfileScreen';


const Stack = createNativeStackNavigator();

export default function UserStack() {
  return (
    <Stack.Navigator initialRouteName="UserDashboard">
      <Stack.Screen
        name="UserDashboard"
        component={UserDashboard}
        options={{ title: 'Tahlilim Uygulaması' }}
      />

      <Stack.Screen
        name="ShowUserTests"
        component={ShowUserTests}
        options={{ title: 'Tahlillerim' }}
      />

      <Stack.Screen
        name="UserProfile"
        component={UserProfile}
        options={{ title: 'Profil Bilgilerim' }}
      />
    </Stack.Navigator>
  );
}
