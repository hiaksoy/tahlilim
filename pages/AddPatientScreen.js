// AddPatientScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth, db } from '../configs/firebase_config';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { addDoc, collection } from 'firebase/firestore';
import DateTimePicker from '@react-native-community/datetimepicker';

const AddPatientScreen = () => {
  const navigation = useNavigation();

  // Form alanları için state'ler
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [tcNo, setTcNo] = useState('');
  const [gender, setGender] = useState('');
  const [birthDate, setBirthDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);

  const handleAddPatient = async () => {
    // Form validasyonu
    if (!name || !surname || !tcNo || !gender || !email || !password) {
      Alert.alert('Hata', 'Lütfen tüm alanları doldurun.');
      return;
    }

    if (tcNo.length !== 11) {
      Alert.alert('Hata', 'TC Kimlik Numarası 11 haneli olmalıdır.');
      return;
    }

    setLoading(true);

    try {
      // Firebase Authentication'da kullanıcı oluştur
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Firestore'a yeni hasta ekle (otomatik ID)
      await addDoc(collection(db, 'Kullanıcılar'), {
        name,
        surname,
        tcNo,
        gender,
        birthDate: birthDate.toLocaleDateString(),
        email,
        role: 'user'
      });

      Alert.alert('Başarılı', 'Hasta başarıyla eklendi.');
      navigation.goBack();
    } catch (error) {
      console.error('Hasta ekleme hatası:', error.message);
      Alert.alert('Hata', error.message || 'Hasta eklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Hasta Ekle</Text>

      <TextInput
        style={styles.input}
        placeholder="Adınız"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Soyadınız"
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

      {/* Doğum Tarihi */}
      <TouchableOpacity
        onPress={() => setShowDatePicker(true)}
        style={styles.datePickerButton}
      >
        <Text style={styles.datePickerText}>
          Doğum Tarihi: {birthDate ? birthDate.toLocaleDateString() : 'Seçiniz'}
        </Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={birthDate || new Date()}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) {
              setBirthDate(selectedDate);
            }
          }}
        />
      )}

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

      <TouchableOpacity style={styles.addButton} onPress={handleAddPatient}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.addButtonText}>Ekle</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

export default AddPatientScreen;

// ---------------------------------------------------------------------
// STYLES
// ---------------------------------------------------------------------
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F3F8FE', // Pastel mavi arka plan
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2F5D8E',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  genderContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    justifyContent: 'space-between',
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
  },
  genderSelected: {
    backgroundColor: '#cce5ff',
  },
  datePickerButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#fff',
    marginBottom: 10,
    justifyContent: 'center',
  },
  datePickerText: {
    fontSize: 16,
    color: '#333',
  },
  addButton: {
    backgroundColor: '#28a745', // Yeşil renk
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
