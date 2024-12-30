// ProfileScreen.js
import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Modal
} from 'react-native';
import { AuthContext } from '../configs/authContext';
import { getAllUsers } from '../services/UsersService';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../configs/firebase_config';
import DateTimePicker from '@react-native-community/datetimepicker';
import { auth } from '../configs/firebase_config';
import {
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential
} from 'firebase/auth';

const parseDateString = (dateString) => {
  if (!dateString) return new Date();
  const [day, month, year] = dateString.split('.');
  if (!day || !month || !year) return new Date();
  return new Date(`${year}-${month}-${day}`);
};

const UserProfileScreen = ({ route, navigation }) => {
  const { userId } = route.params;
  const { user } = useContext(AuthContext);

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Profil bilgileri için state'ler
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [tcNo, setTcNo] = useState('');
  const [gender, setGender] = useState('');
  const [email, setEmail] = useState('');
  const [birthDate, setBirthDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Şifre değiştirme modalı için state'ler
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

  const fetchUserData = async () => {
    try {
      const allUsers = await getAllUsers();
      const currentUser = allUsers.find((u) => u.id === userId);

      if (currentUser) {
        setUserData(currentUser);
        setName(currentUser.name || '');
        setSurname(currentUser.surname || '');
        setTcNo(currentUser.tcNo || '');
        setGender(currentUser.gender || '');
        setEmail(currentUser.email || '');
        setBirthDate(parseDateString(currentUser.birthDate));
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

  const handleUpdateProfile = async () => {
    if (!name || !surname || !tcNo || !gender) {
      Alert.alert('Hata', 'Lütfen tüm alanları doldurun.');
      return;
    }

    try {
      // Firestore'da kullanıcı belgesini güncelle
      const userDocRef = doc(db, 'Kullanıcılar', userId);
      await updateDoc(userDocRef, {
        name,
        surname,
        tcNo,
        gender,
        email,
        birthDate: birthDate.toLocaleDateString()
      });

      // Firebase Authentication'da e-posta güncelleme
      if (email !== user.email) {
        await auth.currentUser.updateEmail(email);
      }

      Alert.alert('Başarılı', 'Profiliniz başarıyla güncellendi.');
      navigation.goBack();
    } catch (error) {
      console.error('Profil güncelleme hatası:', error.message);
      Alert.alert('Güncelleme Hatası', error.message || 'Profil güncellenirken bir hata oluştu.');
    }
  };

  const handleNavigateToChangePassword = () => {
    setShowChangePasswordModal(true);
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      Alert.alert('Hata', 'Lütfen tüm alanları doldurun.');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      Alert.alert('Hata', 'Yeni şifreleriniz eşleşmiyor.');
      return;
    }

    setPasswordLoading(true);

    try {
      // Kullanıcının kimliğini doğrulamak için eski şifre ile yeniden kimlik doğrulama
      const credential = EmailAuthProvider.credential(
        auth.currentUser.email,
        currentPassword
      );

      await reauthenticateWithCredential(auth.currentUser, credential);

      // Şifreyi güncelle
      await updatePassword(auth.currentUser, newPassword);

      Alert.alert('Başarılı', 'Şifreniz başarıyla değiştirildi.');
      setShowChangePasswordModal(false);
      // Şifre değişikliğinden sonra formu temizlemek isterseniz aşağıdaki satırları kullanabilirsiniz:
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (error) {
      console.error('Şifre değiştirme hatası:', error.message);
      Alert.alert('Hata', error.message || 'Şifre değiştirilirken bir hata oluştu.');
    } finally {
      setPasswordLoading(false);
    }
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
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Profilinizi Düzenleyin</Text>

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

      <TextInput
        style={styles.input}
        placeholder="E-posta"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
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

      {/* Güncelleme Butonları */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.saveButton} onPress={handleUpdateProfile}>
          <Text style={styles.saveButtonText}>Kaydet</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
          <Text style={styles.cancelButtonText}>İptal</Text>
        </TouchableOpacity>
      </View>

      {/* Şifreyi Değiştir Butonu */}
      <TouchableOpacity style={styles.changePasswordButton} onPress={handleNavigateToChangePassword}>
        <Text style={styles.changePasswordButtonText}>Şifreyi Değiştir</Text>
      </TouchableOpacity>

      {/* Şifre Değiştirme Modalı */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showChangePasswordModal}
        onRequestClose={() => {
          setShowChangePasswordModal(false);
          // Formu temizlemek isterseniz aşağıdaki satırları kullanabilirsiniz:
          setCurrentPassword('');
          setNewPassword('');
          setConfirmNewPassword('');
        }}
      >
        <ScrollView contentContainerStyle={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Şifrenizi Değiştirin</Text>

            <TextInput
              style={styles.modalInput}
              placeholder="Mevcut Şifre"
              secureTextEntry
              value={currentPassword}
              onChangeText={setCurrentPassword}
            />

            <TextInput
              style={styles.modalInput}
              placeholder="Yeni Şifre"
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
            />

            <TextInput
              style={styles.modalInput}
              placeholder="Yeni Şifre (Tekrar)"
              secureTextEntry
              value={confirmNewPassword}
              onChangeText={setConfirmNewPassword}
            />

            <View style={styles.modalButtonsContainer}>
              <TouchableOpacity style={styles.saveButtonModal} onPress={handleChangePassword}>
                {passwordLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.saveButtonTextModal}>Kaydet</Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButtonModal}
                onPress={() => {
                  setShowChangePasswordModal(false);
                  // Formu temizlemek isterseniz aşağıdaki satırları kullanabilirsiniz:
                  setCurrentPassword('');
                  setNewPassword('');
                  setConfirmNewPassword('');
                }}
              >
                <Text style={styles.cancelButtonTextModal}>İptal</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </Modal>
    </ScrollView>
  );
};

export default UserProfileScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
    justifyContent: 'center',
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
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginRight: 10,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#ccc',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginLeft: 10,
  },
  cancelButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
  changePasswordButton: {
    marginTop: 30,
    backgroundColor: '#FF9800',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  changePasswordButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  // Modal Stilleri
  modalContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)', // Arka planı yarı şeffaf yap
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2F5D8E',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginBottom: 15,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  modalButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  saveButtonModal: {
    flex: 1,
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginRight: 10,
  },
  saveButtonTextModal: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButtonModal: {
    flex: 1,
    backgroundColor: '#ccc',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginLeft: 10,
  },
  cancelButtonTextModal: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
});
