import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import UserDashboard from '../pages/UserDashboardScreen';


const Stack = createNativeStackNavigator();

export default function UserStack() {
  return (
    <Stack.Navigator initialRouteName="UserDashboard">
      <Stack.Screen
        name="UserDashboard"
        component={UserDashboard}
        options={{ title: 'Tahlilim Uygulaması' }}
        />
    </Stack.Navigator>
  );
}
