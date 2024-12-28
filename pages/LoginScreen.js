import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ScrollView,
  StatusBar,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { loginUser } from '../services/authService';
import { AuthContext } from '../configs/authContext';

// HomeScreen benzeri kod için gereken importlar
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { db } from '../configs/firebase_config';
import { collection, getDocs } from 'firebase/firestore';
import { REFS } from '../shared/consts';

const LoginScreen = () => {
  // ----------------------------------------------------------------------------
  // 1) LOGIN FORM İLE İLGİLİ STATE’LER
  // ----------------------------------------------------------------------------
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setUser } = useContext(AuthContext);
  const navigation = useNavigation();

  const handleLogin = async () => {
    try {
      const user = await loginUser(email, password);
      Alert.alert('Başarılı Giriş', `Hoşgeldiniz, ${user.email}`);
      setUser(user);
      // Eğer giriş sonrası başka sayfaya yönlendirmek isterseniz:
      // navigation.reset({ index: 0, routes: [{ name: 'RootNavigation' }] });
    } catch (error) {
      Alert.alert('Giriş Hatası', error.message || 'Bir hata oluştu.');
    }
  };

  // ----------------------------------------------------------------------------
  // 2) HIZLI ARAMA (HOME SCREEN) İLE İLGİLİ STATE’LER
  // ----------------------------------------------------------------------------
  const [degerler, setDegerler] = useState([{ ad: REFS[0], sonuc: '' }]);
  const [dogumTarihi, setDogumTarihi] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [sonuclar, setSonuclar] = useState([]);

  // ----------------------------------------------------------------------------
  // 3) HIZLI ARAMA İÇİN GEREKLİ FONKSİYONLAR
  // ----------------------------------------------------------------------------
  const acDatePicker = () => {
    setShowDatePicker(true);
  };

  const parseCommaFloat = (val) => {
    if (val === null || val === undefined) return NaN;
    return parseFloat(String(val).replace(',', '.'));
  };

  const handleDateChange = (event, selectedDate) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (selectedDate) {
      setDogumTarihi(selectedDate);
    }
  };

  const updateDeger = (index, key, value) => {
    const updatedDegerler = [...degerler];
    updatedDegerler[index][key] = value;
    setDegerler(updatedDegerler);
  };

  const removeDeger = (index) => {
    const updatedDegerler = degerler.filter((_, i) => i !== index);
    setDegerler(updatedDegerler);
  };

  const addDeger = () => {
    setDegerler([...degerler, { ad: REFS[0], sonuc: '' }]);
  };

  // Ad bazında gruplama
  const groupByAd = (results) => {
    return results.reduce((groups, item) => {
      const group = groups[item.ad] || [];
      group.push(item);
      groups[item.ad] = group;
      return groups;
    }, {});
  };

  // Yaş hesaplaması (ay cinsinden)
  const hesaplaAyOlarakYas = (bugun, dt) => {
    const yilFarki = bugun.getFullYear() - dt.getFullYear();
    const ayFarki = bugun.getMonth() - dt.getMonth();
    return yilFarki * 12 + ayFarki;
  };

  // "Sorgula" butonuna basılınca
  const sorgula = async () => {
    if (!dogumTarihi) {
      alert('Lütfen doğum tarihi seçiniz.');
      return;
    }
    try {
      const snapshot = await getDocs(collection(db, 'Kılavuzlar'));
      let tempResults = [];

      snapshot.forEach((docSnap) => {
        const kilavuzData = docSnap.data();
        if (!kilavuzData.Degerler) return;

        degerler.forEach(({ ad, sonuc }) => {
          const sonucFloat = parseCommaFloat(sonuc);
          if (isNaN(sonucFloat)) return;

          if (kilavuzData.Degerler[ad]) {
            const arrayNesneler = kilavuzData.Degerler[ad];
            const bugun = new Date();
            const ayFarki = hesaplaAyOlarakYas(bugun, dogumTarihi);

            arrayNesneler.forEach((item) => {
              const minVal = parseCommaFloat(item.minValue);
              const maxVal = parseCommaFloat(item.maxValue);
              const minAge = parseFloat(item.minAge);
              const maxAge = parseFloat(item.maxAge);

              if (ayFarki >= minAge && ayFarki <= maxAge) {
                let status = 'Normal';
                if (sonucFloat < minVal) {
                  status = 'Düşük';
                } else if (sonucFloat > maxVal) {
                  status = 'Yüksek';
                }

                tempResults.push({
                  ad,
                  sonucGirilen: sonuc,
                  minValue: minVal,
                  maxValue: maxVal,
                  status,
                  kilavuzAdi: kilavuzData.title || docSnap.id,
                });
              }
            });
          }
        });
      });

      setSonuclar(tempResults);
    } catch (err) {
      console.error('Sorgu hatası:', err);
      alert('Sorgu yapılırken bir hata oluştu.');
    }
  };

  // Duruma göre arka plan rengi
  const getStatusBgColor = (status) => {
    switch (status) {
      case 'Normal':
        return '#E7F6E7'; // pastel yeşil
      case 'Düşük':
        return '#FFF8DB'; // pastel sarı
      case 'Yüksek':
        return '#FFE5E5'; // pastel kırmızı
      default:
        return '#f1f8e9'; // varsayılan yeşilimsi
    }
  };

  // ----------------------------------------------------------------------------
  // 4) EKRANIN RENDER’I
  // ----------------------------------------------------------------------------
  return (
    <View style={styles.safeArea}>
      <StatusBar backgroundColor="#F3F8FE" barStyle="dark-content" />

      <ScrollView style={styles.mainScrollView}>

        {/* ------------------------------------------------------------- */}
        {/* LOGIN FORMUNU AÇ / KAPAT BUTONU */}
        {/* ------------------------------------------------------------- */}
        <TouchableOpacity
          style={styles.loginToggleButton}
          onPress={() => setShowLoginForm(!showLoginForm)}
        >
          <Text style={styles.loginToggleButtonText}>
            {showLoginForm ? 'Kullanıcı Girişini Kapat' : 'Kullanıcı Girişini Aç'}
          </Text>
        </TouchableOpacity>

        {/* ------------------------------------------------------------- */}
        {/* LOGIN FORMU (showLoginForm true ise göster) */}
        {/* ------------------------------------------------------------- */}
        {showLoginForm && (
          <View style={styles.loginContainer}>
            <Text style={styles.title}>Giriş Yap</Text>
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
        )}

        {/* ------------------------------------------------------------- */}
        {/* BURADAN SONRA "HIZLI ARAMA" (HomeScreen) KODU */}
        {/* ------------------------------------------------------------- */}
        <Text style={styles.sectionTitle}>Hızlı Arama</Text>

        {/* Doğum Tarihi Seçme */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.datePickerButton} onPress={acDatePicker}>
            <Text style={styles.datePickerButtonText}>
              {dogumTarihi
                ? `Doğum Tarihi: ${dogumTarihi.toLocaleDateString()}`
                : 'Doğum Tarihi Seçiniz'}
            </Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={dogumTarihi || new Date()}
              mode="date"
              maximumDate={new Date()}
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleDateChange}
              style={{ marginTop: 12 }}
            />
          )}
        </View>

        {/* Değer Ekleme Alanı */}
        <View style={styles.section}>
          {degerler.map((deger, index) => (
            <View key={index} style={styles.dynamicRow}>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={deger.ad}
                  onValueChange={(value) => updateDeger(index, 'ad', value)}
                >
                  {REFS.map((ref, i) => (
                    <Picker.Item key={i} label={ref} value={ref} />
                  ))}
                </Picker>
              </View>

              <TextInput
                style={styles.dynamicInput}
                placeholder="Sonuç"
                value={deger.sonuc}
                onChangeText={(value) => updateDeger(index, 'sonuc', value)}
              />

              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => removeDeger(index)}
              >
                <Text style={styles.deleteButtonText}>-</Text>
              </TouchableOpacity>
            </View>
          ))}
          <TouchableOpacity style={styles.addValueButton} onPress={addDeger}>
            <Text style={styles.addValueButtonText}>Değer Ekle</Text>
          </TouchableOpacity>
        </View>

        {/* Sorgu Butonu */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.queryButton} onPress={sorgula}>
            <Text style={styles.queryButtonText}>Sorgula</Text>
          </TouchableOpacity>
        </View>

        {/* Sonuçları Gösterme Alanı */}
        {sonuclar.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.resultTitle}>Sonuçlar</Text>
            {Object.entries(groupByAd(sonuclar)).map(([ad, items]) => (
              <View key={ad} style={styles.resultGroup}>
                <Text style={styles.resultGroupTitle}>{ad}</Text>
                {items.map((item, idx) => (
                  // Her sonucun arka planı "Normal / Düşük / Yüksek" durumuna göre
                  <View
                    key={idx}
                    style={[
                      styles.resultItem,
                      { backgroundColor: getStatusBgColor(item.status) },
                    ]}
                  >
                    <Text>Girilen Değer: {item.sonucGirilen}</Text>
                    <Text>
                      Referans Aralık: {item.minValue} - {item.maxValue}
                    </Text>
                    <Text>Durum: {item.status}</Text>
                    <Text>Kılavuz: {item.kilavuzAdi}</Text>
                    {idx !== items.length - 1 && (
                      <View style={styles.resultDivider} />
                    )}
                  </View>
                ))}
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

// ----------------------------------------------------------------------------
// STYLES
// ----------------------------------------------------------------------------
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F3F8FE', // Ana arka plan (pastel mavi)
    paddingTop: 0,
  },
  mainScrollView: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F3F8FE',
  },

  // LOGIN FORM İLE İLGİLİ STYLES
  loginToggleButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  loginToggleButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  loginContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,

    // Gölge
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
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
  loginLink: {
    textAlign: 'center',
    color: '#007BFF',
    fontWeight: 'bold',
  },

  // HIZLI ARAMA (HomeScreen) İLE İLGİLİ STYLES
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2F5D8E',
    marginBottom: 10,
    alignSelf: 'center',
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 10,
    // Gölge
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
  section: {
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    // Gölge
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  datePickerButton: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fafafa',
  },
  datePickerButtonText: {
    fontSize: 16,
    color: '#333',
  },
  dynamicRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  pickerContainer: {
    flex: 1,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  dynamicInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 8,
    height: 50,
  },
  deleteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f44336',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    // Gölge
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  addValueButton: {
    marginTop: 8,
    backgroundColor: '#5A8FCB',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',

    // Gölge
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3.5,
    elevation: 3,
  },
  addValueButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  queryButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',

    // Gölge
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3.5,
    elevation: 3,
  },
  queryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  resultGroup: {
    marginBottom: 20,
    padding: 12,
    backgroundColor: '#f1f8e9',
    borderRadius: 10,
    // Gölge
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  resultGroupTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 8,
    color: '#388e3c',
  },
  resultItem: {
    marginBottom: 10,
    padding: 8,
    borderRadius: 6,
  },
  resultDivider: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 8,
  },
});

export default LoginScreen;
