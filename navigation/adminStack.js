import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AdminDashboardScreen from '../pages/AdminDashboardScreen';
import GuidesScreen from '../pages/GuidesScreen';
import EditGuideScreen from '../pages/EditGuideScreen';
import EditRefScreen from '../pages/EditRefScreen';
import EditValuesScreen from '../pages/EditValuesScreen';
import UsersScreen from '../pages/UsersScreen';
import AddTestScreen from '../pages/AddTestScreen';
import ShowUserTestsScreen from '../pages/ShowUserTestsScreen';
import FastSearch from '../pages/FastSearchScreen';

const Stack = createNativeStackNavigator();

export default function AdminStack() {

  return (

    <Stack.Navigator
      initialRouteName="AdminDashboard"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#C8C6C6',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="AdminDashboard"
        component={AdminDashboardScreen}
        options={{ title: 'Doktor Gösterge Paneli' }}
      />
      <Stack.Screen
        name="Guides"
        component={GuidesScreen}
        options={{ title: 'Kılavuzlar' }}
      />
      <Stack.Screen
        name="EditGuide"
        component={EditGuideScreen}
        options={{ title: 'Kılavuz Düzenle' }}
      />
      <Stack.Screen
        name="EditRef"
        component={EditRefScreen}
        options={{ title: 'Referans Düzenle' }}
      />
      <Stack.Screen
        name="EditValue"
        component={EditValuesScreen}
        options={{ title: 'Değerleri Düzenle' }}
      />
      <Stack.Screen
        name="Users"
        component={UsersScreen}
        options={{ title: 'Kullanıcılar' }}
      />
      <Stack.Screen
        name="AddTest"
        component={AddTestScreen}
        options={{ title: 'Tahliller' }}
      />
      <Stack.Screen
        name="ShowUserTests"
        component={ShowUserTestsScreen}
        options={{ title: 'Tahliller' }}
      />
      <Stack.Screen
        name="Home"
        component={FastSearch}
        options={{ title: 'Hızlı Arama' }}
      />

    </Stack.Navigator>
  );
}
