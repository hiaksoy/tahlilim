// EditGuideScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, FlatList } from 'react-native';
import { getGuideById, updateGuide } from '../services/GuidesService';

const EditGuideScreen = ({ route, navigation }) => {
  const { guideId } = route.params;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [subTables, setSubTables] = useState({});

  useEffect(() => {
    const fetchGuide = async () => {
        try {
          const guide = await getGuideById(guideId);
          setTitle(guide.title);
          setDescription(guide.description);
          setSubTables(guide.subTables);  // Alt tabloları ayarla
        } catch (error) {
          Alert.alert('Hata', error.message || 'Kılavuz bilgileri alınamadı.');
        }
      };
      fetchGuide();
    }, [guideId]);

  const handleUpdateGuide = async () => {
    if (!title || !description) {
      Alert.alert('Uyarı', 'Tüm alanları doldurun.');
      return;
    }
    try {
      await updateGuide(guideId, { title, description });
      Alert.alert('Başarılı', 'Kılavuz güncellendi!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Hata', 'Kılavuz güncellenemedi.');
    }
  };
  console.log(subTables)
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Kılavuz Düzenle</Text>

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

                <Text style={styles.subtitle}>Alt Tablolar</Text>
                

                <FlatList
                data={Object.entries(subTables)}
                keyExtractor={([item]) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.tableContainer}>
                    <Text style={styles.tableTitle}>{item}</Text>
                    

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



      <TouchableOpacity style={styles.saveButton} onPress={handleUpdateGuide}>
        <Text style={styles.saveButtonText}>Güncelle</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: '#f5f5f5',
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
    row: {
      padding: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#ddd',
    },
    cell: {
      fontSize: 16,
      color: '#333',
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
  });
  

export default EditGuideScreen;
