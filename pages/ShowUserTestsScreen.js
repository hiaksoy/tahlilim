import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet
} from 'react-native';
import { useRoute } from '@react-navigation/native';

// Firestore bağlantısı
import { db } from '../configs/firebase_config';
import { collection, getDocs } from 'firebase/firestore';

// ---------------------------------------------------------------------
// YARDIMCI FONKSİYONLAR
// ---------------------------------------------------------------------
/**
 * "DD.MM.YYYY" formatındaki string'i
 * "YYYY-MM-DD" formatına dönüştürüp JS Date nesnesi döndürür.
 */
const parseDateString = (dateString) => {
  if (!dateString) {
    console.log('parseDateString => Gelen dateString boş:', dateString);
    return null;
  }

  console.log('parseDateString => Raw date string:', dateString);

  // Ör: "10.08.1995" -> ["10", "08", "1995"]
  const [day, month, year] = dateString.split('.');
  if (!day || !month || !year) {
    console.log('parseDateString => Invalid format:', dateString);
    return null;
  }

  // "1995-08-10" gibi
  const formattedDate = `${year}-${month}-${day}`;
  console.log('parseDateString => Formatted date:', formattedDate);

  const parsedDate = new Date(formattedDate);
  console.log('parseDateString => parsedDate:', parsedDate);
  return parsedDate;
};

/**
 * İki tarih arasındaki ay farkını hesaplar.
 */
const hesaplaAyOlarakYas = (bugun, dt) => {
  // dt: kullanıcı doğum tarihi
  const yilFarki = bugun.getFullYear() - dt.getFullYear();
  const ayFarki = bugun.getMonth() - dt.getMonth();
  return yilFarki * 12 + ayFarki;
};

/**
 * Virgül içeren metinleri float'a çevirir.
 * Örn: "3,5" -> 3.5
 */
const parseCommaFloat = (val) => {
  if (!val) return NaN;
  return parseFloat(String(val).replace(',', '.'));
};

/**
 * Firestore Timestamp veya normal Date'i düzgün formatta string'e çevirir.
 */
