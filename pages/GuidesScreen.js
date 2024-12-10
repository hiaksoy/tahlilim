import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Alert, StyleSheet } from 'react-native';
import { addGuide, getGuides, deleteGuide } from '../services/GuidesService';

// SubTable bileşeni
const SubTable = ({ tableName }) => {
  const [ageGroups, setAgeGroups] = useState([]);
  const [newAgeGroup, setNewAgeGroup] = useState('');
  const [columns, setColumns] = useState([
    'Age Group', 'Number', 'Geometric mean ± SD', 'Mean ± SD', 'Min–max', '95% confidence interval'
  ]);
  const [rows, setRows] = useState([]);

  const handleAddAgeGroup = () => {
    if (!newAgeGroup) {
      Alert.alert("Uyarı", "Yaş grubu boş olamaz.");
      return;
    }
    setAgeGroups([...ageGroups, newAgeGroup]);
    setNewAgeGroup('');
  };

  const handleAddRow = () => {
    const newRow = columns.reduce((acc, column) => {
      acc[column] = ''; // Boş değerlerle başlat
      return acc;
    }, {});
    setRows([...rows, newRow]);
  };

  const handleEditRow = (rowIndex, columnName, value) => {
    const updatedRows = [...rows];
    updatedRows[rowIndex][columnName] = value;
    setRows(updatedRows);
  };

  return (
    <View style={styles.tableContainer}>
      <Text style={styles.tableTitle}>{tableName}</Text>
      
      {/* Yaş Grubu Ekle */}
      <View style={styles.addRowContainer}>
        <TextInput
          style={styles.input}
          placeholder="Yeni Yaş Grubu"
          value={newAgeGroup}
          onChangeText={setNewAgeGroup}
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAddAgeGroup}>
          <Text style={styles.addButtonText}>Ekle</Text>
        </TouchableOpacity>
      </View>

      {/* Yaş Gruplarını Göster */}
      <FlatList
        data={ageGroups}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <Text style={styles.ageGroup}>{item}</Text>
        )}
      />

      {/* Tablo Sütunları ve Satırları */}
      <TouchableOpacity style={styles.addButton} onPress={handleAddRow}>
        <Text style={styles.addButtonText}>Satır Ekle</Text>
      </TouchableOpacity>

      <FlatList
        data={rows}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.row}>
            {columns.map((column) => (
              <TextInput
                key={column}
                style={styles.cell}
                placeholder={column}
                value={item[column]}
                onChangeText={(value) => handleEditRow(index, column, value)}
              />
            ))}
          </View>
        )}
      />
    </View>
  );
};

const GuidesScreen = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [guides, setGuides] = useState([]);
  const [expandedGuideId, setExpandedGuideId] = useState(null);

  const subTables = ['IgA', 'IgM', 'IgG', 'IgG1', 'IgG2', 'IgG3', 'IgG4'];

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

  const toggleExpand = (id) => {
    setExpandedGuideId(expandedGuideId === id ? null : id);
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
            <TouchableOpacity onPress={() => toggleExpand(item.id)}>
              <Text style={styles.guideTitle}>{item.title}</Text>
              <Text style={styles.guideDescription}>{item.description}</Text>
            </TouchableOpacity>

            {expandedGuideId === item.id && (
              <View style={styles.subTablesContainer}>
                {subTables.map((sub, index) => (
                  <SubTable key={index} tableName={sub} />
                ))}
              </View>
            )}

            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDeleteGuide(item.id)}
            >
              <Text style={styles.deleteButtonText}>Sil</Text>
            </TouchableOpacity>
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
  deleteButton: {
    backgroundColor: '#ff4d4f',
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 14,
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