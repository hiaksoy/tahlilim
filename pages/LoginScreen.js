import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { loginUser, registerUser } from '../services/authService';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../configs/authContext'; // AuthContext'i içeri aktarıyoruz

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();
  const { setUser } = useContext(AuthContext); // AuthContext'ten setUser'ı alıyoruz

  const handleLogin = async () => {
    try {
      const user = await loginUser(email, password);
      // Alert.alert('Başarılı Giriş', `Hoşgeldiniz, ${user.email}`);

      // Kullanıcı bilgisini güncelle
      setUser(user);

      // RootNavigation'a geçiş yap
      // navigation.reset({
      //   index: 0,
      //   routes: [{ name: 'RootNavigation' }], // Doğru ekran adı olduğundan emin olun
      // });
    } catch (error) {
      Alert.alert('Giriş Hatası', error.message || 'Bir hata oluştu.');
    }
  };

  const handleRegister = async () => {
    try {
      const user = await registerUser(email, password);
      Alert.alert('Başarılı Kayıt', `Hesap oluşturuldu: ${user.email}`);
    } catch (error) {
      Alert.alert('Kayıt Hatası', error.message || 'Bir hata oluştu.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Firebase Login</Text>
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
  loginLink: {
    textAlign: 'center',
    marginTop: 15,
    color: '#007BFF',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#333',
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
});

export default LoginScreen;
