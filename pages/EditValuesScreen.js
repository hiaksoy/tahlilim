import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { getGuideById, updateGuide } from '../services/aGuidesService';

const EditValuesScreen = ({ route, navigation }) => {
  const { guideId, refName} = route.params;

  const [minAge, setMinAge] = useState('');
  const [maxAge, setMaxAge] = useState('');
  const [minValue, setMinValue] = useState('');
  const [maxValue, setMaxValue] = useState('');
  const [guide, setGuide] = useState('');

  useEffect(() => {
    const fetchGuide = async () => {
      try {
        const guide = await getGuideById(guideId);
        setGuide(guide);
        // Varsayılan değerleri al ve state'leri ayarla
        setMinAge(guide.minAge || '');
        setMaxAge(guide.maxAge || '');
        setMinValue(guide.minValue || '');
        setMaxValue(guide.maxValue || '');
      } catch (error) {
        Alert.alert('Hata', 'Kılavuz bilgileri alınamadı.');
      }
    };
    fetchGuide();
  }, [guideId]);

  const handleUpdateGuide = async () => {
    if (!minAge || !maxAge || !minValue || !maxValue) {
      Alert.alert('Uyarı', 'Tüm alanları doldurun.');
      return;
    }

    try {
      await updateGuide(guideId, { minAge, maxAge, minValue, maxValue });
      Alert.alert('Başarılı', 'Kılavuz güncellendi!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Hata', 'Kılavuz güncellenemedi.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Kılavuz Düzenle</Text>

      {/* Yaş Aralığı */}
      <Text style={styles.label}>Yaş Aralığı (Alt ve Üst Değerler)</Text>
      <View style={styles.row}>
        <TextInput
          style={styles.input}
          placeholder="Alt Değer (Yaş)"
          value={minAge}
          onChangeText={setMinAge}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Üst Değer (Yaş)"
          value={maxAge}
          onChangeText={setMaxAge}
          keyboardType="numeric"
        />
      </View>

      {/* Değer Aralığı */}
      <Text style={styles.label}>Değer Aralığı</Text>
      <View style={styles.row}>
        <TextInput
          style={styles.input}
          placeholder="Alt Sınır"
          value={minValue}
          onChangeText={setMinValue}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Üst Sınır"
          value={maxValue}
          onChangeText={setMaxValue}
          keyboardType="numeric"
        />
      </View>

      {/* Güncelleme Butonu */}
      <TouchableOpacity style={styles.saveButton} onPress={handleUpdateGuide}>
        <Text style={styles.saveButtonText}>Güncelle</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  input: {
    height: 50,
    width: '48%',
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  saveButton: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EditValuesScreen;
