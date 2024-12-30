import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  FlatList,
} from 'react-native';
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

  // ---------------------------------------------------------------------
  // FETCH DATA
  // ---------------------------------------------------------------------
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

  // ---------------------------------------------------------------------
  // GUIDE UPDATE
  // ---------------------------------------------------------------------
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

  // ---------------------------------------------------------------------
  // REFERENCE ADD
  // ---------------------------------------------------------------------
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

  // ---------------------------------------------------------------------
  // REFERENCE DELETE
  // ---------------------------------------------------------------------
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

  // ---------------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------------
  return (
    <View style={styles.container}>
      {/* Kılavuzu Düzenle Başlık + Buton */}
      <View style={styles.headerRow}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => setIsGuideFormVisible(!isGuideFormVisible)}
        >
          <Text style={styles.headerTitle}>Mevcut Kılavuzu Düzenle</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.circleButton, { backgroundColor: '#28a745' }]} // (3) + butonu yeşil
          onPress={() => setIsGuideFormVisible(!isGuideFormVisible)}
        >
          <Text style={styles.circleButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* (1) Kılavuzu düzenle (açılır/kapanır): 
          Sadece açıldığında beyaz kart gözüksün (arkaplan) */}
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

      {/* Değer Ekle Başlık + Buton */}
      <View style={styles.headerRow}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => setIsValueFormVisible(!isValueFormVisible)}
        >
          <Text style={styles.headerTitle}>Kılavuza Referans Ekle</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.circleButton, { backgroundColor: '#28a745' }]} // (3) yeşil buton
          onPress={() => setIsValueFormVisible(!isValueFormVisible)}
        >
          <Text style={styles.circleButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* (1) Değer ekle (açılır/kapanır):
          Sadece açıldığında beyaz kart gözüksün */}
      {isValueFormVisible && (
        <View style={styles.formWrapper}>
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
            <Text style={styles.saveButtonText}>Referans Ekle</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Kılavuz Listesi */}
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
                style={[styles.actionBtn, styles.editButton]}
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
                style={[styles.actionBtn, styles.deleteButton]}
                onPress={() => handleDeleteRef(item.key)}
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
    backgroundColor: '#F3F8FE', // Pastel mavi arkaplan
    padding: 20
  },
  // Üst başlık (kılavuz/değer ekle) satırı
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
    width: 44,
    height: 44,
    borderRadius: 22,
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
  formWrapper: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,

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
    backgroundColor: '#5A8FCB',
    borderRadius: 10,
    paddingVertical: 12,
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
    marginBottom: 10
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
  actionBtn: {
    flex: 1,
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
  editButton: {
    backgroundColor: '#28a745', // (3) Düzenle butonu yeşil
    marginRight: 5
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700'
  },
  deleteButton: {
    backgroundColor: '#ff4d4f', // (3) Sil butonu kırmızı
    marginLeft: 5
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700'
  }
});
