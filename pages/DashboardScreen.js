import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { auth } from '../configs/firebase_config'; 
import { signOut } from 'firebase/auth'; 
import { useNavigation } from '@react-navigation/native'; 

const DashboardScreen = () => {
  const user = auth.currentUser;
  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      Alert.alert('Başarılı Çıkış', 'Çıkış yapıldı!');
      navigation.navigate('Home');
    } catch (error) {
      Alert.alert('Çıkış Hatası', error.message || 'Çıkış yapılamadı.');
    }
  };

  const goToGuides = () => {
    navigation.navigate('Guides');
  };

  const goToUsers = () => {
    navigation.navigate('Users');
  }

  const goToFastSearch = () => {
    navigation.navigate('Home');
  }


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hoşgeldiniz</Text>
      {user && (
        <Text style={styles.email}>
          {`Giriş Yapmış Kullanıcı: ${user.email}`}
        </Text>
      )}
      <TouchableOpacity style={styles.button} onPress={goToGuides}>
        <Text style={styles.buttonText}>Kılavuzlar Sayfasına Git</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={goToUsers}>
        <Text style={styles.buttonText}>Kullanıcılar</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={goToFastSearch}>
        <Text style={styles.buttonText}>Hızlı Arama</Text>
      </TouchableOpacity>


      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.buttonText}>Çıkış Yap</Text>
      </TouchableOpacity>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  email: {
    fontSize: 18,
    marginBottom: 20,
    color: '#555',
  },
  button: {
    width: '80%',
    height: 50,
    backgroundColor: '#007BFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 15,
  },
  logoutButton: {
    width: '80%',
    height: 50,
    backgroundColor: '#ff4d4f',
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
});

export default DashboardScreen;
