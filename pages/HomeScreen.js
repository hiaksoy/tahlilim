import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Platform,
} from 'react-native';

import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { db } from '../configs/firebase_config'; 
import { collection, getDocs } from 'firebase/firestore'; // Gerektiğinde açabilirsin.

// Bu kısım senin Firebase yapılandırma dosyan (örnek).

import { REFS } from '../shared/consts'; // Bu senin mevcut dosyandaki değerlerin listesi.

export default function HomeScreen() {
  // Dinamik değer state
  const [degerler, setDegerler] = useState([{ ad: REFS[0], sonuc: '' }]);
  
  // Doğum tarihi seçimi ile ilgili state
  const [dogumTarihi, setDogumTarihi] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Sorgu sonucu için state (örnek olarak array kullanıldı)
  const [sonuclar, setSonuclar] = useState([]);

  // Doğum tarihi seçme işlemi
  const acDatePicker = () => {
    setShowDatePicker(true);
  };

  const parseCommaFloat = (val) => {
    if (val === null || val === undefined) return NaN;
    return parseFloat(String(val).replace(',', '.'));
  };
  

  const handleDateChange = (event, selectedDate) => {
    // iOS'ta picker açık kalmasın diye:
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (selectedDate) {
      setDogumTarihi(selectedDate);
    }
  };

  // Dinamik değer ekleme / silme / güncelleme
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

  const groupByAd = (results) => {
    return results.reduce((groups, item) => {
      const group = groups[item.ad] || [];
      group.push(item);
      groups[item.ad] = group;
      return groups;
    }, {});
  };

 // Sorgu butonuna basıldığında çalışacak fonksiyon
// const sorgula = async () => {
//     if (!dogumTarihi) {
//       alert('Lütfen doğum tarihi seçiniz.');
//       return;
//     }
  
//     try {
//       const snapshot = await getDocs(collection(db, 'Kılavuzlar'));
//       let tempResults = [];
  
//       // Tüm kılavuzlar (dokümanlar) üzerinde gez
//       snapshot.forEach((doc) => {
//         const kilavuzData = doc.data();
  

//         // "degerler" map'i var mı kontrol et
//         if (!kilavuzData.Degerler) return;
  
//         // Eklenen her "değer" (ad, sonuc) için
//         degerler.forEach(({ ad, sonuc }) => {

//           // Girilen sonuç string geliyorsa float çevir
//           const sonucFloat = parseFloat(sonuc);
//           if (isNaN(sonucFloat)) return; // Geçersiz girişse yok say
  
//           console.log('Kılavuzdaki Değerler:::' ,kilavuzData.Degerler);
//           console.log('Ad:', ad);
//           // Kılavuzdaki "degerler" map'i içinde bu "ad" var mı?
//           if (kilavuzData.Degerler[ad]) {
//             // Eşleşen array
           
//             const arrayNesneler = kilavuzData.degerler[ad];
  
//             // Yaş hesapla
//             const bugun = new Date();
//             const ayFarki = hesaplaAyOlarakYas(bugun, dogumTarihi);
  
//             // Array içindeki her nesne için minAge <= ayFarki <= maxAge kontrolü
//             arrayNesneler.forEach((item) => {
//               // Örn. item = { minAge: 0, maxAge: 12, minValue: 3.0, maxValue: 5.0 }
  
//               if (ayFarki >= item.minAge && ayFarki <= item.maxAge) {
//                 let status = 'Normal';
//                 if (sonucFloat < item.minValue) {
//                   status = 'Düşük';
//                 } else if (sonucFloat > item.maxValue) {
//                   status = 'Yüksek';
//                 }
  

//                 // Sonuca push edilecek veri
//                 tempResults.push({
//                   ad,                     // Picker’da seçilen değer adı
//                   sonucGirilen: sonuc,    // Kullanıcının girdiği numeric sonuç
//                   minValue: item.minValue,
//                   maxValue: item.maxValue,
//                   status,
//                   kilavuzAdi: doc.id,     // Firestore doküman ID'si veya istersen doc.data().isim
//                 });
//               }
//             });
//           }
//         });
//       });
  
//       // Bulunan tüm sonuçları state’e at
//       setSonuclar(tempResults);
//       console.log('Sonuçlar:', tempResults);
//     } catch (err) {
//       console.log('Sorgu hatası:', err);
//       alert('Kılavuz sorgusu yapılırken hata oluştu.');
//     }
//   };


const sorgula = async () => {
  if (!dogumTarihi) {
    alert('Lütfen doğum tarihi seçiniz.');
    return;
  }

  try {
    const snapshot = await getDocs(collection(db, 'Kılavuzlar'));
    let tempResults = [];

    snapshot.forEach((doc) => {
      const kilavuzData = doc.data();

      // "Degerler" map'i var mı kontrol
      if (!kilavuzData.Degerler) {
        return;
      }

      // Ekranda girilen her "değer" (ad, sonuc) için
      degerler.forEach(({ ad, sonuc }) => {
        // Kullanıcıdan gelen "sonuc" virgüllü ise nokta yap
        const sonucFloat = parseCommaFloat(sonuc);
        if (isNaN(sonucFloat)) {
          // Geçersiz giriş
          return;
        }

        // Firestore dokümanındaki "Degerler" map'i içinde bu "ad" var mı?
        if (kilavuzData.Degerler[ad]) {
          const arrayNesneler = kilavuzData.Degerler[ad];

          // Yaş hesapla (ay cinsinden)
          const bugun = new Date();
          const ayFarki = hesaplaAyOlarakYas(bugun, dogumTarihi);

          arrayNesneler.forEach((item) => {
            // Firestore'dan da virgüllü gelebilir
            const minVal = parseCommaFloat(item.minValue);
            const maxVal = parseCommaFloat(item.maxValue);

            // minAge, maxAge da virgüllü olabilir mi?
            // Normalde yaş aralığı tam sayı olur; 
            // yine de garantiye almak istersen parse...
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
                sonucGirilen: sonuc, // Ekranda virgüllü halini göstermek istersen
                minValue: minVal,
                maxValue: maxVal,
                status,
                kilavuzAdi: doc.data().title,
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

  // Basit bir ay hesabı (tamamen örnek):
  const hesaplaAyOlarakYas = (bugun, dt) => {
    // dt: doğum tarihi
    const yilFarki = bugun.getFullYear() - dt.getFullYear();
    const ayFarki = bugun.getMonth() - dt.getMonth();
    return yilFarki * 12 + ayFarki;
  };

  return (
    <View style={styles.safeArea}>
    <StatusBar backgroundColor="#f9fafc" barStyle="dark-content" />
    <ScrollView style={styles.container}>

      {/* Başlık */}
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
            style={{ marginBottom: 10 }}
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

      {/* Sorgu Butonu */}
      <View style={styles.section}>
        <Button title="Sorgula" onPress={sorgula} color="#3f51b5" />
      </View>

      {/* Sonuçları Gösterme Alanı */}
      {sonuclar.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.resultTitle}>Sonuçlar</Text>
          {Object.entries(groupByAd(sonuclar)).map(([ad, items]) => (
            <View key={ad} style={styles.resultGroup}>
              <Text style={styles.resultGroupTitle}>{ad}</Text>
              {items.map((item, idx) => (
                <View key={idx} style={styles.resultItem}>
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
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f9fafc',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },

  resultGroup: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#f1f8e9',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  resultGroupTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 8,
    color: '#388e3c',
  },
  
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 0, // Üst kısımdan boşluk kaldırıldı
    backgroundColor: '#f9fafc',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 0, // Üst boşluk sıfırlandı
    color: '#4CAF50',
    backgroundColor: '#e0f7fa',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
  section: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
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
    borderRadius: 5,
    overflow: 'hidden',
  },
  dynamicInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 5,
    height: 51,
  },
  deleteButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#f44336',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
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
  datePickerButton: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    backgroundColor: '#fafafa',
  },
  datePickerButtonText: {
    fontSize: 16,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  resultItem: {
    marginBottom: 10,
  },
  resultItemTitle: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  resultDivider: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 8,
  },
});
