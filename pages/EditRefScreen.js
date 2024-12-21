import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, FlatList, Switch } from 'react-native';
import { addValuesToRef, getAllRefsWithValues } from '../services/aDegerlerService';
import { getGuideById } from '../services/aGuidesService';


const EditGuideScreen = ({ route, navigation }) => {
  const { guideId, refName } = route.params;

  const [minAge, setMinAge] = useState('');
  const [maxAge, setMaxAge] = useState('');
  const [minValue, setMinValue] = useState('');
  const [maxValue, setMaxValue] = useState('');
  const [guide, setGuide] = useState('');
  const [isYearSelected, setIsYearSelected] = useState(false);


  const [allRefValues, setAllRefValues] = useState({});
  const [isGuideFormVisible, setIsGuideFormVisible] = useState(false); // Kılavuz düzenleme formunun görünürlüğü

  useEffect(() => {
    const fetchGuide = async () => {
      try {
        // const guide = await getGuideById(refId);
        const allRefValues = await getAllRefsWithValues(guideId, refName);
        setAllRefValues(allRefValues);  // Alt tabloları ayarla
        const guide = await getGuideById(guideId);
        setGuide(guide);
      } catch (error) {
        Alert.alert('Hata', error.message || 'Kılavuz bilgileri alınamadı.');
      }
    };
    fetchGuide();
  }, [refName]);

  const fetchGuide = async () => {
    try {
      //   const guide = await getGuideById(refId);
      const allRefValues = await getAllRefsWithValues(guideId, refName);
      setAllRefValues(allRefValues);  // Alt tabloları ayarla
      console.log(guide.base);

    } catch (error) {
      Alert.alert('Hata', error.message || 'Kılavuz bilgileri alınamadı.');
    }
  };

  const handleUpdateGuide = async () => {
    if (!title || !description) {
      Alert.alert('Uyarı', 'Tüm alanları doldurun.');
      return;
    }
    try {
      await updateGuide(refId, { title, description });
      Alert.alert('Başarılı', 'Kılavuz güncellendi!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Hata', 'Kılavuz güncellenemedi.');
    }
  };

  const handleAddRefFields = async () => {
    if (!minAge || !maxAge || !minValue || !maxValue) {
      Alert.alert('Uyarı', 'Tüm alanları doldurun.');
      return;
    }

    try {
      let finalMinValue = minValue;
      let finalMaxValue = maxValue;

      // Eğer yıl seçili ise, minAge ve maxAge'i 12 ile çarp
      const adjustedMinAge = isYearSelected ? parseFloat(minAge) * 12 : parseFloat(minAge);
      const adjustedMaxAge = isYearSelected ? parseFloat(maxAge) * 12 : parseFloat(maxAge);

      // guide.base değerine göre işlem yap
      if (guide.base === 'Geometric mean ± SD' || guide.base === 'Mean ± SD') {
        finalMinValue = parseFloat(minValue) - parseFloat(maxValue);
        finalMaxValue = parseFloat(minValue) + parseFloat(maxValue);
      }

      // Değerleri gönder
      await addValuesToRef(
        guideId,
        refName,
        adjustedMinAge.toString(),  // Ay cinsinden gönder
        adjustedMaxAge.toString(),  // Ay cinsinden gönder
        finalMinValue,
        finalMaxValue
      );

      // Başarılı ekleme sonrası işlemler
      Alert.alert('Başarılı', 'Değer eklendi!', [
        {
          text: 'Tamam',
          onPress: () => {
            setIsGuideFormVisible(false); // formu gizle
            fetchGuide(); // guide'ı yeniden getir
          },
        },
      ]);
    } catch (error) {
      // Hata durumu
      Alert.alert('Hata', 'Değer eklenemedi.');
    }
  };



  const handleDeleteGuide = async (id) => {
    try {
      await deleteSubTable(refId, id);
      fetchGuide();
      Alert.alert('Başarılı', 'Değer silindi!');
    } catch (error) {
      Alert.alert('Hata', error.message || 'Değer silinemedi.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Kılavuz Düzenle</Text>

        {/* Kılavuz Düzenle yuvarlak butonu */}
        <TouchableOpacity
          style={[styles.circleButton, styles.guideButton]}
          onPress={() => setIsGuideFormVisible(!isGuideFormVisible)} // Kılavuz düzenleme formunu aç/kapat
        >
          <Text style={styles.circleButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Kılavuz düzenleme formu */}
      {isGuideFormVisible && (
        <>
          <View style={styles.switchContainer}>
            <View style={styles.switchRow}>
              <Text style={styles.label}>Yaş Aralığı Giriş Biçimi</Text>
              <View style={styles.switchRight}>
                <Text style={styles.switchText}>Ay</Text>
                <Switch
                  value={isYearSelected}
                  onValueChange={(value) => setIsYearSelected(value)}
                />
                <Text style={styles.switchText}>Yıl</Text>
              </View>
            </View>
          </View>

          <Text style={styles.label}>Yaş Aralığı (Alt ve Üst Değerlerin ikiside Dahildir.) ({isYearSelected ? 'Yıl' : 'Ay'})</Text>

          <View style={styles.row}>
            <TextInput
              style={[styles.input, styles.halfInput]}
              placeholder={isYearSelected ? "Alt Değer (Yıl)" : "Alt Değer (Ay)"}
              value={minAge}
              onChangeText={setMinAge}
              keyboardType="numeric"
            />
            <TextInput
              style={[styles.input, styles.halfInput]}
              placeholder={isYearSelected ? "Üst Değer (Yıl)" : "Üst Değer (Ay)"}
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
              placeholder={["Min - Max", "95% confidence interval"].includes(guide.base) ? "Alt Sınır" : "Ortalama Değer"}
              value={minValue}
              onChangeText={setMinValue}
              keyboardType="numeric"
            />
            <TextInput
              style={[styles.input, styles.halfInput]}
              placeholder={["Min - Max", "95% confidence interval"].includes(guide.base) ? "Üst Sınır" : "Standart Sapma Değeri"}
              value={maxValue}
              onChangeText={setMaxValue}
              keyboardType="numeric"
            />
          </View>


          {/* Ekle Butonu */}
          <TouchableOpacity style={styles.saveButton} onPress={handleAddRefFields}>
            <Text style={styles.saveButtonText}>Ekle</Text>
          </TouchableOpacity>
        </>
      )}



      <Text style={styles.subtitle}>Kılavuz Adı : {guide.title} / Referans Değeri : {refName} </Text>
      <FlatList
        data={allRefValues}
        keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()}
        renderItem={({ item }) => (
          <View style={styles.tableContainer}>
            <Text style={styles.tableTitle}>Yaş Aralığı</Text>
            <Text style={styles.tableValue}>
              {item.minAge < 12 && item.maxAge < 12
                ? `${item.minAge} - ${item.maxAge} Aylık`
                : `${(item.minAge >= 12 ? item.minAge / 12 : item.minAge)} - ${(item.maxAge >= 12 ? item.maxAge / 12 : item.maxAge)} Yaşlarında (${item.minAge} - ${item.maxAge} Aylık)`}
            </Text>



            <Text style={styles.tableTitle}>Referans Değer Aralığı</Text>
            <Text style={styles.tableValue}>{item.minValue} - {item.maxValue}</Text>
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => navigation.navigate('EditValue', { guideId, refName })}
              >
                <Text style={styles.editButtonText}>Düzenle</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteGuide(item.id)}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row', // Yatayda hizalama
    justifyContent: 'space-between', // Başlık ile buton arasında boşluk bırak
    alignItems: 'center', // Dikeyde ortalama
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    flex: 1, // Başlık ile buton arasında yer paylaşımı
  },
  input: {
    height: 50,
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  tableContainer: {
    backgroundColor: '#fff',
    marginBottom: 15,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  tableTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4, // Başlıkların altına biraz boşluk ekleyin
  },
  tableValue: {
    fontSize: 14,
    color: '#555',
    marginBottom: 12, // Değerler arasına biraz boşluk bırakın
  },
  actionButtons: {
    flexDirection: 'row',
    marginTop: 10,
  },
  editButton: {
    flex: 7, // %70 genişlik
    backgroundColor: '#28a745', // Yeşil
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5, // Aralarındaki boşluk
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  deleteButton: {
    flex: 3, // %30 genişlik
    backgroundColor: '#ff4d4f', // Kırmızı
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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
  circleButton: {
    width: 40,
    height: 40,
    borderRadius: 20, // Yuvarlak buton
    backgroundColor: '#28a745',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  valueSection: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  guideButton: {
    marginLeft: 10,
    flex: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  valueButton: {
    marginLeft: 10,
    flex: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  formContainer: {
    marginTop: 20,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  halfInput: {
    width: '48%',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
  },




  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  switchContainer: {
    marginBottom: 20,
  },
  switchRow: {
    flexDirection: 'row', // Yatayda hizalama
    alignItems: 'center', // Dikey hizalama
    width: '100%', // Tüm alanı kaplasın
  },
  switchRight: {
    flexDirection: 'row', // Switch ve metinler yatayda olacak
    justifyContent: 'flex-end', // Sağda hizalama
    alignItems: 'center', // Yatay hizalama
    flex: 1, // Kalan alanı alacak
  },
  switchText: {
    fontSize: 16,
    marginHorizontal: 10, // Switch ile metin arasındaki mesafeyi ayarlar
  },
  row: {
    flexDirection: 'row', // Yan yana inputlar
    alignItems: 'center',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    fontSize: 16,
    borderRadius: 5,
  },
  halfInput: {
    width: '45%', // Yarı genişlik
    marginRight: '5%', // Aralarındaki boşluk
  },






});

export default EditGuideScreen;
