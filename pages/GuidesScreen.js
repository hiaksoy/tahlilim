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
      <View
        style={[
          styles.header,
          isGuideFormVisible
            ? { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }
            : { borderBottomLeftRadius: 15, borderBottomRightRadius: 15 }
        ]}
      >
        <Text style={styles.title}>Kılavuz Ekle</Text>
        {/* Kılavuz Düzenle yuvarlak butonu */}
        <TouchableOpacity
          style={[styles.circleButton, styles.guideButton]}
          onPress={() => setIsGuideFormVisible(!isGuideFormVisible)}
        >
          <Text style={styles.circleButtonText}>+</Text>
        </TouchableOpacity>
      </View>

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
            <Text style={styles.guideTitle}>{`${item.title} (${item.base})`}</Text>
            <Text style={styles.guideDescription}>{item.description}</Text>

            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => navigation.navigate('EditGuide', { guideId: item.id })}
              >
                <Text style={styles.editButtonText}>Görüntüle/Düzenle</Text>
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

export default GuidesScreen;

// ---------------------------------------------------------------------
// STYLES
// ---------------------------------------------------------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F8FE', // Pastel mavi arkaplan (diğer sayfalarla uyumlu)
    padding: 20
  },
  header: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',

    // Gölge (iOS + Android)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 3.5,
    elevation: 3
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2F5D8E',
    flex: 1 // Başlık ile buton arasında yer paylaşımı
  },
  circleButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#28a745',
    justifyContent: 'center',
    alignItems: 'center'
  },
  circleButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold'
  },
  guideButton: {
    marginLeft: 10,
    flex: 0,
    alignItems: 'center',
    justifyContent: 'center'
  },
  formContainer: {
    backgroundColor: '#fff',
    paddingTop: 20,
    paddingHorizontal: 16,
    paddingBottom: 20,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,

    // Gölge (form alanına da ekleyebiliriz)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
    marginBottom: 10
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
  editButton: {
    flex: 7,
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5,

    // Gölge
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 2.5,
    elevation: 2
  },
  editButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700'
  },
  deleteButton: {
    flex: 3,
    backgroundColor: '#ff4d4f',
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
  deleteButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700'
  }
});
