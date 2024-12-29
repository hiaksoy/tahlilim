import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ScrollView
} from 'react-native';
import { updateValueInRef } from '../services/ValuesService';
import { getGuideById } from '../services/GuidesService';

const EditValuesScreen = ({ route, navigation }) => {
  const { guideId, refName, minAge, maxAge, minValue, maxValue } = route.params;

  // Ekranda gösterilen metin kutuları (newMinValue, newMaxValue)
  // Bu form değerlerini, "base" durumuna göre set edeceğiz.
  const [newMinAge, setNewMinAge] = useState(minAge?.toString() || '');
  const [newMaxAge, setNewMaxAge] = useState(maxAge?.toString() || '');

  const [newMinValue, setNewMinValue] = useState('');
  const [newMaxValue, setNewMaxValue] = useState('');

  const [base, setBase] = useState('');
  const [loading, setLoading] = useState(true);

  // 1) Kılavuzdaki "base" değerini çek
  useEffect(() => {
    const fetchGuide = async () => {
      try {
        const guide = await getGuideById(guideId);
        if (guide?.base) {
          setBase(guide.base);
          // base'e göre "ekran" değerlerini ayarla
          if (["Min - Max", "95% confidence interval"].includes(guide.base)) {
            // Normal gösterim: newMinValue = minValue, newMaxValue = maxValue
            setNewMinValue(minValue?.toString() || '');
            setNewMaxValue(maxValue?.toString() || '');
          } else {
            // "Mean ± SD" vb. durum: DB'de saklanan minValue gerçekte "realMin",
            // maxValue gerçekte "realMax" => mean ve std'yi hesapla
            const realMin = parseFloat(minValue);
            const realMax = parseFloat(maxValue);
            if (!isNaN(realMin) && !isNaN(realMax)) {
              const std = (realMax - realMin) / 2;
              const mean = realMin + std;
              setNewMinValue(mean.toString()); // Ekranda ilk kutu: Ortalama
              setNewMaxValue(std.toString());  // Ekranda ikinci kutu: Std
            }
          }
        }
      } catch (error) {
        Alert.alert('Hata', 'Kılavuz bilgileri alınamadı.');
      } finally {
        setLoading(false);
      }
    };
    fetchGuide();
  }, [guideId, minValue, maxValue]);

  // 2) "Güncelle" butonuna basılınca
  const handleUpdateGuide = async () => {
    if (!newMinAge.trim() || !newMaxAge.trim() || !newMinValue.trim() || !newMaxValue.trim()) {
      Alert.alert('Uyarı', 'Tüm alanları doldurun.');
      return;
    }

    try {
      // Eski değer
      const oldValue = { minAge, maxAge, minValue, maxValue };

      let finalMinValue = parseFloat(newMinValue);
      let finalMaxValue = parseFloat(newMaxValue);

      // 3) base'e göre "yeni" minValue / maxValue hesaplama
      if (["Min - Max", "95% confidence interval"].includes(base)) {
        // Kullanıcı direkt minValue / maxValue girdi
        // newMinValue, newMaxValue = normal (ör. 80, 120)
        finalMinValue = parseFloat(newMinValue);
        finalMaxValue = parseFloat(newMaxValue);
      } else {
        // "Mean ± SD" vb. senaryo:
        // newMinValue = mean, newMaxValue = std
        // finalMinValue = mean - std
        // finalMaxValue = mean + std
        const mean = parseFloat(newMinValue);
        const std = parseFloat(newMaxValue);
        finalMinValue = mean - std;
        finalMaxValue = mean + std;
      }

      const newValue = {
        minAge: Number(newMinAge),
        maxAge: Number(newMaxAge),
        minValue: Number(finalMinValue),
        maxValue: Number(finalMaxValue)
      };

      await updateValueInRef(guideId, refName, oldValue, newValue);
      Alert.alert('Başarılı', 'Değer güncellendi!');
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert('Hata', 'Değer güncellenemedi.');
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <Text>Yükleniyor...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Değer Düzenle</Text>

        {/* Yaş Aralığı */}
        <Text style={styles.label}>Yaş Aralığı (Alt / Üst)</Text>
        <View style={styles.row}>
          <TextInput
            style={styles.input}
            placeholder="Alt (Ay/Yaş)"
            value={newMinAge}
            onChangeText={setNewMinAge}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Üst (Ay/Yaş)"
            value={newMaxAge}
            onChangeText={setNewMaxAge}
            keyboardType="numeric"
          />
        </View>

        {/* Değer Aralığı veya (Mean, Std) */}
        <Text style={styles.label}>
          {["Min - Max", "95% confidence interval"].includes(base)
            ? "Değer Aralığı"
            : "Ortalama (İlk) ve Standart Sapma (İkinci)"}
        </Text>
        <View style={styles.row}>
          <TextInput
            style={styles.input}
            placeholder={
              ["Min - Max", "95% confidence interval"].includes(base)
                ? "Alt Sınır"
                : "Ortalama Değer (Mean)"
            }
            value={newMinValue}
            onChangeText={setNewMinValue}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder={
              ["Min - Max", "95% confidence interval"].includes(base)
                ? "Üst Sınır"
                : "Standart Sapma (SD)"
            }
            value={newMaxValue}
            onChangeText={setNewMaxValue}
            keyboardType="numeric"
          />
        </View>

        {/* Güncelle Butonu */}
        <TouchableOpacity style={styles.saveButton} onPress={handleUpdateGuide}>
          <Text style={styles.saveButtonText}>Güncelle</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default EditValuesScreen;

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
    // backgroundColor: '#F3F8FE', // istersen burayı da aynı yapabilirsin
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F8FE'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2F5D8E',
    textAlign: 'center',
    marginBottom: 20,

    // Beyaz kart görünümü
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#444',
    marginBottom: 10
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20
  },
  input: {
    height: 50,
    width: '48%',
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',

    // Hafif gölge
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1.5 },
    shadowOpacity: 0.1,
    shadowRadius: 1.8,
    elevation: 1
  },
  saveButton: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',

    // Gölge
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  }
});
