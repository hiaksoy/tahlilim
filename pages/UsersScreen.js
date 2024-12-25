import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, Alert, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getAllUsers } from '../services/aUsersService'; // Kullanıcıları alacak fonksiyonu import ettik

const UsersScreen = () => {
  const navigation = useNavigation();
  const [users, setUsers] = useState([]);  // Kullanıcıları tutan state
  const [expandedUser, setExpandedUser] = useState(null); // Açılan kullanıcının bilgilerini tutacak

  const fetchUsers = async () => {
    try {
      const data = await getAllUsers(); // Kullanıcıları al
      setUsers(data);  // Kullanıcıları state'e kaydet
    } catch (error) {
      Alert.alert('Hata', error.message || 'Kullanıcılar alınamadı.');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleExpand = (userId) => {
    setExpandedUser(expandedUser === userId ? null : userId); // Kullanıcıyı aç/kapat
  };

  const handleViewUser = (userId) => {
    navigation.navigate('UserDetails', { userId }); // Kullanıcı detaylarına git
  };

  const handleEditUser = (userId) => {
    navigation.navigate('EditUser', { userId }); // Kullanıcıyı düzenlemeye git
  };

  const handleAddTest = (userId) => {
    navigation.navigate('AddTest', { userId }); // Kullanıcıyı düzenlemeye git
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Kullanıcılar</Text>

      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.userItem}>
            {/* Kullanıcı adı ve soyadı */}
            <TouchableOpacity onPress={() => handleToggleExpand(item.id)}>
              <Text style={styles.userName}>{`${item.name} ${item.surname}`}</Text>
            </TouchableOpacity>

            {/* Eğer kullanıcı açılmışsa, detayları göster */}
            {expandedUser === item.id && (
              <View style={styles.userDetails}>
                <Text style={styles.userDetailText}>Doğum Tarihi: {item.birthDate}</Text>
                <Text style={styles.userDetailText}>Cinsiyet: {item.gender}</Text>
                <Text style={styles.userDetailText}>Tc Kimlik No: {item.tcNo}</Text>


                <View style={styles.actionButtons}>
                  {/* Düzenle Butonu */}
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => handleEditUser(item.id)}
                  >
                    <Text style={styles.editButtonText}>Düzenle</Text>
                  </TouchableOpacity>

                  {/* Görüntüle Butonu */}
                  <TouchableOpacity
                    style={styles.viewButton}
                    onPress={() => handleViewUser(item.id)}
                  >
                    <Text style={styles.viewButtonText}>Görüntüle</Text>
                  </TouchableOpacity>

                   {/* Tahlil Butonu */}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  userItem: {
    padding: 15,
    backgroundColor: '#fff',
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  userDetails: {
    marginTop: 10,
    paddingTop: 10,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  userDetailText: {
    fontSize: 16,
    marginBottom: 5,
  },
  actionButtons: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'space-between',
  },
  editButton: {
    flex: 0.48,
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  viewButton: {
    flex: 0.48,
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default UsersScreen;
