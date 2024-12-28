import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { auth } from '../configs/firebase_config';
import { signOut } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../configs/authContext';

const DashboardScreen = () => {
  const { setUser } = useContext(AuthContext);
  const user = auth.currentUser;
  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      Alert.alert('Çıkış Hatası', error.message || 'Çıkış yapılamadı.');
    }
  };

  const goToGuides = () => {
    navigation.navigate('Guides');
  };

  const goToUsers = () => {
    navigation.navigate('Users');
  };

  const goToFastSearch = () => {
    navigation.navigate('Home');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hoşgeldiniz</Text>
      {user && (
        <View style={styles.userInfoContainer}>
          <Text style={styles.userInfoText}>
            Giriş Yapmış Kullanıcı:{'\n'}
            <Text style={styles.userEmail}>{user.email}</Text>
          </Text>
        </View>
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
        <Text style={styles.logoutButtonText}>Çıkış Yap</Text>
      </TouchableOpacity>
    </View>
  );
};

export default DashboardScreen;

// ---------------------------------------------------------------------
// STYLES
// ---------------------------------------------------------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F8FE', // Önceki sayfalara uyumlu pastel mavi arkaplan
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2F5D8E',
    marginBottom: 30,
    textAlign: 'center'
  },
  userInfoContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginBottom: 20,

    // iOS gölge
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 3.5,

    // Android gölge
    elevation: 3
  },
  userInfoText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center'
  },
  userEmail: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2F5D8E'
  },
  button: {
    width: '80%',
    backgroundColor: '#5A8FCB',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginVertical: 8,

    // Gölge (iOS + Android)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 3.5,
    elevation: 3
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  },
  logoutButton: {
    width: '80%',
    backgroundColor: '#ff4d4f',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 20,

    // Gölge (iOS + Android)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 3.5,
    elevation: 3
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700'
  }
});
