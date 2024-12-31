// configs/authContext.js

import React, { createContext, useState, useEffect } from 'react';
import { auth } from './firebase_config'; // Firebase auth'u içe aktar
import { onAuthStateChanged } from 'firebase/auth'; // Auth durumunu dinlemek için

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Firebase auth durumunu dinle
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
    });

    // Bileşen unmount olduğunda dinlemeyi durdur
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
