// PatientsScreen.js
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  FlatList, 
  Alert, 
  StyleSheet,
  LayoutAnimation,
  UIManager,
  Platform,
  TextInput
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getUsersWithRoleUser } from '../services/UsersService';

// Android'de LayoutAnimation'u etkinleştirme
if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const PatientsScreen = () => {
  const navigation = useNavigation();
  const [users, setUsers] = useState([]);
  const [expandedUsers, setExpandedUsers] = useState([]); // Çoklu açılır/kapanır
  const [searchQuery, setSearchQuery] = useState(''); // Arama sorgusu

  const fetchUsers = async () => {
    try {
      const data = await getUsersWithRoleUser();
      setUsers(data);
    } catch (error) {
      Alert.alert('Hata', error.message || 'Kullanıcılar alınamadı.');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleExpand = (userId) => {
    // Animasyonu tetikleme
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedUsers((prevExpandedUsers) =>
      prevExpandedUsers.includes(userId)
        ? prevExpandedUsers.filter((id) => id !== userId)
        : [...prevExpandedUsers, userId]
    );
  };

  const handleShowTests = (userId, birthDate) => {
    navigation.navigate('ShowUserTests', { userId, birthDate });
  };

  const handleEditUser = (userId) => {
    navigation.navigate('EditUser', { userId });
  };

  const handleAddTest = (userId) => {
    navigation.navigate('AddTest', { userId });
  };

  const handleAddPatient = () => {
    navigation.navigate('AddPatient');
  };

  const renderItem = ({ item }) => {
    const isExpanded = expandedUsers.includes(item.id);

    return (
      <View style={styles.userItemContainer}>
        <View style={styles.userHeader}>
          <TouchableOpacity 
            onPress={() => handleToggleExpand(item.id)} 
            style={styles.userNameContainer}
          >
            <Text style={styles.userName}>
              {`${item.name} ${item.surname}`}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => handleToggleExpand(item.id)} 
            style={styles.expandButton}
          >
            <Text style={styles.expandButtonText}>{isExpanded ? '-' : '+'}</Text>
          </TouchableOpacity>
        </View>

        {isExpanded && (
          <View style={styles.userDetails}>
            <Text style={styles.userDetailText}>
              Doğum Tarihi: {item.birthDate}
            </Text>
            <Text style={styles.userDetailText}>
              Cinsiyet: {item.gender}
            </Text>
            <Text style={styles.userDetailText}>
              TC Kimlik No: {item.tcNo}
            </Text>

            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.viewButton}
                onPress={() => handleShowTests(item.id, item.birthDate)}
              >
                <Text style={styles.viewButtonText}>Tahliller</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.editButton}
                onPress={() => handleAddTest(item.id)}
              >
                <Text style={styles.editButtonText}>Tahlil Ekle</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    );
  };

  // Arama fonksiyonu
  const filteredUsers = users.filter(user => {
    const fullName = `${user.name} ${user.surname}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase());
  });

  return (
    <View style={styles.container}>
      {/* Arama Çubuğu */}
      <TextInput
        style={styles.searchBar}
        placeholder="Hasta ara..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        autoCapitalize="none"
        autoCorrect={false}
        clearButtonMode="while-editing"
      />

      <View style={styles.headerRow}>
        <Text style={styles.title}>Hastalar</Text>
        <TouchableOpacity style={styles.addPatientButton} onPress={handleAddPatient}>
          <Text style={styles.addPatientButtonText}>Hasta Ekle</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
};

export default PatientsScreen;

// ---------------------------------------------------------------------
// STYLES
// ---------------------------------------------------------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F8FE', // Pastel mavi arka plan
    padding: 20,
  },
  searchBar: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: '#fff',

    // Hafif gölge
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1.5 },
    shadowOpacity: 0.1,
    shadowRadius: 1.8,
    elevation: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2F5D8E',
  },
  addPatientButton: {
    backgroundColor: '#28a745', // Yeşil renk
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addPatientButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  userItemContainer: {
    marginVertical: 8,
  },
  userHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userNameContainer: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  expandButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#28a745',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10, // Buton ile metin arasına boşluk
  },
  expandButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  userDetails: {
    marginTop: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#eee',
    padding: 15,

    // Gölge
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1.5 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  userDetailText: {
    fontSize: 16,
    color: '#555',
    marginBottom: 6,
  },
  actionButtons: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'space-between',
  },
  editButton: {
    flex: 0.48,
    backgroundColor: '#28a745',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',

    // Gölge
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3.5,
    elevation: 2,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  viewButton: {
    flex: 0.48,
    backgroundColor: '#5A8FCB',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',

    // Gölge
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3.5,
    elevation: 2,
  },
  viewButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  }
});
