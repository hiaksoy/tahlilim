import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, FlatList } from 'react-native';
import { REFS, BASES } from '../shared/consts';
import { Picker } from '@react-native-picker/picker';
import { updateGuide, getGuideById } from '../services/GuidesService';
import { addRef, getAllRefs, deleteRef } from '../services/ReferencesService';

const EditGuideScreen = ({ route, navigation }) => {
  const { guideId } = route.params;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [base, setBase] = useState('');
  const [ref, setRef] = useState('');

  const [allRefs, setAllRefs] = useState([]);
  const [isGuideFormVisible, setIsGuideFormVisible] = useState(false);
  const [isValueFormVisible, setIsValueFormVisible] = useState(false);

  useEffect(() => {
    const fetchGuide = async () => {
      try {
        const guide = await getGuideById(guideId);
        const allRefsArray = await getAllRefs(guideId);
        setTitle(guide.title);
        setDescription(guide.description);
        setBase(guide.base);
        setRef(REFS[0]);
        setAllRefs(allRefsArray);
      } catch (error) {
        Alert.alert('Hata', error.message || 'Kılavuz bilgileri alınamadı.');
      }
    };
    fetchGuide();
  }, [guideId]);

  const fetchGuide = async () => {
    try {
      const guide = await getGuideById(guideId);
      const allRefsArray = await getAllRefs(guideId);
      setTitle(guide.title);
      setDescription(guide.description);
      setBase(guide.base);
      setRef(REFS[0]);
      setAllRefs(allRefsArray);
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
      setIsValueFormVisible(false);
      fetchGuide();
    } catch (error) {
      Alert.alert('Hata', 'Değer eklenemedi.');
    }
  };


  const handleDeleteRef = async (refName) => {
    Alert.alert(
      'Silme Onayı',
      `Referans "${refName}" silmek istediğinizden emin misiniz?`,
      [
        {
          text: 'Hayır',
          onPress: () => console.log('Silme işlemi iptal edildi'),
          style: 'cancel',
        },
        {
          text: 'Evet',
          onPress: async () => {
            try {
              await deleteRef(guideId, refName);
              fetchGuide();
              Alert.alert('Başarılı', 'Referans silindi!');
            } catch (error) {
              Alert.alert('Hata', error.message || 'Referans silinemedi.');
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <View style={styles.container}>

      {/* ----- Kılavuz Düzenle Kısmı ----- */}
      <View
        style={[
          styles.header,
          isGuideFormVisible
            ? { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }
            : { borderBottomLeftRadius: 15, borderBottomRightRadius: 15, marginBottom: 15 }
        ]}
      >
        <TouchableOpacity onPress={() => setIsGuideFormVisible(!isGuideFormVisible)}>
          <Text style={styles.title}>Kılavuzu Düzenle</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.circleButton, styles.guideButton]}
          onPress={() => setIsGuideFormVisible(!isGuideFormVisible)}
        >
          <Text style={styles.circleButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      {isGuideFormVisible && (
        <View style={styles.formWrapper}>
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

          <TouchableOpacity style={styles.saveButton} onPress={handleUpdateGuide}>
            <Text style={styles.saveButtonText}>Güncelle</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* ----- Değer Ekle Kısmı ----- */}
      <View
        style={[
          styles.header,
          isValueFormVisible
            ? { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }
            : { borderBottomLeftRadius: 15, borderBottomRightRadius: 15 }
        ]}
      >
        <TouchableOpacity onPress={() => setIsValueFormVisible(!isValueFormVisible)}>
          <Text style={styles.title}>Değer Ekle</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.circleButton, styles.valueButton]}
          onPress={() => setIsValueFormVisible(!isValueFormVisible)}
        >
          <Text style={styles.circleButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      {isValueFormVisible && (
        <View style={[styles.formWrapper, { marginBottom: 0 }]}>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={ref}
              onValueChange={(itemValue) => setRef(itemValue)}
              style={styles.picker}
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

      {/* ----- Kılavuz Listesi ----- */}
      <Text style={styles.subtitle}>Kılavuz : {title} / Referans Değerler</Text>
      <FlatList
        data={allRefs}
        keyExtractor={(item, index) =>
          item.key ? item.key.toString() : index.toString()
        }
        renderItem={({ item }) => (
          <View style={styles.tableContainer}>
            <Text style={styles.tableTitle}>{item.key}</Text>
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() =>
                  navigation.navigate('EditRef', {
                    guideId,
                    refName: item.key
                  })
                }
              >
                <Text style={styles.editButtonText}>Düzenle</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteRef(item.key)} // Pass refName instead of id
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

export default EditGuideScreen;

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
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,

    // iOS gölge
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3.5,

    // Android gölge
    elevation: 3,
    marginBottom: 15
  },
  title: {
    marginTop: 3,
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2F5D8E',
    flex: 1
  },
  circleButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#5A8FCB',
    justifyContent: 'center',
    alignItems: 'center',

    // Gölge
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3.5,
    elevation: 3
  },
  circleButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold'
  },
  guideButton: {
    marginLeft: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  valueButton: {
    marginLeft: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  formWrapper: {
    backgroundColor: '#fff',
    borderRadius: 15,
    paddingVertical: 20,
    paddingHorizontal: 16,
    marginBottom: 15,

    // Gölge
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3.5,
    elevation: 3
  },
  input: {
    height: 50,
    backgroundColor: '#fefefe',
    paddingHorizontal: 15,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd'
  },
  pickerContainer: {
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#fefefe',
    borderWidth: 1,
    borderColor: '#ddd'
  },
  picker: {
    height: 50,
    backgroundColor: '#fefefe'
  },
  saveButton: {
    backgroundColor: '#2F5D8E',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,

    // Gölge
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3.5,
    elevation: 3
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700'
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginVertical: 10
  },
  tableContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',

    // Gölge
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2
  },
  tableTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2F5D8E',
    marginBottom: 8
  },
  actionButtons: {
    flexDirection: 'row',
    marginTop: 10
  },
  editButton: {
    flex: 7,
    backgroundColor: '#4B6587',
    padding: 10,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5,

    // Gölge
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1.5 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2
  },
  editButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700'
  },
  deleteButton: {
    flex: 3,
    backgroundColor: '#CD4439',
    padding: 10,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',

    // Gölge
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1.5 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700'
  }
});
