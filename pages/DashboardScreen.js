import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { auth } from '../configs/firebase_config'; // Firebase auth modülünü içe aktar
import { signOut } from 'firebase/auth'; // Çıkış yapmak için gerekli fonksiyon
import { useNavigation } from '@react-navigation/native'; // Yönlendirme için gerekli

const DashboardScreen = () => {
  // Firebase'den mevcut kullanıcı bilgilerini al
  const user = auth.currentUser;
  
  const navigation = useNavigation();


  const handleLogout = async () => {
    try {
      await signOut(auth);
      Alert.alert('Başarılı Çıkış', 'Çıkış yapıldı!');
      navigation.navigate('Login'); // Giriş sonrası yönlendirme
      // Burada yönlendirme yapabilirsiniz, örneğin login sayfasına
    } catch (error) {
      Alert.alert('Çıkış Hatası', error.message || 'Çıkış yapılamadı.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hoşgeldiniz</Text>
      {user && (
        <Text style={styles.email}>
          {`Giriş Yapmış Kullanıcı: ${user.email}`}
        </Text>
      )}
      <TouchableOpacity style={styles.button} onPress={handleLogout}>
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
    marginBottom: 40,
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
    backgroundColor: '#ff4d4f',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default DashboardScreen;
