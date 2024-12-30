// ShowUserTestsScreen.js
import React, { useEffect, useState, useContext } from 'react';
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
import { getUserById, getUserByEmail } from '../services/UsersService';
import { AuthContext } from '../configs/authContext'; // AuthContext'i içeri aktardık

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
  const [role, setRole] = useState(null); // Kullanıcı rolü
  const [loadingRole, setLoadingRole] = useState(true); // Rolün yüklenme durumu

  // AuthContext'ten mevcut kullanıcıyı alıyoruz
  const { user } = useContext(AuthContext); // AuthContext'ten kullanıcıyı alıyoruz

  // 1) Data Fetch ve Rol Fetch
  useEffect(() => {
    const fetchData = async () => {
      if (!userId) {
        setLoading(false);
        setLoadingRole(false);
        return;
      }
      try {
        // Kullanıcı ismi:
        const userData = await getUserById(userId);
        setUserName(`${userData.name} ${userData.surname}`);

        // Kılavuzlar:
        const kilavuzSnap = await getDocs(collection(db, 'Kılavuzlar'));
        const tempKilavuzlar = [];
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

        // numuneAlmaZamani’na göre azalan sırada (en yeni -> en eski)
        tempTahliller.sort((a, b) => {
          const dateA = a.numuneAlmaZamani?.seconds
            ? a.numuneAlmaZamani.seconds * 1000
            : new Date(a.numuneAlmaZamani || 0).getTime();
          const dateB = b.numuneAlmaZamani?.seconds
            ? b.numuneAlmaZamani.seconds * 1000
            : new Date(b.numuneAlmaZamani || 0).getTime();
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

    const fetchUserRole = async () => {
      if (user) {
        try {
          const userRole = await getUserByEmail(user.email); // Rolü veritabanından al
          setRole(userRole);
        } catch (error) {
          console.error('Kullanıcı rolü alınırken hata oluştu:', error);
        }
      }
      setLoadingRole(false); // Yükleme tamamlandı
    };

    fetchData();
    fetchUserRole();
  }, [userId, user]);

  // 2) Tüm Kılavuzları tarayarak, tetkikAd + sonucStr'ye uyan
  //    "durum" nesnelerinin array'ini döndürür.
  //    {status, minValue, maxValue, kilavuzAdi}
  const getAllDurum = (tetkikAd, sonucStr) => {
    if (!dogumTarihi || isNaN(dogumTarihi.getTime())) return [];

    const bugun = new Date();
    const ayFarki = hesaplaAyOlarakYas(bugun, dogumTarihi);
    const sonucFloat = parseCommaFloat(sonucStr);
    if (isNaN(sonucFloat)) return [];

    let results = [];

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

          results.push({
            status,
            minValue: minV,
            maxValue: maxV,
            kilavuzAdi: k.title || k.id
          });
        }
      }
    }

    return results; // Birden fazla kılavuz eşleşmesi dönebilecek
  };

  // 3) getPreviousResults (en eski tahlillerde bul)
  const getPreviousResults = (tetkikAd, currentTahlilId) => {
    let previousResults = [];
    const currentIndex = tahliller.findIndex((t) => t.id === currentTahlilId);
    if (currentIndex === -1) return [];

    for (let i = currentIndex + 1; i < tahliller.length; i++) {
      const olderTahlil = tahliller[i];
      if (olderTahlil.degerler && olderTahlil.degerler.length > 0) {
        for (let d of olderTahlil.degerler) {
          if (d.ad === tetkikAd) {
            previousResults.push({
              sonuc: d.sonuc,
              numuneAlmaZamani: olderTahlil.numuneAlmaZamani
            });
            break;
          }
        }
      }
      if (previousResults.length >= 3) break;
    }

    return previousResults;
  };

  // 4) Tahlil Genişletme
  const toggleTahlilExpansion = (id) => {
    setExpandedTahliller((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // 5) Tahlil Sil
  const handleDeleteTahlil = async (id) => {
    try {
      await deleteDoc(doc(db, 'Tahliller', id));
      setTahliller((prev) => prev.filter((tahlil) => tahlil.id !== id));
      Alert.alert('Başarılı', 'Tahlil başarıyla silindi.');
    } catch (error) {
      Alert.alert('Hata', 'Tahlil silinirken bir hata oluştu.');
    }
  };

  // 6) Loading
  if (loading || loadingRole) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#2F5D8E" />
        <Text style={styles.loadingText}>Veriler yükleniyor...</Text>
      </View>
    );
  }

  // 7) Render
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
                {/* Sil Butonu - Sadece admin ise göster */}
                {role === 'admin' && (
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
                )}

                {/* Rapor Bilgileri */}
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

                {/* Değerler */}
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
                          const durumArray = getAllDurum(d.ad, d.sonuc);
                          const previousResults = getPreviousResults(d.ad, item.id);

                          // Sonuç değişimini hesaplama
                          const currentResult = parseCommaFloat(d.sonuc);
                          const previousResult = previousResults[0]
                            ? parseCommaFloat(previousResults[0].sonuc)
                            : null;

                          let changeText = '';
                          let arrow = '';

                          if (previousResult !== null) {
                            if (currentResult > previousResult) {
                              changeText = 'bir önceki sonuca göre yükselmiştir';
                              arrow = '↑';
                            } else if (currentResult < previousResult) {
                              changeText = 'bir önceki sonuca göre düşmüştür';
                              arrow = '↓';
                            } else {
                              changeText = 'aynı kalmıştır';
                              arrow = '↔';
                            }
                          }

                          return (
                            // (A) "sonucGroupCard": Tüm Tetkik Adı / Sonuç / Önceki Sonuçlar / Durum(lar) 
                            <View key={idx} style={styles.sonucGroupCard}>
                              {/* Tetkik Adı ve Sonuç */}
                              <Text style={styles.sonucText}>
                                <Text style={styles.bold}>Tetkik Adı:</Text> {d.ad}
                              </Text>
                              <Text style={styles.sonucText}>
                                <Text style={styles.bold}>Sonuç:</Text> {d.sonuc}
                                {changeText ? ` (${changeText} ${arrow})` : ''}
                              </Text>

                              {/* Önceki Sonuçlar */}
                              {previousResults.length > 0 && (
                                <View style={styles.previousResultsContainer}>
                                  <Text style={styles.bold}>Önceki Sonuçlar:</Text>
                                  {previousResults.map((result, index) => (
                                    <Text key={index} style={styles.previousResultText}>
                                      • {result.sonuc} ({formatTimestamp(result.numuneAlmaZamani)})
                                    </Text>
                                  ))}
                                </View>
                              )}

                              {/* (B) Her kılavuz eşleşmesi için ayrı "durum kartı" */}
                              {durumArray.length > 0 ? (
                                durumArray.map((calcData, i2) => {
                                  let bgStyle = {};
                                  if (calcData.status === 'Normal') bgStyle = styles.bgNormal;
                                  else if (calcData.status === 'Düşük') bgStyle = styles.bgLow;
                                  else if (calcData.status === 'Yüksek') bgStyle = styles.bgHigh;

                                  return (
                                    <View key={i2} style={[styles.durumCard, bgStyle]}>
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
                                    </View>
                                  );
                                })
                              ) : (
                                <View style={styles.durumCard}>
                                  <Text style={styles.infoText}>
                                    Uygun rehber bilgisi bulunamadı.
                                  </Text>
                                </View>
                              )}
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

// ---------------------------------------------------------------------
// STYLES
// ---------------------------------------------------------------------
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

  // (A) Kart görünümü: Tetkik Adı / Sonuç / Önceki Sonuçlar / Alt kılavuz durumları
  sonucGroupCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 12,

    // Gölge
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1.5 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2
  },
  sonucText: {
    fontSize: 14,
    marginVertical: 2,
    color: '#444'
  },
  previousResultsContainer: {
    marginTop: 8,
    paddingLeft: 10
  },
  previousResultText: {
    fontSize: 14,
    color: '#555',
    marginTop: 2
  },

  // (B) Kılavuz durum "kartı": pastel renk + border
  durumCard: {
    marginTop: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,

    // Gölge
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1.5 },
    shadowOpacity: 0.15,
    shadowRadius: 2.5,
    elevation: 2
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
  }
});
