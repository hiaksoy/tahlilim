import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
  ScrollView
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import { registerUser } from '../services/authService';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../configs/firebase_config';

const RegisterScreen = () => {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [tcNo, setTcNo] = useState('');
  const [birthDate, setBirthDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [gender, setGender] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const navigation = useNavigation();

  const handleRegister = async () => {
    // if (!name || !surname || !tcNo || !email || !password || !confirmPassword || !gender) {
    //   Alert.alert('Hata', 'Lütfen tüm alanları doldurun.');
    //   return;
    // }

    // if (password !== confirmPassword) {
    //   Alert.alert('Hata', 'Şifreler eşleşmiyor.');
    //   return;
    // }

    try {
      // Firebase Authentication ile kullanıcı kaydı
      const userCredential = await registerUser(email, password);
      const user = userCredential.user;

      const newUser = {
        name,
        surname,
        tcNo,
        birthDate: birthDate.toLocaleDateString(),
        gender,
        email,
        role: 'user',
        createdAt: new Date()
      };

      // Firestore'da kullanıcının bilgilerini kaydet
      await addDoc(collection(db, 'Kullanıcılar'), { ...newUser });

      Alert.alert('Başarılı', 'Kayıt işlemi başarılı.');
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert('Kayıt Hatası', error.message || 'Bir hata oluştu.');
    }
  };

  const handleNavigateToLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Kayıt Formu</Text>

        <TextInput
          style={styles.input}
          placeholder="Adı"
          value={name}
          onChangeText={setName}
        />

        <TextInput
          style={styles.input}
          placeholder="Soyadı"
          value={surname}
          onChangeText={setSurname}
        />

        <TextInput
          style={styles.input}
          placeholder="TC Kimlik Numarası"
          keyboardType="numeric"
          value={tcNo}
          onChangeText={setTcNo}
          maxLength={11}
        />

        {/* Doğum Tarihi */}
        <TouchableOpacity
          onPress={() => setShowDatePicker(true)}
          style={styles.datePicker}
        >
          <Text>Doğum Tarihi: {birthDate.toLocaleDateString()}</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={birthDate}
            mode="date"
            display="default"
            onChange={(event, date) => {
              setShowDatePicker(false);
              if (date) setBirthDate(date);
            }}
          />
        )}

        {/* Cinsiyet */}
        <View style={styles.genderContainer}>
          <TouchableOpacity
            style={[styles.genderButton, gender === 'Erkek' && styles.genderSelected]}
            onPress={() => setGender('Erkek')}
          >
            <Text>Erkek</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.genderButton, gender === 'Kadın' && styles.genderSelected]}
            onPress={() => setGender('Kadın')}
          >
            <Text>Kadın</Text>
          </TouchableOpacity>
        </View>

        <TextInput
          style={styles.input}
          placeholder="E-posta"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={styles.input}
          placeholder="Şifre"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TextInput
          style={styles.input}
          placeholder="Şifre Tekrar"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
          <Text style={styles.registerButtonText}>Kayıt Ol</Text>
        </TouchableOpacity>

        {/* Zaten Hesabınız Var mı? */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Zaten hesabınız var mı?</Text>
          <TouchableOpacity onPress={handleNavigateToLogin}>
            <Text style={styles.loginText}>Giriş Yap</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default RegisterScreen;

// ---------------------------------------------------------------------
// STYLES
// ---------------------------------------------------------------------
const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#F3F8FE' // Pastel mavi arka plan
  },
  container: {
    flex: 1,
    padding: 20,
    // Arka plan rengi = scrollContainer’da set edildi, 
    // burayı da istersen '#F3F8FE' yapabilirsin
    backgroundColor: 'transparent',
    justifyContent: 'center'
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2F5D8E',
    textAlign: 'center',
    marginBottom: 20,

    // Beyaz kart görünümü
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: '#fff',

    // Gölge
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1.5 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1
  },
  datePicker: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: '#fff',

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1.5 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1
  },
  genderContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    justifyContent: 'space-between'
  },
  genderButton: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginHorizontal: 5,
    backgroundColor: '#fff',

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1.5 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1
  },
  genderSelected: {
    backgroundColor: '#cce5ff'
  },
  registerButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',

    // Gölge
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3.5,
    elevation: 3
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  },
  footer: {
    marginTop: 20,
    alignItems: 'center'
  },
  footerText: {
    fontSize: 14,
    color: '#555'
  },
  loginText: {
    fontSize: 16,
    color: '#007bff',
    fontWeight: 'bold',
    marginTop: 5
  }
});
