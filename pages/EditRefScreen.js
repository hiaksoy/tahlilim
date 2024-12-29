import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, FlatList, } from 'react-native';
import { addValuesToRef, getAllRefsWithValues } from '../services/ReferencesService';
import { getGuideById } from '../services/GuidesService';
import { removeValueFromRef } from '../services/ValuesService';
import { useFocusEffect } from '@react-navigation/native'; // Import useFocusEffect

const EditGuideScreen = ({ route, navigation }) => {
  const { guideId, refName } = route.params;

  const [minAge, setMinAge] = useState('');
  const [maxAge, setMaxAge] = useState('');
  const [minValue, setMinValue] = useState('');
  const [maxValue, setMaxValue] = useState('');
  const [guide, setGuide] = useState({});
  const [allRefValues, setAllRefValues] = useState([]);
  const [isGuideFormVisible, setIsGuideFormVisible] = useState(false);

  // Fetch data when the screen is focused
  useFocusEffect(
    React.useCallback(() => {
      const fetchGuide = async () => {
        try {
          const allRefValues = await getAllRefsWithValues(guideId, refName);
          setAllRefValues(allRefValues);

          const guideData = await getGuideById(guideId);
          setGuide(guideData);
        } catch (error) {
          Alert.alert('Hata', error.message || 'Kılavuz bilgileri alınamadı.');
        }
      };
      fetchGuide();
    }, [guideId, refName]) // Dependencies
  );


  const handleAddRefFields = async () => {
    if (!minAge.trim() || !maxAge.trim() || !minValue.trim() || !maxValue.trim()) {
      Alert.alert('Uyarı', 'Tüm alanları doldurun.');
      return;
    }

    try {
      let finalMinValue = minValue;
      let finalMaxValue = maxValue;

      // guide.base değerine göre işlem yap
      if (guide.base === 'Geometric mean ± SD' || guide.base === 'Mean ± SD') {
        finalMinValue = parseFloat(minValue) - parseFloat(maxValue);
        finalMaxValue = parseFloat(minValue) + parseFloat(maxValue);
      }

      // Değerleri gönder
      await addValuesToRef(
        guideId,
        refName,
        parseFloat(minAge),
        parseFloat(maxAge),
        parseFloat(finalMinValue),
        parseFloat(finalMaxValue)
      );

      // Refresh data
      const updatedRefValues = await getAllRefsWithValues(guideId, refName);
      setAllRefValues(updatedRefValues);

      // Reset form
      setMinAge('');
      setMaxAge('');
      setMinValue('');
      setMaxValue('');
      setIsGuideFormVisible(false);
    } catch (error) {
      Alert.alert('Hata', 'Değer eklenemedi.');
    }
  };

  const handleDeleteValue = async (
    guideId,
    refName,
    minAge,
    maxAge,
    minValue,
    maxValue
  ) => {
    Alert.alert(
      'Silme Onayı',
      'Bu kılavuzu silmek istediğinizden emin misiniz?',
      [
        {
          text: 'Hayır',
          onPress: () => console.log('Silme işlemi iptal edildi'),
          style: 'cancel',
        },
        {
          text: 'Evet',
          onPress: async () => {
            try {
              const valueToRemove = { minAge, maxAge, minValue, maxValue };
              await removeValueFromRef(guideId, refName, valueToRemove);
              // Refresh data
              const updatedRefValues = await getAllRefsWithValues(guideId, refName);
              setAllRefValues(updatedRefValues);
              Alert.alert('Başarılı', 'Kılavuz silindi!');
            } catch (error) {
              Alert.alert('Hata', error.message || 'Kılavuz silinemedi.');
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Kılavuz Düzenle</Text>

        {/* Kılavuz Düzenle yuvarlak butonu */}
        <TouchableOpacity
          style={[styles.circleButton, styles.guideButton]}
          onPress={() => setIsGuideFormVisible(!isGuideFormVisible)}
        >
          <Text style={styles.circleButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Kılavuz düzenleme formu */}
      {isGuideFormVisible && (
        <View style={styles.formWrapper}>
          <Text style={styles.label}>
            Yaş Aralığı (Alt ve Üst Değerlerin ikisi de Dahildir) (Ay)
          </Text>

          <View style={styles.row}>
            <TextInput
              style={[styles.input, styles.halfInput]}
              placeholder="Alt Değer (Ay)"
              value={minAge}
              onChangeText={setMinAge}
              keyboardType="numeric"
            />
            <TextInput
              style={[styles.input, styles.halfInput]}
              placeholder="Üst Değer (Ay)"
              value={maxAge}
              onChangeText={setMaxAge}
              keyboardType="numeric"
            />
          </View>

          <Text style={styles.label}>
            {["Min - Max", "95% confidence interval"].includes(guide.base)
              ? "Değer Aralığı"
              : "Ortalama ve Standart Sapma Değerleri"}
          </Text>
          <View style={styles.row}>
            <TextInput
              style={[styles.input, styles.halfInput]}
              placeholder={
                ["Min - Max", "95% confidence interval"].includes(guide.base)
                  ? "Alt Sınır"
                  : "Ortalama Değer"
              }
              value={minValue}
              onChangeText={setMinValue}
              keyboardType="numeric"
            />
            <TextInput
              style={[styles.input, styles.halfInput]}
              placeholder={
                ["Min - Max", "95% confidence interval"].includes(guide.base)
                  ? "Üst Sınır"
                  : "Standart Sapma Değeri"
              }
              value={maxValue}
              onChangeText={setMaxValue}
              keyboardType="numeric"
            />
          </View>

          {/* Ekle Butonu */}
          <TouchableOpacity style={styles.saveButton} onPress={handleAddRefFields}>
            <Text style={styles.saveButtonText}>Ekle</Text>
          </TouchableOpacity>
        </View>
      )}

      <Text style={styles.subtitle}>
        Kılavuz Adı : {guide.title} / Referans Değeri : {refName}
      </Text>

      <FlatList
        data={allRefValues}
        keyExtractor={(item, index) =>
          item.id ? item.id.toString() : index.toString()
        }
        renderItem={({ item }) => (
          <View style={styles.tableContainer}>
            <Text style={styles.tableTitle}>Yaş Aralığı</Text>
            <Text style={styles.tableValue}>
              {item.minAge < 12 && item.maxAge < 12
                ? `${item.minAge} - ${item.maxAge} Aylık`
                : `${item.minAge >= 12 ? item.minAge / 12 : item.minAge} - ${item.maxAge >= 12 ? item.maxAge / 12 : item.maxAge
                } Yaşlarında (${item.minAge} - ${item.maxAge} Aylık)`}
            </Text>

            <Text style={styles.tableTitle}>Referans Değer Aralığı</Text>
            <Text style={styles.tableValue}>
              {item.minValue} - {item.maxValue}
            </Text>

            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() =>
                  navigation.navigate('EditValue', {
                    guideId,
                    refName,
                    minAge: item.minAge,
                    maxAge: item.maxAge,
                    minValue: item.minValue,
                    maxValue: item.maxValue,
                  })
                }
              >
                <Text style={styles.editButtonText}>Düzenle</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() =>
                  handleDeleteValue(
                    guideId,
                    refName,
                    item.minAge,
                    item.maxAge,
                    item.minValue,
                    item.maxValue
                  )
                }
              >
                <Text style={styles.deleteButtonText}>Sil</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
};

export default EditGuideScreen;

// ---------------------------------------------------------------------
// STYLES
// ---------------------------------------------------------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F8FE', // Pastel mavi arkaplan
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2F5D8E',
    flex: 1,
  },
  circleButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#28a745',
    justifyContent: 'center',
    alignItems: 'center',

    // Gölge
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3.5,
    elevation: 3,
  },
  circleButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  guideButton: {
    marginLeft: 10,
    flex: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  formWrapper: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,

    // Gölge
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3.5,
    elevation: 3,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    justifyContent: 'space-between',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 10,
    paddingVertical: 10,
    fontSize: 15,
    borderRadius: 8,
    backgroundColor: '#fff',

    // Hafif gölge
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1.5 },
    shadowOpacity: 0.1,
    shadowRadius: 1.8,
    elevation: 1,
  },
  halfInput: {
    width: '47%',
    marginRight: '6%',
  },
  saveButton: {
    backgroundColor: '#5A8FCB',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',

    // Gölge
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3.5,
    elevation: 3,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  tableContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',

    // Gölge
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3.5,
    elevation: 2,
  },
  tableTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2F5D8E',
    marginBottom: 4,
  },
  tableValue: {
    fontSize: 14,
    color: '#555',
    marginBottom: 12,
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    marginTop: 10,
  },
  editButton: {
    flex: 7,
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5,

    // Gölge
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1.5 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  deleteButton: {
    flex: 3,
    backgroundColor: '#ff4d4f',
    padding: 10,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',

    // Gölge
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1.5 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
