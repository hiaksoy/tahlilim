import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Alert, StyleSheet } from 'react-native';
import { addGuide, getGuides, deleteGuide } from '../services/GuidesService';
import { useNavigation } from '@react-navigation/native'; 




const GuidesScreen = () => {
  const navigation = useNavigation();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [guides, setGuides] = useState([]);



  const fetchGuides = async () => {
    try {
      const data = await getGuides();
      setGuides(data);
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
      await addGuide(title, description);
      setTitle('');
      setDescription('');
      fetchGuides();
      Alert.alert('Başarılı', 'Kılavuz eklendi!');
    } catch (error) {
      Alert.alert('Hata', error.message || 'Kılavuz eklenemedi.');
    }
  };

  const handleDeleteGuide = async (id) => {
    try {
      await deleteGuide(id);
      fetchGuides();
      Alert.alert('Başarılı', 'Kılavuz silindi!');
    } catch (error) {
      Alert.alert('Hata', error.message || 'Kılavuz silinemedi.');
    }
  };



  useEffect(() => {
    fetchGuides();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Kılavuzlar</Text>

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
      <TouchableOpacity style={styles.button} onPress={handleAddGuide}>
        <Text style={styles.buttonText}>Kılavuz Ekle</Text>
      </TouchableOpacity>

      <FlatList
        data={guides}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.guideItem}>
          
              <Text style={styles.guideTitle}>{item.title}</Text>
              <Text style={styles.guideDescription}>{item.description}</Text>
         
            <View style={styles.actionButtons}>

              <TouchableOpacity
                style={styles.editButton}
                onPress={() => navigation.navigate('EditGuide', { guideId: item.id })}>
                <Text style={styles.editButtonText}>Düzenle</Text>
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
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
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
  button: {
    height: 50,
    backgroundColor: '#007BFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  guideItem: {
    padding: 15,
    backgroundColor: '#fff',
    marginBottom: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  guideTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  guideDescription: {
    fontSize: 16,
    marginVertical: 5,
  },
  subTablesContainer: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    marginTop: 10,
  },
  
  editButton: {
    flex: 7,  // %70 genişlik
    backgroundColor: '#28a745',  // Yeşil
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5,  // Aralarındaki boşluk
  },
  
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  
  deleteButton: {
    flex: 3,  // %30 genişlik
    backgroundColor: '#ff4d4f',  // Kırmızı
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
  
  tableContainer: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  tableTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  addRowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  ageGroup: {
    fontSize: 16,
    marginVertical: 2,
    color: '#555',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  cell: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    marginHorizontal: 5,
  },
});

export default GuidesScreen;
