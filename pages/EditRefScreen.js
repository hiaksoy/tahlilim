import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, FlatList } from 'react-native';
import { getGuideById, updateGuide, getSubTables, addSubTable, deleteSubTable } from '../services/GuidesService';

const EditGuideScreen = ({ route, navigation }) => {
  const { refId } = route.params;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [ref, setRef] = useState(''); // Değerler eklemek için

  const [subTables, setSubTables] = useState({});
  const [isGuideFormVisible, setIsGuideFormVisible] = useState(false); // Kılavuz düzenleme formunun görünürlüğü
  const [isValueFormVisible, setIsValueFormVisible] = useState(false); // Değer ekleme formunun görünürlüğü

  useEffect(() => {
    const fetchGuide = async () => {
      try {
        const guide = await getGuideById(refId);
        const subTables = await getSubTables(refId);
        setTitle(guide.title);
        setDescription(guide.description);
        setSubTables(subTables);  // Alt tabloları ayarla
      } catch (error) {
        Alert.alert('Hata', error.message || 'Kılavuz bilgileri alınamadı.');
      }
    };
    fetchGuide();
  }, [refId]);

  const fetchGuide = async () => {
    try {
      const guide = await getGuideById(refId);
      const subTables = await getSubTables(refId);
      setTitle(guide.title);
      setDescription(guide.description);
      setSubTables(subTables);  // Alt tabloları ayarla
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

  const handleAddRef = async () => {
    if (!ref) {
      Alert.alert('Uyarı', 'Tüm alanları doldurun.');
      return;
    }
    try {
      await addSubTable(refId, 'Degerler', { ref });
      Alert.alert('Başarılı', 'Değer eklendi!');
      setRef('');
      setIsValueFormVisible(false); // Değer ekleme formunu gizle
      fetchGuide();
    } catch (error) {
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
          <TextInput
            style={styles.input}
            placeholder="Başlık"
            value={title}
            onChangeText={setTitle}
          />
          <TextInput
            style={styles.input}
            placeholder="Açıklama"
            value={description}
            onChangeText={setDescription}
          />

          {/* Güncelle Butonu */}
          <TouchableOpacity style={styles.saveButton} onPress={handleUpdateGuide}>
            <Text style={styles.saveButtonText}>Güncelle</Text>
          </TouchableOpacity>
        </>
      )}

      <View style={styles.valueSection}>
        <Text style={styles.title}>Değer Ekle</Text>
        {/* Değer Ekle yuvarlak butonu */}
        <TouchableOpacity
          style={[styles.circleButton, styles.valueButton]}
          onPress={() => setIsValueFormVisible(!isValueFormVisible)} // Değer ekleme formunu aç/kapat
        >
          <Text style={styles.circleButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Değer ekleme formu */}
      {isValueFormVisible && (
        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Değer Başlığı"
            value={ref}
            onChangeText={setRef}
          />
          <TouchableOpacity style={styles.saveButton} onPress={handleAddRef}>
            <Text style={styles.saveButtonText}>Değer Ekle</Text>
          </TouchableOpacity>
        </View>
      )}

      <Text style={styles.subtitle}>Alt Tablolar</Text>
      <FlatList
        data={subTables}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.tableContainer}>
            <Text style={styles.tableTitle}>{item.ref}</Text>
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => navigation.navigate('EditGuide', { refId: item.id })}
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
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
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
});

export default EditGuideScreen;
