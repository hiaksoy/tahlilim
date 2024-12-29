import React, { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import AdminStack from './adminStack';
import UserStack from './userStack';
import AuthStack from './authStack';
import { getUserByEmail } from '../services/UsersService';
import { AuthContext } from '../configs/authContext';

const RootNavigation = () => {
  const { user } = useContext(AuthContext); // Kullanıcı bilgisi
  const [role, setRole] = useState(null); // Kullanıcı rolü
  const [loading, setLoading] = useState(true); // Yüklenme durumu

  useEffect(() => {
    const fetchUserRole = async () => {
      if (user) {
        try {
          const userRole = await getUserByEmail(user.email); // Rolü veritabanından al
          setRole(userRole);
        } catch (error) {
          console.error('Kullanıcı rolü alınırken hata oluştu:', error);
        }
      }
      setLoading(false); // Yükleme tamamlandı
    };

    fetchUserRole();
  }, [user]);

  // Yükleme sırasında bir gösterge gösterilir
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  // Kullanıcı durumu ve role tam yüklendikten sonra stack'leri göster
  if (!user) {
    return <AuthStack />;
  }

  if (role === 'admin') {
    return <AdminStack />;
  }

  return <UserStack />;
};

export default RootNavigation;
