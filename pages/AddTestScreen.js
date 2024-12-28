import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { addTahlil } from '../services/aTahlillerService';
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
  const [showDegerler, setShowDegerler] = useState(true);

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
      console.log('Tahlil başarıyla eklendi');
      Alert.alert('Başarılı', 'Tahlil eklendi!');
      navigation.goBack();
    } catch (error) {
      console.error('Hata:', error.message);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Tahlil Ekle</Text>

      {/* Tahlil Bilgileri */}
      <TouchableOpacity onPress={() => setShowTahlilBilgileri(!showTahlilBilgileri)}>
        <Text style={styles.sectionTitle}>Tahlil Bilgileri</Text>
      </TouchableOpacity>
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
      <TouchableOpacity onPress={() => setShowTarihSaatBilgileri(!showTarihSaatBilgileri)}>
        <Text style={styles.sectionTitle}>Tarih ve Saat Bilgileri</Text>
      </TouchableOpacity>
      {showTarihSaatBilgileri && (
        <View style={styles.section}>
          {/* Tetkik İstem Zamanı */}
          <TouchableOpacity
            onPress={() => setShowTetkikDatePicker(true)}
            style={styles.datePicker}
          >
            <Text>
              Tetkik İstem Tarihi: {tetkikIstemZamani.toLocaleDateString()}
            </Text>
          </TouchableOpacity>
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

          <TouchableOpacity
            onPress={() => setShowTetkikTimePicker(true)}
            style={styles.datePicker}
          >
            <Text>
              Tetkik İstem Saati: {tetkikIstemZamani.toLocaleTimeString()}
            </Text>
          </TouchableOpacity>
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
          <TouchableOpacity
            onPress={() => setShowNumuneAlmaDatePicker(true)}
            style={styles.datePicker}
          >
            <Text>
              Numune Alma Tarihi: {numuneAlmaZamani.toLocaleDateString()}
            </Text>
          </TouchableOpacity>
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

          <TouchableOpacity
            onPress={() => setShowNumuneAlmaTimePicker(true)}
            style={styles.datePicker}
          >
            <Text>
              Numune Alma Saati: {numuneAlmaZamani.toLocaleTimeString()}
            </Text>
          </TouchableOpacity>
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
          <TouchableOpacity
            onPress={() => setShowNumuneKabulDatePicker(true)}
            style={styles.datePicker}
          >
            <Text>
              Numune Kabul Tarihi: {numuneKabulZamani.toLocaleDateString()}
            </Text>
          </TouchableOpacity>
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

          <TouchableOpacity
            onPress={() => setShowNumuneKabulTimePicker(true)}
            style={styles.datePicker}
          >
            <Text>
              Numune Kabul Saati: {numuneKabulZamani.toLocaleTimeString()}
            </Text>
          </TouchableOpacity>
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
          <TouchableOpacity
            onPress={() => setShowUzmanOnayDatePicker(true)}
            style={styles.datePicker}
          >
            <Text>
              Uzman Onay Tarihi: {uzmanOnayZamani.toLocaleDateString()}
            </Text>
          </TouchableOpacity>
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

          <TouchableOpacity
            onPress={() => setShowUzmanOnayTimePicker(true)}
            style={styles.datePicker}
          >
            <Text>
              Uzman Onay Saati: {uzmanOnayZamani.toLocaleTimeString()}
            </Text>
          </TouchableOpacity>
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
      <TouchableOpacity onPress={() => setShowDegerler(!showDegerler)}>
        <Text style={styles.sectionTitle}>Değerler</Text>
      </TouchableOpacity>
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
          <Button title="Değer Ekle" onPress={addDeger} />
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
    backgroundColor: '#F3F8FE' // Pastel mavi arkaplan
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
    elevation: 3
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#4CAF50',
    backgroundColor: '#e0f7fa',
    padding: 8,
    borderRadius: 5,
    // Gölge
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
    marginTop: 10
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
    elevation: 2
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
    elevation: 1
  },
  datePicker: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: '#fafafa',

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1.5 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1
  },
  dynamicRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10
  },
  pickerContainer: {
    flex: 1,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#fff'
  },
  dynamicInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#fff'
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
    elevation: 2
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold'
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
    elevation: 3
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700'
  }
});
