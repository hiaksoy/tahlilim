// screens/LoginScreen.js

import React, { useState, useContext } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Alert, 
  StyleSheet, 
  ScrollView, 
  StatusBar, 
  Platform 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { loginUser } from '../services/authService';
import { AuthContext } from '../configs/authContext';

// FastSearch bileşenini içe aktar
import FastSearch from '../components/FastSearch';

export default function LoginScreen() {
  // ----------------------------------------------------------------------------
  // 1) LOGIN FORM İLE İLGİLİ STATE’LER
  // ----------------------------------------------------------------------------
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setUser } = useContext(AuthContext);
  const navigation = useNavigation();

  const handleLogin = async () => {
    try {
      const user = await loginUser(email, password);
      Alert.alert('Başarılı Giriş', `Hoşgeldiniz, ${user.email}`);
      setUser(user);
      // Eğer giriş sonrası başka sayfaya yönlendirmek isterseniz:
      // navigation.reset({ index: 0, routes: [{ name: 'RootNavigation' }] });
    } catch (error) {
      Alert.alert('Giriş Hatası', error.message || 'Bir hata oluştu.');
    }
  };

  return (
    <View style={styles.safeArea}>
      <StatusBar backgroundColor="#F3F8FE" barStyle="dark-content" />

      <ScrollView style={styles.container}>
        {/* ------------------------------------------------------------- */}
        {/* LOGIN FORMUNU AÇ / KAPAT BUTONU */}
        {/* ------------------------------------------------------------- */}
        <TouchableOpacity
          style={styles.loginToggleButton}
          onPress={() => setShowLoginForm(!showLoginForm)}
        >
          <Text style={styles.loginToggleButtonText}>
            {showLoginForm ? 'Kullanıcı Girişini Kapat' : 'Kullanıcı Girişini Aç'}
          </Text>
        </TouchableOpacity>

        {/* ------------------------------------------------------------- */}
        {/* LOGIN FORMU (showLoginForm true ise göster) */}
        {/* ------------------------------------------------------------- */}
        {showLoginForm && (
          <View style={styles.loginContainer}>
            <Text style={styles.title}>Giriş Yap</Text>
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            <TextInput
              style={styles.input}
              placeholder="Şifre"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
              <Text style={styles.buttonText}>Giriş Yap</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.loginLink}>Hesabınız yok mu? Kayıt Ol</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ------------------------------------------------------------- */}
        {/* BURADAN SONRA "HIZLI ARAMA" (FastSearch) BİLEŞENİNİ RENDER ET */}
        {/* ------------------------------------------------------------- */}
        <FastSearch />
      </ScrollView>
    </View>
  );
}

// ----------------------------------------------------------------------------
// STYLES
// ----------------------------------------------------------------------------
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F3F8FE', // Ana arka plan (pastel mavi)
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F3F8FE',
  },
  
  // LOGIN FORM İLE İLGİLİ STYLES
  loginToggleButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  loginToggleButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  loginContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,

    // Gölge
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#007BFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginLink: {
    textAlign: 'center',
    color: '#007BFF',
    fontWeight: 'bold',
  },
});