const formatTimestamp = (timestamp) => {
  if (!timestamp) return 'Tarih yok';
  // Firestore Timestamp ise
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

// ---------------------------------------------------------------------
// ANA BİLEŞEN
// ---------------------------------------------------------------------
const ShowUserTestsScreen = () => {
  const route = useRoute();
  const { userId, birthDate } = route.params || {};

  // Doğum tarihini JS Date nesnesine çeviriyoruz
  const dogumTarihi = parseDateString(birthDate);

  console.log('ShowUserTestsScreen => userId:', userId, 'birthDate:', birthDate);
  console.log('ShowUserTestsScreen => dogumTarihi (Date):', dogumTarihi);

  // State’ler
  const [tahliller, setTahliller] = useState([]);
  const [kilavuzlar, setKilavuzlar] = useState([]);
  const [loading, setLoading] = useState(true);

  // Expand / collapse
  const [expandedTahliller, setExpandedTahliller] = useState({});
  const [expandedResults, setExpandedResults] = useState({});

  // -------------------------------------------------------------------
  // 1) KOMPONENT MOUNT OLDUĞUNDA KILAVUZ VE TAHLİL VERİLERİNİ ÇEK
  // -------------------------------------------------------------------
  useEffect(() => {
    const fetchData = async () => {
      console.log('==> fetchData START, userId:', userId);

      if (!userId) {
        console.log('==> userId yok, setLoading(false) ile çıkış yapılıyor.');
        setLoading(false);
        return;
      }

      try {
        console.log('==> Kılavuzlar koleksiyonundan veri çekiliyor...');
        const kilavuzSnapshot = await getDocs(collection(db, 'Kılavuzlar'));
        let tempKilavuzlar = [];
        kilavuzSnapshot.forEach((docSnap) => {
          const data = docSnap.data();
          console.log('---- KILAVUZ docSnap.id:', docSnap.id, 'data:', data);
          tempKilavuzlar.push({
            id: docSnap.id,
            ...data
          });
        });

        console.log('==> Tahliller koleksiyonundan veri çekiliyor...');
        const tahlilSnapshot = await getDocs(collection(db, 'Tahliller'));
        let tempTahliller = [];
        tahlilSnapshot.forEach((docSnap) => {
          const data = docSnap.data();
          // UserID eşleşiyorsa ekle
          if (data.userId === userId) {
            console.log('---- TAHLIL docSnap.id:', docSnap.id, 'data:', data);
            tempTahliller.push({ id: docSnap.id, ...data });
          }
        });

        // State’lere atama
        console.log('==> setKilavuzlar ve setTahliller çağrılıyor...');
        setKilavuzlar(tempKilavuzlar);
        setTahliller(tempTahliller);
      } catch (err) {
        console.log('==> Veri çekme HATASI:', err);
      } finally {
        console.log('==> fetchData FINISHED, setLoading(false)');
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  // -------------------------------------------------------------------
  // 2) DURUM HESAPLAMA FONKSİYONU (Debug amaçlı bol console.log)
  // -------------------------------------------------------------------
  const getDurum = (tetkikAd, sonucStr) => {
    console.log('\n=== getDurum CALLED ===');
    console.log('-> tetkikAd:', tetkikAd, 'sonucStr:', sonucStr);

    if (!dogumTarihi || isNaN(dogumTarihi.getTime())) {
      console.log('--> dogumTarihi GEÇERSİZ veya YOK, return null');
      return null;
    }

    const bugun = new Date();
    const ayFarki = hesaplaAyOlarakYas(bugun, dogumTarihi);
    console.log('-> ayFarki (kullanıcı yaşı ay cinsinden):', ayFarki);

    const sonucFloat = parseCommaFloat(sonucStr);
    console.log('-> sonucFloat:', sonucFloat);
    if (isNaN(sonucFloat)) {
      console.log('--> sonucFloat NaN geldi, return null');
      return null;
    }

    console.log('-> Kılavuzlar sayısı:', kilavuzlar.length);
    for (let i = 0; i < kilavuzlar.length; i++) {
      const k = kilavuzlar[i];
      console.log(`-- Checking Kılavuz #${i}:`, k.id, k.title);
      console.log('--- k.Degerler:', k.Degerler);

      if (!k.Degerler) {
        console.log('--- k.Degerler YOK, continue...');
        continue;
      }

      const arr = k.Degerler[tetkikAd];
      console.log('--- arr for tetkikAd:', tetkikAd, ' =>', arr);
      if (!arr) {
        console.log('--- arr YOK, continue...');
        continue;
      }

      for (let j = 0; j < arr.length; j++) {
        const rangeObj = arr[j];
        console.log(`---- rangeObj #${j}:`, rangeObj);

        const minA = parseFloat(rangeObj.minAge);
        const maxA = parseFloat(rangeObj.maxAge);
        const minV = parseCommaFloat(rangeObj.minValue);
        const maxV = parseCommaFloat(rangeObj.maxValue);

        console.log(
          `---- Karşılaştırma: ayFarki=${ayFarki} in [${minA} - ${maxA}]?`
        );
        console.log(`---- Sonuç Float: ${sonucFloat} in [${minV} - ${maxV}]?`);

        if (ayFarki >= minA && ayFarki <= maxA) {
          let status = 'Normal';
          if (sonucFloat < minV) status = 'Düşük';
          else if (sonucFloat > maxV) status = 'Yüksek';

          const calcData = {
            status,
            minValue: minV,
            maxValue: maxV,
            kilavuzAdi: k.title || k.id
          };
          console.log(
            '----> EŞLEŞME BULUNDU => Durum objesi:',
            JSON.stringify(calcData)
          );
          return calcData;
        } else {
          console.log(`---- ayFarki bu aralığa girmedi, bakmaya devam...`);
        }
      }
    }

    console.log('--> HİÇBİR EŞLEŞME YOK, return null');
    return null;
  };

  // -------------------------------------------------------------------
  // 3) EXPAND / COLLAPSE TETİKLEYİCİLER
  // -------------------------------------------------------------------
  const toggleTahlilExpansion = (id) => {
    console.log('toggleTahlilExpansion => tahlilId:', id);
    setExpandedTahliller((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const toggleResultExpansion = (tahlilId, resultIndex) => {
    console.log(
      'toggleResultExpansion => tahlilId:',
      tahlilId,
      'resultIndex:',
      resultIndex
    );
    setExpandedResults((prev) => ({
      ...prev,
      [tahlilId]: {
        ...prev[tahlilId],
        [resultIndex]: !prev[tahlilId]?.[resultIndex]
      }
    }));
  };

  // -------------------------------------------------------------------
  // 4) RENDER
  // -------------------------------------------------------------------
  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#2F5D8E" />
        <Text style={styles.loadingText}>Veriler yükleniyor...</Text>
      </View>
    );
  }

  console.log('RENDER => tahliller:', tahliller, 'kilavuzlar:', kilavuzlar);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Kullanıcı Tahlilleri</Text>

      {tahliller.length === 0 ? (
        <Text style={styles.infoText}>
          Bu kullanıcıya ait tahlil bulunamadı.
        </Text>
      ) : (
        <FlatList
          data={tahliller}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            console.log('renderItem => Tahlil:', item);
            return (
              <View style={styles.tahlilCard}>
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
                  <Text style={styles.bold}>Tetkik İstem Zamanı:</Text>{' '}
                  {formatTimestamp(item.tetkikIstemZamani)}
                </Text>
                <Text style={styles.label}>
                  <Text style={styles.bold}>Numune Alma Zamanı:</Text>{' '}
                  {formatTimestamp(item.numuneAlmaZamani)}
                </Text>
                <Text style={styles.label}>
                  <Text style={styles.bold}>Oluşturulma:</Text>{' '}
                  {formatTimestamp(item.createdAt)}
                </Text>

                {/* Değerler (göster/gizle) */}
                {item.degerler?.length > 0 ? (
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
                          console.log('renderItem => deger:', d);

                          const isExpanded = expandedResults[item.id]?.[idx] || false;
                          // Durumu hesapla
                          const calcData = getDurum(d.ad, d.sonuc);

                          // Arka plan rengi
                          let bgStyle = {};
                          if (calcData?.status === 'Normal') {
                            bgStyle = styles.bgNormal;
                          } else if (calcData?.status === 'Düşük') {
                            bgStyle = styles.bgLow;
                          } else if (calcData?.status === 'Yüksek') {
                            bgStyle = styles.bgHigh;
                          }

                          return (
                            <View key={idx} style={[styles.sonucItem, bgStyle]}>
                              <Text style={styles.sonucText}>
                                <Text style={styles.bold}>Tetkik Adı:</Text> {d.ad}
                              </Text>
                              <Text style={styles.sonucText}>
                                <Text style={styles.bold}>Sonuç:</Text> {d.sonuc}
                              </Text>

                              {/* Detayları Göster / Gizle */}
                              <TouchableOpacity
                                style={styles.detailButton}
                                onPress={() => toggleResultExpansion(item.id, idx)}
                              >
                                <Text style={styles.detailButtonText}>
                                  {isExpanded
                                    ? '▼ Detayları Gizle'
                                    : '► Detayları Göster'}
                                </Text>
                              </TouchableOpacity>

                              {/* Detaylar */}
                              {isExpanded && (
                                <View style={styles.detayContainer}>
                                  {calcData ? (
                                    <>
                                      <Text>
                                        <Text style={styles.bold}>Durum:</Text>{' '}
                                        {calcData.status}
                                      </Text>
                                      <Text>
                                        <Text style={styles.bold}>
                                          Referans Aralık:
                                        </Text>{' '}
                                        {calcData.minValue} - {calcData.maxValue}
                                      </Text>
                                      <Text>
                                        <Text style={styles.bold}>
                                          Kılavuz Adı:
                                        </Text>{' '}
                                        {calcData.kilavuzAdi}
                                      </Text>
                                    </>
                                  ) : (
                                    <Text style={styles.infoText}>
                                      Uygun rehber bilgisi bulunamadı.
                                    </Text>
                                  )}
                                </View>
                              )}
                            </View>
                          );
                        })}
                      </View>
                    )}
                  </>
                ) : (
                  <Text style={styles.infoText}>
                    Tahlil değer bilgisi bulunamadı.
                  </Text>
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
    backgroundColor: '#F3F8FE', // Hafif pastel bir mavi arkaplan
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

    // iOS gölge
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3.5,

    // Android gölge
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
  detailButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#5A8FCB',
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginTop: 8
  },
  detailButtonText: {
    color: '#fff',
    fontWeight: '600'
  },
  detayContainer: {
    marginTop: 10,
    backgroundColor: '#f9f9ff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10
  },
  // Durum bazlı arka planlar
  bgNormal: {
    backgroundColor: '#E7F6E7' // daha yumuşak bir yeşil
  },
  bgLow: {
    backgroundColor: '#FFF8DB' // daha yumuşak bir sarı
  },
  bgHigh: {
    backgroundColor: '#FFE5E5' // daha yumuşak bir kırmızı/pembe
  }
});
