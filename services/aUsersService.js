import { db } from '../configs/firebase_config';
import { collection, getDocs, query, where } from 'firebase/firestore';


export const getAllUsers = async () => {
  try {
    // Kullanıcılar koleksiyonuna erişim sağlanıyor
    const usersCollection = collection(db, 'Kullanıcılar');  // 'Kullanıcılar' koleksiyonunu kullanıyoruz
    const querySnapshot = await getDocs(usersCollection);  // Koleksiyondan tüm belgeleri alıyoruz

    const users = [];
    querySnapshot.forEach((doc) => {
      // Her bir kullanıcıyı işliyoruz ve id ile birlikte users dizisine ekliyoruz
      users.push({
        id: doc.id,
        ...doc.data(),  // Veriyi doc.data() ile alıyoruz
      });
    });

    return users;  // Kullanıcılar dizisini döndürüyoruz
  } catch (error) {
    throw new Error('Kullanıcılar alınırken hata oluştu: ' + error.message);
  }
};

export const getUsersWithRoleUser = async () => {
  try {
    // 'Kullanıcılar' koleksiyonuna erişim sağlanıyor ve filtre uygulanıyor
    const usersCollection = collection(db, 'Kullanıcılar');
    const q = query(usersCollection, where('role', '==', 'user')); // Sadece 'role' == 'user' olanları getir

    const querySnapshot = await getDocs(q); // Filtrelenmiş belgeleri alıyoruz

    const users = [];
    querySnapshot.forEach((doc) => {
      // Her bir kullanıcıyı işliyoruz ve id ile birlikte users dizisine ekliyoruz
      users.push({
        id: doc.id,
        ...doc.data(), // Veriyi doc.data() ile alıyoruz
      });
    });

    return users; // Kullanıcılar dizisini döndürüyoruz
  } catch (error) {
    throw new Error('Kullanıcılar alınırken hata oluştu: ' + error.message);
  }
};


export const getUserByEmail = (email) => {
  // Bu fonksiyon bir `Promise` döndürür, React'te doğru kullanılması için Suspense uyumlu hale gelir
  return new Promise(async (resolve, reject) => {
    try {
      // Kullanıcılar koleksiyonuna erişim sağlanıyor
      const usersCollection = collection(db, 'Kullanıcılar'); // 'Kullanıcılar' koleksiyonunu kullanıyoruz

      // E-posta adresine göre sorgu yapıyoruz
      const querySnapshot = await getDocs(usersCollection);

      // Kullanıcı bulunuyor
      const user = querySnapshot.docs.find((doc) => doc.data().email === email);

      if (user) {
        const role = user.data().role;
        resolve(role); // `resolve` ile role değerini döndürüyoruz
      } else {
        reject(new Error('E-posta adresine sahip bir kullanıcı bulunamadı.'));
      }
    } catch (error) {
      reject(new Error('Kullanıcı bulunurken hata oluştu: ' + error.message));
    }
  });
};


export const getUserById = async (userId) => {
  try {
    const usersCollection = collection(db, 'Kullanıcılar');

    const querySnapshot = await getDocs(usersCollection);

    const userDoc = querySnapshot.docs.find((doc) => doc.id === userId);

    if (userDoc) {
      return {
        id: userDoc.id,
        ...userDoc.data(),
      };
    } else {
      throw new Error('Belirtilen userId ile eşleşen bir kullanıcı bulunamadı.');
    }
  } catch (error) {
    throw new Error('Kullanıcı bilgileri alınırken hata oluştu: ' + error.message);
  }
};
