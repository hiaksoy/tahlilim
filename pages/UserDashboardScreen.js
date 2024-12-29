import React, { useContext } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { auth } from '../configs/firebase_config';
import { signOut } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../configs/authContext';
import { FontAwesome5 } from '@expo/vector-icons';

export default function UserDashboard() {
  const { setUser } = useContext(AuthContext); // AuthContext'ten setUser al
  const navigation = useNavigation();
  const user = auth.currentUser; // Firebase'den mevcut kullanıcı bilgisi

  const handleLogout = async () => {
    try {
      await signOut(auth); // Firebase'den çıkış yap
      setUser(null); // Kullanıcıyı sıfırla
    } catch (error) {
      Alert.alert('Çıkış Hatası', error.message || 'Çıkış yapılamadı.');
    }
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

      {/* Grid Butonları */}
      <View style={styles.gridContainer}>
        <TouchableOpacity style={styles.gridItem}>
          <FontAwesome5 name="home" size={40} color="#fff" />
          <Text style={styles.gridItemText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.gridItem}>
          <FontAwesome5 name="user" size={40} color="#fff" />
          <Text style={styles.gridItemText}>Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.gridItem}>
          <FontAwesome5 name="cog" size={40} color="#fff" />
          <Text style={styles.gridItemText}>Settings</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.gridItem}>
          <FontAwesome5 name="bell" size={40} color="#fff" />
          <Text style={styles.gridItemText}>Notifications</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.gridItem}>
          <FontAwesome5 name="chart-bar" size={40} color="#fff" />
          <Text style={styles.gridItemText}>Analytics</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.gridItem}>
          <FontAwesome5 name="question-circle" size={40} color="#fff" />
          <Text style={styles.gridItemText}>Help</Text>
        </TouchableOpacity>
      </View>

      {/* Çıkış Yap Butonu */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Çıkış Yap</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
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
    bottom: 30, // Butonu yukarı taşımak için ayarlandı
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
    fontWeight: 'bold',
  },
});
