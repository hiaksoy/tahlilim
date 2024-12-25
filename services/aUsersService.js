import { db } from '../configs/firebase_config';
import { collection, doc, getDocs, getDoc, addDoc, deleteDoc, updateDoc } from 'firebase/firestore';


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