import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AdminDashboardScreen from '../pages/AdminDashboardScreen';
import GuidesScreen from '../pages/GuidesScreen';
import EditGuideScreen from '../pages/EditGuideScreen';
import EditRefScreen from '../pages/EditRefScreen';
import EditValuesScreen from '../pages/EditValuesScreen';
import PatientsScreen from '../pages/PatientsScreen';
import AddTestScreen from '../pages/AddTestScreen';
import ShowUserTestsScreen from '../pages/ShowUserTestsScreen';
import FastSearch from '../pages/FastSearchScreen';
import AddPatientScreen from '../pages/AddPatientScreen';

const Stack = createNativeStackNavigator();

export default function AdminStack() {

  return (

    <Stack.Navigator
      initialRouteName="AdminDashboard"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#F3F8FE',
        },
        headerTintColor: '#000',
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
        name="Patients"
        component={PatientsScreen}
        options={{ title: 'Hasta Takibi' }}
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
      <Stack.Screen
        name="AddPatient"
        component={AddPatientScreen}
        options={{ title: 'Hasta Ekle' }}
      />



    </Stack.Navigator>
  );
}
