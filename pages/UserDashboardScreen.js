// UserDashboard.js
import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import { auth } from '../configs/firebase_config';
import { signOut } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../configs/authContext';
import { FontAwesome5 } from '@expo/vector-icons';
import { getAllUsers } from '../services/UsersService';

export default function UserDashboard() {
  const { setUser } = useContext(AuthContext);
  const navigation = useNavigation();
  const user = auth.currentUser;

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      Alert.alert('Çıkış Hatası', error.message || 'Çıkış yapılamadı.');
    }
  };

  const fetchUserData = async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    try {
      const allUsers = await getAllUsers();
      const currentUser = allUsers.find((u) => u.email === user.email);

      if (currentUser) {
        console.log('Kullanıcı Verileri:', currentUser);
        setUserData(currentUser);
      } else {
        throw new Error('Kullanıcı verileri bulunamadı.');
      }
    } catch (error) {
      console.error('Kullanıcı verileri alınırken hata:', error.message);
      Alert.alert('Hata', error.message || 'Kullanıcı verileri alınamadı.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleNavigateToTests = () => {
    if (!userData) {
      Alert.alert('Hata', 'Kullanıcı verileri henüz yüklenmedi.');
      return;
    }
    navigation.navigate('ShowUserTests', { userId: userData.id, birthDate: userData.birthDate });
  };

  const handleNavigateToProfile = () => {
    if (!userData) {
      Alert.alert('Hata', 'Kullanıcı verileri henüz yüklenmedi.');
      return;
    }
    navigation.navigate('UserProfile', { userId: userData.id });
  };

  const handleNavigateToSettings = () => {
    navigation.navigate('Settings');
  };

  const handleNavigateToNotifications = () => {
    navigation.navigate('Notifications');
  };

  const handleNavigateToHelp = () => {
    navigation.navigate('Help');
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#2F5D8E" />
        <Text style={styles.loadingText}>Veriler yükleniyor...</Text>
      </View>
    );
  }

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
        {/* "Analytics" Butonu "Tahlillerim" Olarak Değiştirildi */}
        <TouchableOpacity style={styles.gridItem} onPress={handleNavigateToTests}>
          <FontAwesome5 name="chart-bar" size={40} color="#fff" />
          <Text style={styles.gridItemText}>Tahlillerim</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.gridItem} onPress={handleNavigateToProfile}>
          <FontAwesome5 name="user-edit" size={40} color="#fff" />
          <Text style={styles.gridItemText}>Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.gridItem} onPress={handleNavigateToSettings}>
          <FontAwesome5 name="cog" size={40} color="#fff" />
          <Text style={styles.gridItemText}>Settings</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.gridItem} onPress={handleNavigateToNotifications}>
          <FontAwesome5 name="bell" size={40} color="#fff" />
          <Text style={styles.gridItemText}>Notifications</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.gridItem} onPress={handleNavigateToHelp}>
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
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 8,
    fontSize: 16,
    color: '#333',
  },
});
