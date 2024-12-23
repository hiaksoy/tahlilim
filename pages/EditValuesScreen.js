import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { updateValueInRef } from '../services/aValuesService';
import { getGuideById } from '../services/aGuidesService';

const EditValuesScreen = ({ route, navigation }) => {
  const { guideId, refName, minAge, maxAge, minValue, maxValue } = route.params;

  const [newMinAge, setNewMinAge] = useState(minAge?.toString() || '');
  const [newMaxAge, setNewMaxAge] = useState(maxAge?.toString() || '');
  const [newMinValue, setNewMinValue] = useState(minValue?.toString() || '');
  const [newMaxValue, setNewMaxValue] = useState(maxValue?.toString() || '');
  
  const [oldMinAge, setOldMinAge] = useState(minAge);
  const [oldMaxAge, setOldMaxAge] = useState(maxAge);
  const [oldMinValue, setOldMinValue] = useState(minValue);
  const [oldMaxValue, setOldMaxValue] = useState(maxValue);

  const [base, setBase] = useState({});

  useEffect(() => {
    const fetchGuide = async () => {
      try {
        const guide = await getGuideById(guideId);
        setBase(guide.base);
      } catch (error) {
        Alert.alert('Hata', 'Kılavuz bilgileri alınamadı.');
      }
    };
    fetchGuide();
  }, [guideId]);

  const handleUpdateGuide = async () => {
    if (
      !newMinAge?.trim() || 
      !newMaxAge?.trim() || 
      !newMinValue?.trim() || 
      !newMaxValue?.trim()
    ) {
      Alert.alert('Uyarı', 'Tüm alanları doldurun.');
      return;
    }
  
    try {
      const oldValue = { minAge, maxAge, minValue, maxValue };
      const newValue = { 
        minAge: Number(newMinAge), 
        maxAge: Number(newMaxAge), 
        minValue: Number(newMinValue), 
        maxValue: Number(newMaxValue) 
      };
  
      await updateValueInRef(guideId, refName, oldValue, newValue);
      Alert.alert('Başarılı', 'Kılavuz güncellendi!');
      navigation.goBack();
    } catch (error) {
      console.error(error);
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
          value={newMinAge}
          onChangeText={setNewMinAge}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Üst Değer (Yaş)"
          value={newMaxAge}
          onChangeText={setNewMaxAge}
          keyboardType="numeric"
        />
      </View>

      {/* Değer Aralığı */}
      <Text style={styles.label}>Değer Aralığı</Text>
      <View style={styles.row}>
        <TextInput
          style={styles.input}
          placeholder={["Min - Max", "95% confidence interval"].includes(base) ? "Alt Sınır" : "Ortalama Değer"}
          value={newMinValue}
          onChangeText={setNewMinValue}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder={["Min - Max", "95% confidence interval"].includes(base) ? "Üst Sınır" : "Standart Sapma Değeri"}
          value={newMaxValue}
          onChangeText={setNewMaxValue}
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
