// adminStack.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DashboardScreen from '../pages/DashboardScreen';
import GuidesScreen from '../pages/GuidesScreen';
import EditGuideScreen from '../pages/EditGuideScreen';
import EditRefScreen from '../pages/EditRefScreen';
import EditValuesScreen from '../pages/EditValuesScreen';
import RegisterScreen from '../pages/RegisterScreen';
import UsersScreen from '../pages/UsersScreen';
import AddTestScreen from '../pages/AddTestScreen';
import ShowUserTestsScreen from '../pages/ShowUserTestsScreen';
import HomeScreen from '../pages/HomeScreen';

const Stack = createNativeStackNavigator();

export default function AdminStack() {
  return (
    // Dikkat: NavigationContainer yok. Sadece Stack.Navigator var.
    <Stack.Navigator
    initialRouteName="Dashboard" // Varsayılan ekran olarak Dashboard ayarlanır
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
        name="Dashboard"
        component={DashboardScreen}
        options={{ title: 'Gösterge Paneli' }}
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
        name="Register"
        component={RegisterScreen}
        options={{ title: 'Kayıt Ol' }}
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
        component={HomeScreen}
        options={{ title: 'Ana Sayfa' }}
      />
      {/* Eğer AdminStack içinde Home veya Login’i de kullanmak istiyorsanız ekleyebilirsiniz */}
      {/* <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'Ana Sayfa' }}
      />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ title: 'Giriş Yap' }}
      /> */}
    </Stack.Navigator>
  );
}
