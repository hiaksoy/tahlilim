import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
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
import { REFS } from '../shared/consts'; // Mevcut dosyandaki değerler listesi.

// Ekledik: Checkbox benzeri bir bileşen (yalın bir simülasyon)
// İsterseniz "react-native-checkBox" veya "expo-checkbox" kütüphanesi kullanabilirsiniz.
function MyCheckBox({ checked, onPress, label }) {
  return (
    <TouchableOpacity style={styles.checkBoxRow} onPress={onPress}>
      <View style={[styles.checkBoxBox, checked && styles.checkBoxBoxChecked]}>
        {checked && <Text style={styles.checkBoxTick}>✓</Text>}
      </View>
      <Text style={styles.checkBoxLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

// ---------------------------------------------------------------------
// ANA BİLEŞEN
// ---------------------------------------------------------------------
export default function FastSearch() {
  const [degerler, setDegerler] = useState([{ ad: REFS[0], sonuc: '' }]);
  const [dogumTarihi, setDogumTarihi] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [sonuclar, setSonuclar] = useState([]);

  // (1) Kılavuz listesi ve seçilen kılavuz state
  const [allGuides, setAllGuides] = useState([]);           // Tüm kılavuzlar (DB’den alınacak)
  const [selectedGuideIds, setSelectedGuideIds] = useState([]); // Kullanıcının seçtikleri
  const [isAllSelected, setIsAllSelected] = useState(false); // "Tümünü Seç" kontrolü

  // (2) Bu bölümü aç/kapat
  const [showGuideSelection, setShowGuideSelection] = useState(false);

  // DB'deki kılavuzları çek (örnek)
  useEffect(() => {
    const fetchGuides = async () => {
      try {
        const snap = await getDocs(collection(db, 'Kılavuzlar'));
        let temp = [];
        snap.forEach((docSnap) => {
          const data = docSnap.data();
          temp.push({
            id: docSnap.id,
            title: data.title || docSnap.id,
            base: data.base || 'N/A', // BASE'i de aldık (yoksa N/A)
          });
        });
        setAllGuides(temp);
      } catch (err) {
        console.log('Kılavuzlar alınırken hata:', err);
      }
    };
    fetchGuides();
  }, []);

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

  const groupByAd = (results) => {
    return results.reduce((groups, item) => {
      const group = groups[item.ad] || [];
      group.push(item);
      groups[item.ad] = group;
      return groups;
    }, {});
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

  // Yaş hesaplaması (ay cinsinden)
  const hesaplaAyOlarakYas = (bugun, dt) => {
    // Türkiye saat dilimini UTC+3 olarak ayarlıyoruz
    const bugunTR = new Date(bugun.getTime() + 3 * 60 * 60 * 1000);
    const dtTR = new Date(dt.getTime() + 3 * 60 * 60 * 1000);

    const yilFarki = bugunTR.getFullYear() - dtTR.getFullYear();
    const ayFarki = bugunTR.getMonth() - dtTR.getMonth();

    // Eğer gün, ay içinde dolmamışsa 1 ay çıkar
    const gunFarki = bugunTR.getDate() - dtTR.getDate();
    const toplamAy = yilFarki * 12 + ayFarki - (gunFarki < 0 ? 1 : 0);

    return toplamAy;
  };

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
        const docId = doc.id;

        // (Önemli) Kontrol: Eğer "Tümünü Seç" ON ise ya da
        // "selectedGuideIds" boş değil ve doc.id bu listede ise sorguya dahil
        if (
          isAllSelected ||
          (selectedGuideIds.length > 0 && selectedGuideIds.includes(docId))
        ) {
          // Devam...
        } else {
          // Dışarıda
          return;
        }

        if (!kilavuzData.Degerler) {
          return;
        }

        degerler.forEach(({ ad, sonuc }) => {
          const sonucFloat = parseCommaFloat(sonuc);
          if (isNaN(sonucFloat)) {
            return;
          }

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
                  kilavuzAdi: kilavuzData.title,
                  kilavuzBase: kilavuzData.base,
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

  // Checkbox toggle
  const toggleGuide = (guideId) => {
    // Tümünü Seç devredeyse kapatalım
    if (isAllSelected) {
      setIsAllSelected(false);
    }
    if (selectedGuideIds.includes(guideId)) {
      // listeden çıkar
      setSelectedGuideIds(selectedGuideIds.filter((id) => id !== guideId));
    } else {
      // ekle
      setSelectedGuideIds([...selectedGuideIds, guideId]);
    }
  };

  const toggleSelectAll = () => {
    // Tümünü seç ON ise kapatalım (ve selectedGuideIds boş)
    // Tümünü seç OFF ise hepsini ekle
    if (isAllSelected) {
      setIsAllSelected(false);
      setSelectedGuideIds([]);
    } else {
      setIsAllSelected(true);
      // Tüm guideId'leri ekle
      const allIds = allGuides.map((g) => g.id);
      setSelectedGuideIds(allIds);
    }
  };

  return (
    <View style={styles.safeArea}>
      <StatusBar backgroundColor="#F3F8FE" barStyle="dark-content" />
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

        {/* (YENİ) Sorgulanacak Kılavuzlar (açılır/kapanır) */}
        <View style={styles.section}>
          <TouchableOpacity onPress={() => setShowGuideSelection(!showGuideSelection)}>
            <Text style={styles.sectionSubTitle}>
              {showGuideSelection ? '▼ Sorgulanacak Kılavuzlar' : '► Sorgulanacak Kılavuzlar'}
            </Text>
          </TouchableOpacity>

          {showGuideSelection && (
            <View style={styles.guideSelectionContainer}>
              {/* Tümünü seç */}
              <TouchableOpacity
                style={styles.checkBoxRow}
                onPress={toggleSelectAll}
              >
                <View style={[styles.checkBoxBox, isAllSelected && styles.checkBoxBoxChecked]}>
                  {isAllSelected && <Text style={styles.checkBoxTick}>✓</Text>}
                </View>
                <Text style={styles.checkBoxLabel}>Tümünü Seç / Kaldır</Text>
              </TouchableOpacity>

              {allGuides.map((guide) => {
                const checked = isAllSelected || selectedGuideIds.includes(guide.id);
                return (
                  <TouchableOpacity
                    key={guide.id}
                    style={styles.checkBoxRow}
                    onPress={() => toggleGuide(guide.id)}
                  >
                    <View style={[styles.checkBoxBox, checked && styles.checkBoxBoxChecked]}>
                      {checked && <Text style={styles.checkBoxTick}>✓</Text>}
                    </View>
                    {/* Kılavuz adı + base bilgisi parantez içinde */}
                    <Text style={styles.checkBoxLabel}>
                      {guide.title} ({guide.base})
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
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
                    <Text>Kılavuz: {item.kilavuzAdi} ({item.kilavuzBase})</Text>
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

// ---------------------------------------------------------------------
// STYLES
// ---------------------------------------------------------------------
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F3F8FE', // Ana arka plan (pastel mavi)
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F3F8FE'
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2F5D8E',
    marginBottom: 10,
    alignSelf: 'center',
    // Kart benzeri mini arka plan
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 10,
    // Gölge
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2
  },
  sectionSubTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2F5D8E',
    marginBottom: 4
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
    elevation: 2
  },
  datePickerButton: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fafafa'
  },
  datePickerButtonText: {
    fontSize: 16,
    color: '#333'
  },
  dynamicRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12
  },
  pickerContainer: {
    flex: 1,
    marginRight: 8,
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
    height: 50
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
    elevation: 2
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold'
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
    elevation: 3
  },
  addValueButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
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
    elevation: 3
  },
  queryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333'
  },
  resultGroup: {
    marginBottom: 20,
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 10,
    // Gölge
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2
  },
  resultGroupTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 8,
    color: '#388e3c'
  },
  resultItem: {
    marginBottom: 10,
    padding: 8,
    borderRadius: 6,
    // Arka plan rengi durum bazında "getStatusBgColor" ile set edilecek
  },
  resultDivider: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 8
  },

  // CheckBox stili
  guideSelectionContainer: {
    marginTop: 10
  },
  checkBoxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4
  },
  checkBoxBox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#ccc',
    borderRadius: 4,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center'
  },
  checkBoxBoxChecked: {
    borderColor: '#2F5D8E',
    backgroundColor: '#2F5D8E'
  },
  checkBoxTick: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  },
  checkBoxLabel: {
    fontSize: 16,
    color: '#333'
  }
});
