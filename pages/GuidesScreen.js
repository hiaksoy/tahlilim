import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  Alert, 
  StyleSheet 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { addGuide, getAllGuides, deleteGuide } from '../services/GuidesService';
import { BASES } from '../shared/consts';
import { Picker } from '@react-native-picker/picker';

const GuidesScreen = () => {
  const navigation = useNavigation();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [base, setBase] = useState(BASES[0]);
  const [guides, setGuides] = useState([]);

  // Kılavuz ekle formunun açık/kapalı olması
  const [isGuideFormVisible, setIsGuideFormVisible] = useState(false);

  // Rehberleri çek
  const fetchGuides = async () => {
    try {
      const data = await getAllGuides();
      setGuides(data);
      setBase(BASES[0]); // Varsayılan "base" değeri
    } catch (error) {
      Alert.alert('Hata', error.message || 'Veriler alınamadı.');
    }
  };

  // Kılavuz ekle
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

  // Kılavuz sil
  const handleDeleteGuide = async (id) => {
    Alert.alert(
      'Silme Onayı',
      'Bu kılavuzu silmek istediğinizden emin misiniz?',
      [
        {
          text: 'Hayır',
          onPress: () => console.log('Silme işlemi iptal edildi'),
          style: 'cancel'
        },
        {
          text: 'Evet',
          onPress: async () => {
            try {
              await deleteGuide(id);
              fetchGuides();
              Alert.alert('Başarılı', 'Kılavuz silindi!');
            } catch (error) {
              Alert.alert('Hata', error.message || 'Kılavuz silinemedi.');
            }
          }
        }
      ],
      { cancelable: false }
    );
  };

  useEffect(() => {
    fetchGuides();
  }, []);

  return (
    <View style={styles.container}>
      {/* Kılavuz Ekle Başlık + Buton */}
      <View style={styles.headerRow}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => setIsGuideFormVisible(!isGuideFormVisible)}
        >
          <Text style={styles.headerTitle}>Kılavuz Ekle</Text>
        </TouchableOpacity>

        {/* (1) + Butonu Yeşil */}
        <TouchableOpacity
          style={[styles.circleButton, { backgroundColor: '#28a745' }]}
          onPress={() => setIsGuideFormVisible(!isGuideFormVisible)}
        >
          <Text style={styles.circleButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* (2) Yalnızca açıkken beyaz form kartı görünsün */}
      {isGuideFormVisible && (
        <View style={styles.formContainer}>
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
            <Text style={styles.guideTitle}>
              {`${item.title} (${item.base})`}
            </Text>
            <Text style={styles.guideDescription}>{item.description}</Text>

            <View style={styles.actionButtons}>
              {/* (3) Düzenle Butonu Yeşil */}
              <TouchableOpacity
                style={[styles.actionBtn, styles.editButton]}
                onPress={() => navigation.navigate('EditGuide', { guideId: item.id })}
              >
                <Text style={styles.editButtonText}>Görüntüle/Düzenle</Text>
              </TouchableOpacity>

              {/* (3) Sil Butonu Kırmızı */}
              <TouchableOpacity
                style={[styles.actionBtn, styles.deleteButton]}
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

export default GuidesScreen;

// ---------------------------------------------------------------------
// STYLES
// ---------------------------------------------------------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F8FE', // Pastel mavi arkaplan
    padding: 20
  },
  // Başlık (Kılavuz Ekle) + Buton row
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15
  },
  headerButton: {
    flex: 1
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2F5D8E'
  },
  circleButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',

    // Gölge
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 3.5,
    elevation: 3
  },
  circleButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold'
  },
  formContainer: {
    backgroundColor: '#fff',
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 15,

    // Gölge
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2
  },
  input: {
    height: 48,
    backgroundColor: '#F9F9FC',
    paddingHorizontal: 15,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#CCC'
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 15,
    backgroundColor: '#F9F9FC'
  },
  picker: {
    height: 48
  },
  saveButton: {
    backgroundColor: '#5A8FCB',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center'
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2F5D8E',
    marginVertical: 10
  },
  guideItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',

    // Gölge
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 2.5,
    elevation: 2
  },
  guideTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2F5D8E'
  },
  guideDescription: {
    fontSize: 15,
    color: '#555',
    marginVertical: 5
  },
  actionButtons: {
    flexDirection: 'row',
    marginTop: 10
  },
  actionBtn: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',

    // Gölge
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 2.5,
    elevation: 2
  },
  editButton: {
    backgroundColor: '#28a745',
    marginRight: 5
  },
  editButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700'
  },
  deleteButton: {
    backgroundColor: '#ff4d4f',
    marginLeft: 5
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700'
  }
});
