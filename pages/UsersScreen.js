import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, Alert, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getAllUsers } from '../services/aUsersService';

const UsersScreen = () => {
  const navigation = useNavigation();
  const [users, setUsers] = useState([]);
  const [expandedUser, setExpandedUser] = useState(null);

  const fetchUsers = async () => {
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (error) {
      Alert.alert('Hata', error.message || 'Kullanıcılar alınamadı.');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleExpand = (userId) => {
    setExpandedUser(expandedUser === userId ? null : userId);
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Kullanıcılar</Text>

      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.userItem}>
            <TouchableOpacity onPress={() => handleToggleExpand(item.id)}>
              <Text style={styles.userName}>
                {`${item.name} ${item.surname}`}
              </Text>
            </TouchableOpacity>

            {expandedUser === item.id && (
              <View style={styles.userDetails}>
                <Text style={styles.userDetailText}>
                  Doğum Tarihi: {item.birthDate}
                </Text>
                <Text style={styles.userDetailText}>
                  Cinsiyet: {item.gender}
                </Text>
                <Text style={styles.userDetailText}>
                  Tc Kimlik No: {item.tcNo}
                </Text>

                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => handleEditUser(item.id)}
                  >
                    <Text style={styles.editButtonText}>Düzenle</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.viewButton}
                    onPress={() => handleShowTests(item.id, item.birthDate)}
                  >
                    <Text style={styles.viewButtonText}>Tahliller</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.viewButton}
                    onPress={() => handleAddTest(item.id)}
                  >
                    <Text style={styles.viewButtonText}>Tahlil Ekle</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        )}
      />
    </View>
  );
};

export default UsersScreen;

// ---------------------------------------------------------------------
// STYLES
// ---------------------------------------------------------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F8FE',  // Pastel mavi arka plan
    padding: 20
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2F5D8E',
    marginVertical: 10,
    textAlign: 'center'
  },
  userItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginVertical: 8,

    // Gölge (iOS + Android)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3.5,
    elevation: 3
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333'
  },
  userDetails: {
    marginTop: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#eee',
    padding: 10,
    // Gölge
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1.5 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1
  },
  userDetailText: {
    fontSize: 15,
    color: '#555',
    marginBottom: 5
  },
  actionButtons: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'space-between'
  },
  editButton: {
    flex: 0.48,
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',

    // Gölge
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3.5,
    elevation: 2
  },
  editButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600'
  },
  viewButton: {
    flex: 0.48,
    backgroundColor: '#5A8FCB',
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',

    // Gölge
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3.5,
    elevation: 2
  },
  viewButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600'
  }
});
