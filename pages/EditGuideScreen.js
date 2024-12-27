import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, FlatList } from 'react-native';
import { REFS } from '../shared/consts';
import { Picker } from '@react-native-picker/picker';
import { updateGuide, getGuideById } from '../services/aGuidesService';
import { addRef, getAllRefs } from '../services/aDegerlerService';
import { BASES } from '../shared/consts';

const EditGuideScreen = ({ route, navigation }) => {
  const { guideId } = route.params;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [base, setBase] = useState(''); 
  const [ref, setRef] = useState(''); // Değerler eklemek için

  const [allRefs, setAllRefs] = useState({});
  const [isGuideFormVisible, setIsGuideFormVisible] = useState(false); // Kılavuz düzenleme formunun görünürlüğü
  const [isValueFormVisible, setIsValueFormVisible] = useState(false); // Değer ekleme formunun görünürlüğü

  useEffect(() => {
    const fetchGuide = async () => {
      try {
        const guide = await getGuideById(guideId);
        const allRefs = await getAllRefs(guideId);
        setTitle(guide.title);
        setDescription(guide.description);
        setBase(guide.base);
        setRef(REFS[0]); // İlk değeri seç
        setAllRefs(allRefs);  // Alt tabloları ayarla
      } catch (error) {
        Alert.alert('Hata', error.message || 'Kılavuz bilgileri alınamadı.');
      }
    };
    fetchGuide();
  }, [guideId]);

  const fetchGuide = async () => {
    try {
      const guide = await getGuideById(guideId);
      const allRefs = await getAllRefs(guideId);
      setTitle(guide.title);
      setDescription(guide.description);
      setBase(guide.base);
      setRef(REFS[0]); // İlk değeri seç
      setAllRefs(allRefs);  // Alt tabloları ayarla
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
      await updateGuide(guideId, title, description, base);
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
      await addRef(guideId, ref);
      Alert.alert('Başarılı', 'Değer eklendi!');
      setRef('');
      setIsValueFormVisible(false); // Değer ekleme formunu gizle
      fetchGuide();
    } catch (error) {
      Alert.alert('Hata', 'Değer eklenemedi.');
      // console.log(error);
    }
  };

  const handleDeleteGuide = async (id) => {
    try {
      await deleteSubTable(guideId, id);
      fetchGuide();
      Alert.alert('Başarılı', 'Değer silindi!');
    } catch (error) {
      Alert.alert('Hata', error.message || 'Değer silinemedi.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, isGuideFormVisible ? { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 } : { borderBottomLeftRadius: 15, borderBottomRightRadius: 15, marginBottom: 15 }]}>
        <TouchableOpacity onPress={() => setIsGuideFormVisible(!isGuideFormVisible)}>
          <Text style={styles.title}>Kılavuzu Düzenle</Text>
        </TouchableOpacity>

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
        <View style={{
          backgroundColor: '#F7F6F2'
          , paddingTop: 20
          , paddingHorizontal: 16,
          paddingBottom: 20,
          borderBottomLeftRadius: 15,
          borderBottomRightRadius: 15,
          marginBottom: 15
        }}>
          <TextInput
            style={styles.input}
            placeholder="Başlık"
            value={title}
            onChangeText={setTitle}
          />
          <TextInput
            style={styles.input}
            placeholder="Açıklamaaa"
            value={description}
            onChangeText={setDescription}
          />

          <View style={{ borderRadius: 8, overflow: 'hidden', backgroundColor: '#fff' }}>
            <Picker
              selectedValue={base}
              onValueChange={(itemValue) => setBase(itemValue)}
              style={{ backgroundColor: '#fff' }}  // İsteğe bağlı stil
            >
              {BASES.map((option, index) => (
                <Picker.Item key={index} label={option} value={option} />
              ))}
            </Picker>
          </View>


          {/* Güncelle Butonu */}
          <TouchableOpacity style={styles.saveButton} onPress={handleUpdateGuide}>
            <Text style={styles.saveButtonText}>Güncelle</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={[styles.header, isValueFormVisible ? { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 } : { borderBottomLeftRadius: 15, borderBottomRightRadius: 15 }]}>
      <TouchableOpacity onPress={() => setIsValueFormVisible(!isValueFormVisible)}>
          <Text style={styles.title}>Değer Ekle</Text>
        </TouchableOpacity>
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
        <View style={{
          backgroundColor: '#F7F6F2'
          , paddingTop: 20
          , paddingHorizontal: 16,
          paddingBottom: 20,
          borderBottomLeftRadius: 15,
          borderBottomRightRadius: 15,
        }}>
          <View style={{
            borderRadius: 8,
            overflow: 'hidden',
            backgroundColor: '#fff',
            height: 50 // Dış View'in yüksekliğini manuel ayarlayabilirsiniz
          }}>
            <Picker
              selectedValue={ref}
              onValueChange={(itemValue) => setRef(itemValue)}
              style={[styles.input, { height: '100%' }]} // Picker'ın yüksekliğini %100 yaparak dış view ile uyumlu hale getirin
            >
              {REFS.map((option, index) => (
                <Picker.Item key={index} label={option} value={option} />
              ))}
            </Picker>
          </View>




          <TouchableOpacity style={styles.saveButton} onPress={handleAddRef}>
            <Text style={styles.saveButtonText}>Değer Ekle</Text>
          </TouchableOpacity>
        </View>
      )}
















      <Text style={styles.subtitle}>Kılavuz : {title} / Referans Degerler</Text>
      <FlatList
        data={allRefs}
        keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()} // 'id' undefined ise 'index' kullan
        renderItem={({ item }) => (
          <View style={styles.tableContainer}>
            <Text style={styles.tableTitle}>{item.key}</Text>
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => navigation.navigate('EditRef', { guideId, refName: item.key })}
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
    backgroundColor: '#C8C6C6',
  },
  header: {
    flexDirection: 'row', // Yatayda hizalama
    justifyContent: 'space-between', // Başlık ile buton arasında boşluk bırak
    alignItems: 'center', // Dikeyde ortalama
    backgroundColor: '#F7F6F2',
    borderRadius: 15,
    padding: 20
  },
  title: {
    marginTop: 3,
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
    backgroundColor: '#F7F6F2',
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
    backgroundColor: '#4B6587', // Yeşil
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
    backgroundColor: '#CD4439', // Kırmızı
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
    backgroundColor: '#4B6587',
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
