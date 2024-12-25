import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { getTahlillerByUserId } from '../services/aTahlillerService';

// 📆 Yardımcı Fonksiyon: Firestore Timestamp Formatlama
const formatTimestamp = (timestamp) => {
  if (!timestamp) return 'Tarih yok';

  // Firestore Timestamp kontrolü
  const date = timestamp.seconds ? new Date(timestamp.seconds * 1000) : new Date(timestamp);

  // Tarihi formatlama
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Aylar 0'dan başlar
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

const ShowUserTestsScreen = () => {
  const route = useRoute();
  const { userId } = route.params || {}; // Route'dan gelen userId
  const [tahliller, setTahliller] = useState([]);
  const [loading, setLoading] = useState(true);

  // Değerler kısmının açılıp kapanmasını kontrol etmek için
  const [expandedIndex, setExpandedIndex] = useState(null); // Hangi öğenin açılacağını tutar
  const [expandedResultIndex, setExpandedResultIndex] = useState(null); // Hangi resultItem açılacak

  const fetchUserTahliller = async () => {
    try {
      const data = await getTahlillerByUserId(userId);
      setTahliller(data || []);
      console.log('Tahliller:', data);
    } catch (error) {
      console.log('Hata:', error.message || 'Tahliller alınamadı.');
    } finally {
      setLoading(false);
    }
  };

  const toggleExpansion = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index); // Aynı öğeye tıklandığında kapanmasını sağlar
  };

  const toggleResultExpansion = (index) => {
    setExpandedResultIndex(expandedResultIndex === index ? null : index); // Aynı öğeye tıklandığında kapanmasını sağlar
  };

  useEffect(() => {
    if (userId) {
      fetchUserTahliller();
    }
  }, [userId]);

  if (loading) {
    return <ActivityIndicator size="large" style={styles.loader} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Kullanıcı Tahlilleri</Text>
      {tahliller.length > 0 ? (
        <FlatList
          data={tahliller}
          keyExtractor={(item) => item.id || Math.random().toString()}
          renderItem={({ item, index }) => (
            <View style={styles.card}>
              <Text>
                <Text style={styles.label}>Rapor No:</Text> {item.raporNo || 'N/A'}
              </Text>
              <Text>
                <Text style={styles.label}>Tanı:</Text> {item.tani || 'N/A'}
              </Text>
              <Text>
                <Text style={styles.label}>Numune Türü:</Text> {item.numuneTuru || 'N/A'}
              </Text>
              <Text>
                <Text style={styles.label}>Tetkik İstem Zamanı:</Text> {formatTimestamp(item.tetkikIstemZamani)}
              </Text>
              <Text>
                <Text style={styles.label}>Numune Alma Zamanı:</Text> {formatTimestamp(item.numuneAlmaZamani)}
              </Text>
              <Text>
                <Text style={styles.label}>Oluşturulma Tarihi:</Text> {formatTimestamp(item.createdAt)}
              </Text>

              {/* 📊 Tahlil Değerleri */}
              {item.degerler && item.degerler.length > 0 ? (
                <View>
                  <Text
                    style={styles.expandButton}
                    onPress={() => toggleExpansion(index)} // Açma/kapama işlemi
                  >
                    {expandedIndex === index ? '▼ Değerleri Gizle' : '► Değerleri Göster'}
                  </Text>
                  {expandedIndex === index && (
                    <View style={styles.results}>
                      {item.degerler.map((sonuc, subIndex) => (
                        <View key={subIndex} style={styles.resultItem}>
                          <Text>
                            <Text style={styles.label}>Tetkik Adı:</Text> {sonuc.ad || 'N/A'}
                          </Text>
                          <Text>
                            <Text style={styles.label}>Sonuç:</Text> {sonuc.sonuc || 'N/A'}
                          </Text>

                          {/* 📋 Açılır Kapanır Değerler */}
                          <Text
                            style={styles.expandButton}
                            onPress={() => toggleResultExpansion(subIndex)} // Açma/kapama işlemi
                          >
                            {expandedResultIndex === subIndex ? '▼ Detayları Gizle' : '► Detayları Göster'}
                          </Text>

                          {expandedResultIndex === subIndex && (
                            <View style={styles.details}>
                              <Text>
                                <Text style={styles.label}>Örnek Bilgi 1:</Text> Örnek Bilgi Değeri 1
                              </Text>
                              <Text>
                                <Text style={styles.label}>Örnek Bilgi 2:</Text> Örnek Bilgi Değeri 2
                              </Text>
                              <Text>
                                <Text style={styles.label}>Örnek Bilgi 3:</Text> Örnek Bilgi Değeri 3
                              </Text>
                            </View>
                          )}
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              ) : (
                <Text style={styles.noResult}>Değer bilgisi bulunamadı.</Text>
              )}
            </View>
          )}
        />
      ) : (
        <Text style={styles.noData}>Bu kullanıcıya ait tahlil bulunamadı.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    padding: 16,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
    color: '#333',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#FFF',
    padding: 14,
    marginVertical: 8,
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
  },
  label: {
    fontWeight: 'bold',
    color: '#444',
  },
  expandButton: {
    fontSize: 16,
    color: '#007BFF',
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 8,
    textDecorationLine: 'underline',
    textAlign: 'left',
  },
  results: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  resultItem: {
    marginTop: 6,
    padding: 8,
    backgroundColor: '#F5F7FA',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  details: {
    marginTop: 6,
    padding: 8,
    backgroundColor: '#F0F4F8',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#D0D0D0',
  },
  noResult: {
    marginTop: 8,
    fontSize: 14,
    color: '#888',
    fontStyle: 'italic',
  },
  noData: {
    textAlign: 'center',
    fontSize: 16,
    color: '#888',
    marginTop: 20,
  },
});

export default ShowUserTestsScreen;
