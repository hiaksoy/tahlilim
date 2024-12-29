import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { auth } from '../configs/firebase_config';
import { signOut } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../configs/authContext';
import { FontAwesome5 } from '@expo/vector-icons';

const AdminDashboardScreen = () => {
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

      <View style={styles.gridContainer}>
        <TouchableOpacity style={styles.gridItem} onPress={goToFastSearch}>
          <FontAwesome5 name="search" size={40} color="#fff" />
          <Text style={styles.gridItemText}>Hızlı Arama</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.gridItem} onPress={goToGuides}>
          <FontAwesome5 name="book" size={40} color="#fff" />
          <Text style={styles.gridItemText}>Kılavuzlar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.gridItem} onPress={goToUsers}>
          <FontAwesome5 name="users" size={40} color="#fff" />
          <Text style={styles.gridItemText}>Kullanıcılar</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Çıkış Yap</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AdminDashboardScreen;

// ---------------------------------------------------------------------
// STYLES
// ---------------------------------------------------------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F8FE',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2F5D8E',
    marginBottom: 20,
    textAlign: 'center',
  },
  userInfoContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 3.5,
    elevation: 3,
  },
  userInfoText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  userEmail: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2F5D8E',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  gridItem: {
    width: '45%',
    backgroundColor: '#5A8FCB',
    borderRadius: 12,
    alignItems: 'center',
    paddingVertical: 20,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  gridItemText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 10,
    textAlign: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 30, // Butonun yukarı taşınması için ayarlandı
    width: '100%',
    alignItems: 'center',
  },
  logoutButton: {
    width: '90%',
    backgroundColor: '#ff4d4f',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 3.5,
    elevation: 3,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
