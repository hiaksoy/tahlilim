// ... diğer importlar ...
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Alert
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { db } from '../configs/firebase_config';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { getUserById } from '../services/UsersService';

const parseDateString = (dateString) => {
  if (!dateString) return null;
  const [day, month, year] = dateString.split('.');
  if (!day || !month || !year) return null;
  return new Date(`${year}-${month}-${day}`);
};

const hesaplaAyOlarakYas = (bugun, dt) => {
  const yilFarki = bugun.getFullYear() - dt.getFullYear();
  const ayFarki = bugun.getMonth() - dt.getMonth();
  return yilFarki * 12 + ayFarki;
};

const parseCommaFloat = (val) => {
  if (!val) return NaN;
  return parseFloat(String(val).replace(',', '.'));
};

const formatTimestamp = (timestamp) => {
  if (!timestamp) return 'Tarih yok';
  const date = timestamp.seconds
    ? new Date(timestamp.seconds * 1000)
    : new Date(timestamp);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

const ShowUserTestsScreen = () => {
  const route = useRoute();
  const { userId, birthDate } = route.params || {};

  const dogumTarihi = parseDateString(birthDate);

  const [tahliller, setTahliller] = useState([]);
  const [kilavuzlar, setKilavuzlar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const [expandedTahliller, setExpandedTahliller] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }
      try {
        // Kullanıcı ismi:
        const user = await getUserById(userId);
        setUserName(`${user.name} ${user.surname}`);

        // Kılavuzlar:
        const kilavuzSnap = await getDocs(collection(db, 'Kılavuzlar'));
        let tempKilavuzlar = [];
        kilavuzSnap.forEach((docSnap) => {
          tempKilavuzlar.push({ id: docSnap.id, ...docSnap.data() });
        });

        // Tahliller:
        const tahlilSnap = await getDocs(collection(db, 'Tahliller'));
        let tempTahliller = [];
        tahlilSnap.forEach((docSnap) => {
          const data = docSnap.data();
          if (data.userId === userId) {
            tempTahliller.push({ id: docSnap.id, ...data });
          }
        });

        // createdAt’e göre azalan sırada (en yeni -> en eski)
        tempTahliller.sort((a, b) => {
          const dateA = a.createdAt?.seconds
            ? a.createdAt.seconds * 1000
            : new Date(a.createdAt || 0).getTime();
          const dateB = b.createdAt?.seconds
            ? b.createdAt.seconds * 1000
            : new Date(b.createdAt || 0).getTime();
          return dateB - dateA; // Azalan sıralama
        });

        setKilavuzlar(tempKilavuzlar);
        setTahliller(tempTahliller);
      } catch (err) {
        console.log('fetchData hatası:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  // Durum hesaplama (tek tahlil için)
  const getDurum = (tetkikAd, sonucStr) => {
    if (!dogumTarihi || isNaN(dogumTarihi.getTime())) return null;

    const bugun = new Date();
    const ayFarki = hesaplaAyOlarakYas(bugun, dogumTarihi);
    const sonucFloat = parseCommaFloat(sonucStr);
    if (isNaN(sonucFloat)) return null;

    for (let k of kilavuzlar) {
      if (!k.Degerler) continue;
      const arr = k.Degerler[tetkikAd];
      if (!arr) continue;

      for (let rangeObj of arr) {
        const minA = parseFloat(rangeObj.minAge);
        const maxA = parseFloat(rangeObj.maxAge);
        const minV = parseCommaFloat(rangeObj.minValue);
        const maxV = parseCommaFloat(rangeObj.maxValue);

        if (ayFarki >= minA && ayFarki <= maxA) {
          let status = 'Normal';
          if (sonucFloat < minV) status = 'Düşük';
          else if (sonucFloat > maxV) status = 'Yüksek';

          return {
            status,
            minValue: minV,
            maxValue: maxV,
            kilavuzAdi: k.title || k.id
          };
        }
      }
    }
    return null;
  };

  // (YENİ) Tahliller listesinde, currentTahlil’in index’ini buluyoruz:
  // Sonra index+1 .. tahliller.length-1 arasındakiler (daha eski tahliller)
  // Bu tetkik adını bulursak, previousResults’a ekliyoruz; en fazla 3
  const getPreviousResults = (tetkikAd, currentTahlilId) => {
    let previousResults = [];
    const currentIndex = tahliller.findIndex((t) => t.id === currentTahlilId);
    if (currentIndex === -1) return [];

    // Daha eski tahliller = index i > currentIndex
    for (let i = currentIndex + 1; i < tahliller.length; i++) {
      const olderTahlil = tahliller[i];
      if (olderTahlil.degerler && olderTahlil.degerler.length > 0) {
        // Bu tahlilde "tetkikAd" var mı?
        for (let d of olderTahlil.degerler) {
          if (d.ad === tetkikAd) {
            previousResults.push(d.sonuc);
            break; // Bu tahlilden sadece 1 tane "d.ad" alalım
          }
        }
      }
      if (previousResults.length >= 3) break;
    }

    return previousResults;
  };

  // Tahlil'i genişlet/gizle
  const toggleTahlilExpansion = (id) => {
    setExpandedTahliller((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Tahlil Sil
  const handleDeleteTahlil = async (id) => {
    try {
      await deleteDoc(doc(db, 'Tahliller', id));
      setTahliller((prev) => prev.filter((tahlil) => tahlil.id !== id));
      Alert.alert('Başarılı', 'Tahlil başarıyla silindi.');
    } catch (error) {
      Alert.alert('Hata', 'Tahlil silinirken bir hata oluştu.');
    }
  };

  // Loading
  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#2F5D8E" />
        <Text style={styles.loadingText}>Veriler yükleniyor...</Text>
      </View>
    );
  }

  // Render
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{userName} - Hasta Tahlilleri</Text>

      {tahliller.length === 0 ? (
        <Text style={styles.infoText}>Bu kullanıcıya ait tahlil bulunamadı.</Text>
      ) : (
        <FlatList
          data={tahliller}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            return (
              <View style={styles.tahlilCard}>
                {/* Sil Butonu */}
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => {
                    Alert.alert(
                      'Silme Onayı',
                      'Bu tahlili silmek istediğinize emin misiniz?',
                      [
                        { text: 'İptal', style: 'cancel' },
                        {
                          text: 'Sil',
                          style: 'destructive',
                          onPress: () => handleDeleteTahlil(item.id)
                        }
                      ],
                      { cancelable: true }
                    );
                  }}
                >
                  <Text style={styles.deleteButtonText}>Sil</Text>
                </TouchableOpacity>

                {/* Rapor No vb. */}
                <Text style={styles.label}>
                  <Text style={styles.bold}>Rapor No:</Text> {item.raporNo || 'N/A'}
                </Text>
                <Text style={styles.label}>
                  <Text style={styles.bold}>Tanı:</Text> {item.tani || 'N/A'}
                </Text>
                <Text style={styles.label}>
                  <Text style={styles.bold}>Numune Türü:</Text> {item.numuneTuru || 'N/A'}
                </Text>
                <Text style={styles.label}>
                  <Text style={styles.bold}>Rapor Grubu:</Text> {item.raporGrubu || 'N/A'}
                </Text>
                <Text style={styles.label}>
                  <Text style={styles.bold}>Tetkik İstem Zamanı:</Text>{' '}
                  {formatTimestamp(item.tetkikIstemZamani)}
                </Text>
                <Text style={styles.label}>
                  <Text style={styles.bold}>Numune Alma Zamanı:</Text>{' '}
                  {formatTimestamp(item.numuneAlmaZamani)}
                </Text>
                <Text style={styles.label}>
                  <Text style={styles.bold}>Numune Kabul Zamanı:</Text>{' '}
                  {formatTimestamp(item.numuneKabulZamani)}
                </Text>
                <Text style={styles.label}>
                  <Text style={styles.bold}>Uzman Onay Zamanı:</Text>{' '}
                  {formatTimestamp(item.uzmanOnayZamani)}
                </Text>

                {item.degerler?.length > 0 && (
                  <>
                    <TouchableOpacity
                      style={styles.showHideButton}
                      onPress={() => toggleTahlilExpansion(item.id)}
                    >
                      <Text style={styles.showHideButtonText}>
                        {expandedTahliller[item.id]
                          ? '▼ Değerleri Gizle'
                          : '► Değerleri Göster'}
                      </Text>
                    </TouchableOpacity>

                    {expandedTahliller[item.id] && (
                      <View style={styles.degerlerContainer}>
                        {item.degerler.map((d, idx) => {
                          const calcData = getDurum(d.ad, d.sonuc);
                          let bgStyle = {};
                          if (calcData?.status === 'Normal') bgStyle = styles.bgNormal;
                          else if (calcData?.status === 'Düşük') bgStyle = styles.bgLow;
                          else if (calcData?.status === 'Yüksek') bgStyle = styles.bgHigh;

                          // önceki sonuçlar
                          const previousResults = getPreviousResults(d.ad, item.id);

                          return (
                            <View key={idx} style={[styles.sonucItem, bgStyle]}>
                              <Text style={styles.sonucText}>
                                <Text style={styles.bold}>Tetkik Adı:</Text> {d.ad}
                              </Text>
                              <Text style={styles.sonucText}>
                                <Text style={styles.bold}>Sonuç:</Text> {d.sonuc}
                              </Text>

                              {/* Önceki Sonuçlar */}
                              {previousResults.length > 0 && (
                                <View style={styles.previousResultsContainer}>
                                  <Text style={styles.bold}>Önceki Sonuçlar:</Text>
                                  {previousResults.map((result, index) => (
                                    <Text key={index} style={styles.previousResultText}>
                                      • {result}
                                    </Text>
                                  ))}
                                </View>
                              )}

                              <View style={styles.detayContainer}>
                                {calcData ? (
                                  <>
                                    <Text>
                                      <Text style={styles.bold}>Durum:</Text> {calcData.status}
                                    </Text>
                                    <Text>
                                      <Text style={styles.bold}>Referans Aralık:</Text>{' '}
                                      {calcData.minValue} - {calcData.maxValue}
                                    </Text>
                                    <Text>
                                      <Text style={styles.bold}>Kılavuz Adı:</Text>{' '}
                                      {calcData.kilavuzAdi}
                                    </Text>
                                  </>
                                ) : (
                                  <Text style={styles.infoText}>
                                    Uygun rehber bilgisi bulunamadı.
                                  </Text>
                                )}
                              </View>
                            </View>
                          );
                        })}
                      </View>
                    )}
                  </>
                )}
              </View>
            );
          }}
        />
      )}
    </View>
  );
};

