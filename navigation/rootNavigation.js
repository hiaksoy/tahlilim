import React, { useState, useEffect } from 'react';
import { auth } from '../configs/firebase_config';
import AdminStack from './adminStack';
import UserStack from './userStack';
import { getUserByEmail } from '../services/aUsersService';

const RootNavigation = () => {
  const [userRole, setUserRole] = useState(null); // Kullanıcı rolü için state
  const [loading, setLoading] = useState(true); // Yüklenme durumu

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const user = auth.currentUser;

        if (user) {
          const role = await getUserByEmail(user.email); // Kullanıcı rolünü al
          setUserRole(role); // State'e ata
        } else {
          setUserRole(null); // Kullanıcı yoksa null olarak ata
        }
      } catch (error) {
        console.error('Hata:', error.message);
        setUserRole(null); // Hata durumunda role null
      } finally {
        setLoading(false); // Yüklenme durumunu bitir
      }
    };

    fetchUserRole();
  }, []); // Bileşen yüklendiğinde çalışır

  // Yüklenme ekranı veya boş bir ekran göstermek
  if (loading) {
    return null; // Yüklenirken bir spinner veya boş ekran gösterebilirsiniz
  }

  // Kullanıcı rolüne göre yönlendirme yap
  if (userRole === 'admin') {
    return <AdminStack />;
  } else {
    return <UserStack />;
  }
};

export default RootNavigation;
