import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './LoginScreen'; // LoginScreen'i import edin.
import DashboardScreen from './DashboardScreen'; // DashboardScreen'i import edin.
import GuidesScreen from './GuidesScreen'; // GuidesScreen ve EditGuideScreen'i import edin.
import EditGuideScreen from './EditGuideScreen';
import EditRefScreen from './EditRefScreen';
import EditValuesScreen from './EditValuesScreen';
import RegisterScreen from './RegisterScreen'; // RegisterScreen'i import edin.


const Stack = createStackNavigator();

function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <Button
        title="Login Sayfasına Git"
        onPress={() => navigation.navigate('Login')}
      />
            <Button
        title="Register Sayfasına Git"
        onPress={() => navigation.navigate('Register')}
      />
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#C8C6C6', // Header'ın arka plan rengini burada değiştirebilirsiniz.
          },
          headerTintColor: '#fff', // Header'daki metin rengini burada değiştirebilirsiniz.
          headerTitleStyle: {
            fontWeight: 'bold', // Başlık yazısının stilini değiştirebilirsiniz.
          },
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Ana Sayfa' }} // Home ekranının başlık ismini burada değiştirdik.
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ title: 'Giriş Yap' }} // Login ekranının başlık ismini burada değiştirdik.
        />
        <Stack.Screen
          name="Dashboard"
          component={DashboardScreen}
          options={{ title: 'Gösterge Paneli' }} // Dashboard ekranının başlık ismini burada değiştirdik.
        />
        <Stack.Screen
          name="Guides"
          component={GuidesScreen}
          options={{ title: 'Kılavuzlar' }} // Guides ekranının başlık ismini burada değiştirdik.
        />
        <Stack.Screen
          name="EditGuide"
          component={EditGuideScreen}
          options={{ title: 'Kılavuz Düzenle' }} // EditGuide ekranının başlık ismini burada değiştirdik.
        />
        <Stack.Screen
          name="EditRef"
          component={EditRefScreen}
          options={{ title: 'Referans Düzenle' }} // EditRef ekranının başlık ismini burada değiştirdik.
        />
        <Stack.Screen
          name="EditValue"
          component={EditValuesScreen}
          options={{ title: 'Değerleri Düzenle' }} // EditRef ekranının başlık ismini burada değiştirdik.
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ title: 'Kayıt Ol' }} // EditRef ekranının başlık ismini burada değiştirdik.
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