export default ShowUserTestsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F8FE',
    padding: 12
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F8FE'
  },
  loadingText: {
    marginTop: 8,
    fontSize: 16,
    color: '#333'
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 12,
    textAlign: 'center',
    color: '#2F5D8E'
  },
  infoText: {
    fontSize: 15,
    color: '#555',
    marginTop: 8,
    lineHeight: 20
  },
  tahlilCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3.5,
    elevation: 3
  },
  label: {
    fontSize: 14,
    marginVertical: 3,
    color: '#333'
  },
  bold: {
    fontWeight: '700',
    color: '#2F5D8E'
  },
  showHideButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#2F5D8E',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginTop: 10
  },
  showHideButtonText: {
    color: '#fff',
    fontWeight: '600'
  },
  degerlerContainer: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee'
  },
  sonucItem: {
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d6d6d6'
  },
  sonucText: {
    fontSize: 14,
    marginVertical: 2,
    color: '#444'
  },
  detayContainer: {
    marginTop: 10,
    backgroundColor: '#f9f9ff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10
  },
  bgNormal: {
    backgroundColor: '#E7F6E7'
  },
  bgLow: {
    backgroundColor: '#FFF8DB'
  },
  bgHigh: {
    backgroundColor: '#FFE5E5'
  },
  deleteButton: {
    backgroundColor: '#FF6B6B',
    padding: 8,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center'
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold'
  },
  previousResultsContainer: {
    marginTop: 8,
    paddingLeft: 10
  },
  previousResultText: {
    fontSize: 14,
    color: '#555',
    marginTop: 2
  }
});
