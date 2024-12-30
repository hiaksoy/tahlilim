import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  Button, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Alert, 
  Platform 
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { addTahlil } from '../services/TahlillerService';
import { REFS } from '../shared/consts';
import { useNavigation } from '@react-navigation/native';

const AddTestScreen = ({ route }) => {
  const { userId } = route.params;
  const navigation = useNavigation();

  // Tahlil Bilgileri State'leri
  const [raporNo, setRaporNo] = useState('');
  const [tani, setTani] = useState('');
  const [numuneTuru, setNumuneTuru] = useState('');
  const [raporGrubu, setRaporGrubu] = useState('');

  // Tarih-Saat State’leri
  const [tetkikIstemZamani, setTetkikIstemZamani] = useState(new Date());
  const [numuneAlmaZamani, setNumuneAlmaZamani] = useState(new Date());
  const [numuneKabulZamani, setNumuneKabulZamani] = useState(new Date());
  const [uzmanOnayZamani, setUzmanOnayZamani] = useState(new Date());

  // DateTimePicker görünürlük kontrolü
  const [showTetkikDatePicker, setShowTetkikDatePicker] = useState(false);
  const [showTetkikTimePicker, setShowTetkikTimePicker] = useState(false);

  const [showNumuneAlmaDatePicker, setShowNumuneAlmaDatePicker] = useState(false);
  const [showNumuneAlmaTimePicker, setShowNumuneAlmaTimePicker] = useState(false);

  const [showNumuneKabulDatePicker, setShowNumuneKabulDatePicker] = useState(false);
  const [showNumuneKabulTimePicker, setShowNumuneKabulTimePicker] = useState(false);

  const [showUzmanOnayDatePicker, setShowUzmanOnayDatePicker] = useState(false);
  const [showUzmanOnayTimePicker, setShowUzmanOnayTimePicker] = useState(false);

  // Dinamik Değerler
  const [degerler, setDegerler] = useState([{ ad: REFS[0], sonuc: '' }]);

  // Bölüm Açılır/Kapanır Durumları
  const [showTahlilBilgileri, setShowTahlilBilgileri] = useState(false);
  const [showTarihSaatBilgileri, setShowTarihSaatBilgileri] = useState(false);
  const [showDegerler, setShowDegerler] = useState(true); // İlk başta açık gelsin

  // Dinamik Değer Sil/Ekle/Güncelle
  const removeDeger = (index) => {
    const updatedDegerler = degerler.filter((_, i) => i !== index);
    setDegerler(updatedDegerler);
  };

  const addDeger = () => {
    setDegerler([...degerler, { ad: REFS[0], sonuc: '' }]);
  };

  const updateDeger = (index, key, value) => {
    const updatedDegerler = [...degerler];
    updatedDegerler[index][key] = value;
    setDegerler(updatedDegerler);
  };

  // Formu Kaydet
  const handleSubmit = async () => {
    if (degerler.length === 0) {
      Alert.alert('Uyarı', 'En az bir değer ekleyin.');
      return;
    }

    try {
      await addTahlil(
        userId,
        raporNo,
        tani,
        numuneTuru,
        raporGrubu,
        tetkikIstemZamani,
        numuneAlmaZamani,
        numuneKabulZamani,
        uzmanOnayZamani,
        degerler
      );
      Alert.alert('Başarılı', 'Tahlil eklendi!');
      navigation.goBack();
    } catch (error) {
      console.error('Hata:', error.message);
      Alert.alert('Hata', 'Tahlil eklenirken bir hata oluştu.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Tahlil Ekleme Sayfası</Text>

      {/* Tahlil Bilgileri */}
      <View style={styles.sectionHeader}>
        <TouchableOpacity 
          style={styles.sectionHeaderTextContainer} 
          onPress={() => setShowTahlilBilgileri(!showTahlilBilgileri)}
        >
          <Text style={styles.sectionHeaderText}>Tahlil Bilgileri</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.toggleButton}
          onPress={() => setShowTahlilBilgileri(!showTahlilBilgileri)}
        >
          <Text style={styles.toggleButtonText}>{showTahlilBilgileri ? '-' : '+'}</Text>
        </TouchableOpacity>
      </View>
      {showTahlilBilgileri && (
        <View style={styles.section}>
          <TextInput
            style={styles.input}
            placeholder="Rapor Numarası"
            value={raporNo}
            onChangeText={setRaporNo}
          />
          <TextInput
            style={styles.input}
            placeholder="Tanı"
            value={tani}
            onChangeText={setTani}
          />
          <TextInput
            style={styles.input}
            placeholder="Numune Türü"
            value={numuneTuru}
            onChangeText={setNumuneTuru}
          />
          <TextInput
            style={styles.input}
            placeholder="Rapor Grubu"
            value={raporGrubu}
            onChangeText={setRaporGrubu}
          />
        </View>
      )}

      {/* Tarih ve Saat Bilgileri */}
      <View style={styles.sectionHeader}>
        <TouchableOpacity 
          style={styles.sectionHeaderTextContainer} 
          onPress={() => setShowTarihSaatBilgileri(!showTarihSaatBilgileri)}
        >
          <Text style={styles.sectionHeaderText}>Tarih ve Saat Bilgileri</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.toggleButton}
          onPress={() => setShowTarihSaatBilgileri(!showTarihSaatBilgileri)}
        >
          <Text style={styles.toggleButtonText}>{showTarihSaatBilgileri ? '-' : '+'}</Text>
        </TouchableOpacity>
      </View>
      {showTarihSaatBilgileri && (
        <View style={styles.section}>
          {/* Tetkik İstem Zamanı */}
          <View style={styles.dateTimeRow}>
            <TouchableOpacity
              onPress={() => setShowTetkikDatePicker(true)}
              style={styles.dateTimePicker}
            >
              <Text>Tetkik İstem Tarihi: {tetkikIstemZamani.toLocaleDateString()}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setShowTetkikTimePicker(true)}
              style={styles.dateTimePicker}
            >
              <Text>Tetkik İstem Saati: {tetkikIstemZamani.toLocaleTimeString()}</Text>
            </TouchableOpacity>
          </View>
          {showTetkikDatePicker && (
            <DateTimePicker
              value={tetkikIstemZamani}
              mode="date"
              display="default"
              onChange={(event, date) => {
                setShowTetkikDatePicker(false);
                if (date) setTetkikIstemZamani(date);
              }}
            />
          )}
          {showTetkikTimePicker && (
            <DateTimePicker
              value={tetkikIstemZamani}
              mode="time"
              display="default"
              onChange={(event, date) => {
                setShowTetkikTimePicker(false);
                if (date) setTetkikIstemZamani(date);
              }}
            />
          )}

          {/* Numune Alma Zamanı */}
          <View style={styles.dateTimeRow}>
            <TouchableOpacity
              onPress={() => setShowNumuneAlmaDatePicker(true)}
              style={styles.dateTimePicker}
            >
              <Text>Numune Alma Tarihi: {numuneAlmaZamani.toLocaleDateString()}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setShowNumuneAlmaTimePicker(true)}
              style={styles.dateTimePicker}
            >
              <Text>Numune Alma Saati: {numuneAlmaZamani.toLocaleTimeString()}</Text>
            </TouchableOpacity>
          </View>
          {showNumuneAlmaDatePicker && (
            <DateTimePicker
              value={numuneAlmaZamani}
              mode="date"
              display="default"
              onChange={(event, date) => {
                setShowNumuneAlmaDatePicker(false);
                if (date) setNumuneAlmaZamani(date);
              }}
            />
          )}
          {showNumuneAlmaTimePicker && (
            <DateTimePicker
              value={numuneAlmaZamani}
              mode="time"
              display="default"
              onChange={(event, date) => {
                setShowNumuneAlmaTimePicker(false);
                if (date) setNumuneAlmaZamani(date);
              }}
            />
          )}

          {/* Numune Kabul Zamanı */}
          <View style={styles.dateTimeRow}>
            <TouchableOpacity
              onPress={() => setShowNumuneKabulDatePicker(true)}
              style={styles.dateTimePicker}
            >
              <Text>Numune Kabul Tarihi: {numuneKabulZamani.toLocaleDateString()}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setShowNumuneKabulTimePicker(true)}
              style={styles.dateTimePicker}
            >
              <Text>Numune Kabul Saati: {numuneKabulZamani.toLocaleTimeString()}</Text>
            </TouchableOpacity>
          </View>
          {showNumuneKabulDatePicker && (
            <DateTimePicker
              value={numuneKabulZamani}
              mode="date"
              display="default"
              onChange={(event, date) => {
                setShowNumuneKabulDatePicker(false);
                if (date) setNumuneKabulZamani(date);
              }}
            />
          )}
          {showNumuneKabulTimePicker && (
            <DateTimePicker
              value={numuneKabulZamani}
              mode="time"
              display="default"
              onChange={(event, date) => {
                setShowNumuneKabulTimePicker(false);
                if (date) setNumuneKabulZamani(date);
              }}
            />
          )}

          {/* Uzman Onay Zamanı */}
          <View style={styles.dateTimeRow}>
            <TouchableOpacity
              onPress={() => setShowUzmanOnayDatePicker(true)}
              style={styles.dateTimePicker}
            >
              <Text>Uzman Onay Tarihi: {uzmanOnayZamani.toLocaleDateString()}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setShowUzmanOnayTimePicker(true)}
              style={styles.dateTimePicker}
            >
              <Text>Uzman Onay Saati: {uzmanOnayZamani.toLocaleTimeString()}</Text>
            </TouchableOpacity>
          </View>
          {showUzmanOnayDatePicker && (
            <DateTimePicker
              value={uzmanOnayZamani}
              mode="date"
              display="default"
              onChange={(event, date) => {
                setShowUzmanOnayDatePicker(false);
                if (date) setUzmanOnayZamani(date);
              }}
            />
          )}
          {showUzmanOnayTimePicker && (
            <DateTimePicker
              value={uzmanOnayZamani}
              mode="time"
              display="default"
              onChange={(event, date) => {
                setShowUzmanOnayTimePicker(false);
                if (date) setUzmanOnayZamani(date);
              }}
            />
          )}
        </View>
      )}

      {/* Dinamik Değerler */}
      <View style={styles.sectionHeader}>
        <TouchableOpacity 
          style={styles.sectionHeaderTextContainer} 
          onPress={() => setShowDegerler(!showDegerler)}
        >
          <Text style={styles.sectionHeaderText}>Değerler</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.toggleButton}
          onPress={() => setShowDegerler(!showDegerler)}
        >
          <Text style={styles.toggleButtonText}>{showDegerler ? '-' : '+'}</Text>
        </TouchableOpacity>
      </View>
      {showDegerler && (
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
              {/* Silme butonu */}
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => removeDeger(index)}
              >
                <Text style={styles.deleteButtonText}>-</Text>
              </TouchableOpacity>
            </View>
          ))}
          <TouchableOpacity style={styles.addValueButton} onPress={addDeger}>
            <Text style={styles.addValueButtonText}>Aranacak Değer Sayısını Arttır</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Kaydet Butonu */}
      <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
        <Text style={styles.saveButtonText}>Tahlil Ekle</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default AddTestScreen;

// ---------------------------------------------------------------------
// STYLES
// ---------------------------------------------------------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F3F8FE', // Pastel mavi arkaplan
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#2F5D8E',
    // Beyaz kart görünümlü başlık
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderRadius: 8,
    // Gölge
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3.5,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10, // Bölümler arası boşluk
  },
  sectionHeaderTextContainer: {
    flex: 1,
  },
  sectionHeaderText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2F5D8E',
  },
  toggleButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#28a745',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10, // Buton ile metin arasına boşluk
  },
  toggleButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,

    // Gölge
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: '#fff',

    // Gölge hafif
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1.5,
    elevation: 1,
  },
  dateTimeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  dateTimePicker: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginRight: 5,
    backgroundColor: '#fafafa',

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1.5 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  pickerContainer: {
    flex: 1,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  dynamicRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  dynamicInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  deleteButton: {
    backgroundColor: '#f44336',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,

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
  saveButton: {
    backgroundColor: '#388e3c',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginVertical: 20,

    // Gölge
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3.5,
    elevation: 3,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
