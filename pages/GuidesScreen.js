import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Alert, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { addGuide, getAllGuides, deleteGuide } from '../services/aGuidesService';
import { BASES } from '../shared/consts';
import { Picker } from '@react-native-picker/picker';

const GuidesScreen = () => {
  const navigation = useNavigation();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [base, setBase] = useState(BASES[0]);
  const [guides, setGuides] = useState([]);
  const [isGuideFormVisible, setIsGuideFormVisible] = useState(false);


  const fetchGuides = async () => {
    try {
      const data = await getAllGuides();
      setGuides(data);
      setBase(BASES[0]);
      console.log(data);
    } catch (error) {
      Alert.alert('Hata', error.message || 'Veriler alınamadı.');
    }
  };

  const handleAddGuide = async () => {
    if (!title || !description) {
      Alert.alert('Uyarı', 'Tüm alanları doldurun.');
      return;
    }
    try {
      await addGuide(title, description, base);
      setTitle('');
      setDescription('');
      fetchGuides();
      Alert.alert('Başarılı', 'Kılavuz eklendi!');
    } catch (error) {
      Alert.alert('Hata', error.message || 'Kılavuz eklenemedi.');
    }
  };

  const handleDeleteGuide = async (id) => {
    // Silme işlemi için onay isteyen bir alert gösterilir
    Alert.alert(
      'Silme Onayı',
      'Bu kılavuzu silmek istediğinizden emin misiniz?',
      [
        {
          text: 'Hayır', // 'Hayır' seçeneği silme işlemini iptal eder
          onPress: () => console.log('Silme işlemi iptal edildi'),
          style: 'cancel',
        },
        {
          text: 'Evet', // 'Evet' seçeneği silme işlemini gerçekleştirir
          onPress: async () => {
            try {
              await deleteGuide(id);  // Silme işlemi yapılır
              fetchGuides();  // Güncel kılavuzlar fetch edilir
              Alert.alert('Başarılı', 'Kılavuz silindi!');  // Başarı mesajı
            } catch (error) {
              Alert.alert('Hata', error.message || 'Kılavuz silinemedi.');  // Hata mesajı
            }
          },
        },
      ],
      { cancelable: false } // Kullanıcı dışarı tıklayarak iptal edemez
    );
  };


  useEffect(() => {
    fetchGuides();
  }, []);

  return (
    <View style={styles.container}>
      <View style={[styles.header, isGuideFormVisible ? { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 } : { borderBottomLeftRadius: 15, borderBottomRightRadius: 15 }]}>
        <Text style={styles.title}>Kılavuz Ekle</Text>
        {/* Kılavuz Düzenle yuvarlak butonu */}
        <TouchableOpacity
          style={[styles.circleButton, styles.guideButton]}
          onPress={() => setIsGuideFormVisible(!isGuideFormVisible)} // Kılavuz düzenleme formunu aç/kapat
        >
          <Text style={styles.circleButtonText}>+</Text>
        </TouchableOpacity>
      </View>



      {isGuideFormVisible && (
        <View style={{
          backgroundColor: 'lightgrey'
          , paddingTop: 20
          , paddingHorizontal: 16,
          paddingBottom: 20,
          borderBottomLeftRadius: 15,
          borderBottomRightRadius: 15
        }}>
          <TextInput
            style={styles.input}
            placeholder="Kılavuz İsmi"
            value={title}
            onChangeText={setTitle}
          />
          <TextInput
            style={styles.input}
            placeholder="Açıklama"
            value={description}
            onChangeText={setDescription}
          />

          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={base}
              onValueChange={(itemValue) => setBase(itemValue)}
              style={styles.picker}
            >
              {BASES.map((option, index) => (
                <Picker.Item key={index} label={option} value={option} />
              ))}
            </Picker>
          </View>

          {/* Ekle Butonu */}
          <TouchableOpacity style={styles.saveButton} onPress={handleAddGuide}>
            <Text style={styles.saveButtonText}>Ekle</Text>
          </TouchableOpacity>
        </View>
      )}

      <Text style={styles.subtitle}>Kılavuz Listesi</Text>

      <FlatList
        data={guides}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.guideItem}>

            <Text style={styles.guideTitle}>{`${item.title} (${item.base})`}</Text>
            <Text style={styles.guideDescription}>{item.description}</Text>
            {/* <Text style={styles.guideDescription}>{JSON.stringify(item.createdAt)}</Text> */}

            <View style={styles.actionButtons}>

              <TouchableOpacity
                style={styles.editButton}
                onPress={() => navigation.navigate('EditGuide', { guideId: item.id })}>
                <Text style={styles.editButtonText}>Görüntüle/Düzenle</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteGuide(item.id)}>
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
    backgroundColor: 'lightgrey',
    borderRadius: 15,
    padding: 20,

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
  guideItem: {
    padding: 15,
    backgroundColor: '#fff',
    marginBottom: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginTop: 5,
  },
  guideTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  guideDescription: {
    fontSize: 16,
    marginVertical: 5,
  },

  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12, // Köşeleri yuvarlama
    overflow: 'hidden', // Taşan köşeleri gizle
    marginBottom: 12,
  },
  picker: {
    backgroundColor: '#fff',
    height: 50,
  },

});
export default GuidesScreen;
