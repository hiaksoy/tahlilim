import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';

const RegisterForm = () => {
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

  const handleRegister = () => {
    if (!name || !surname || !tcNo || !email || !password || !confirmPassword || !gender) {
      Alert.alert('Hata', 'Lütfen tüm alanları doldurun.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Hata', 'Şifreler eşleşmiyor.');
      return;
    }
    Alert.alert('Başarılı', 'Kayıt işlemi başarılı.');
  };

  const handleNavigateToLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Kayıt Formu</Text>
      
      {/* Adı */}
      <TextInput
        style={styles.input}
        placeholder="Adı"
        value={name}
        onChangeText={setName}
      />
      
      {/* Soyadı */}
      <TextInput
        style={styles.input}
        placeholder="Soyadı"
        value={surname}
        onChangeText={setSurname}
      />
      
      {/* TC Kimlik Numarası */}
      <TextInput
        style={styles.input}
        placeholder="TC Kimlik Numarası"
        keyboardType="numeric"
        value={tcNo}
        onChangeText={setTcNo}
        maxLength={11}
      />
      
      {/* Doğum Tarihi */}
      <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.datePicker}>
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

      {/* E-posta */}
      <TextInput
        style={styles.input}
        placeholder="E-posta"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      
      {/* Şifre */}
      <TextInput
        style={styles.input}
        placeholder="Şifre"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      
      {/* Şifre Tekrar */}
      <TextInput
        style={styles.input}
        placeholder="Şifre Tekrar"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      {/* Kayıt Butonu */}
      <Button title="Kayıt Ol" onPress={handleRegister} />

      {/* Zaten Hesabınız Var mı? */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Zaten hesabınız var mı?</Text>
        <TouchableOpacity onPress={handleNavigateToLogin}>
          <Text style={styles.loginText}>Giriş Yap</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    justifyContent: 'center'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  datePicker: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  genderButton: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginHorizontal: 5,
  },
  genderSelected: {
    backgroundColor: '#cce5ff',
  },
  footer: {
    marginTop: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#555',
  },
  loginText: {
    fontSize: 16,
    color: '#007bff',
    fontWeight: 'bold',
    marginTop: 5,
  },
});

export default RegisterForm;
