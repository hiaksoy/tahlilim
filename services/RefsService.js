import { db } from '../configs/firebase_config';
import { collection, doc, setDoc, getDocs, deleteDoc, getDoc, addDoc, updateDoc } from 'firebase/firestore';

// export const addRef = async (guideId, data) => {
//     const guideRef = doc(db, 'Kılavuzlar', guideId);
//     const subRef = doc(collection(guideRef, 'Degerler'));
//     await setDoc(subRef, data);
//   };
//eski versiyon

// 'IgA' veya 'IgM' gibi haritaları oluşturur
export const createRef = async (guideId, refName) => {
  try {
    const guideRef = doc(db, 'Kılavuzlar', guideId);

    await updateDoc(guideRef, {
      [`Degerler.${refName}`]: []
    });

    console.log(`${refName} başarıyla oluşturuldu.`);
  } catch (error) {
    console.error(`${refName} oluşturulurken hata:`, error);
  }
};



  export const addRefFields = async (guideId, refId, minAge, maxAge, minValue, maxValue) => {
    try {
      // Firestore referansı
      const refDoc = doc(db, 'Kılavuzlar', guideId, 'Degerler', refId);
  
      // Alanları ekle
      await setDoc(refDoc, {
        minAge: Number(minAge),
        maxAge: Number(maxAge),
        minValue: Number(minValue),
        maxValue: Number(maxValue),
      });
  
      console.log('Alanlar başarıyla eklendi!');
    } catch (error) {
      console.error('Alanlar eklenirken hata oluştu:', error);
    }
  };

  const getSubTables = async (guideId) => {
    try {
      // Kılavuzlar/guideId/Degerler koleksiyonuna erişim
      const subTablesRef = collection(db, `Kılavuzlar/${guideId}/Degerler`);
      const snapshot = await getDocs(subTablesRef);
      const subTables = snapshot.docs.map((doc) => ({
        id: doc.id, // Her dokümanın ID'sini alıyoruz
        ref: doc.data().ref, // `ref` verisini alıyoruz
      }));
  
      return subTables;
    } catch (error) {
      console.error("Veri alınırken hata:", error);
    }
  };



//   export const getRefValues = async (guideId, refId) => {
//     try {
//       // Firestore koleksiyon referansı
//       const valuesRef = doc(db, `Kılavuzlar/${guideId}/Degerler/${refId}`);
//       const snapshot = await getDocs(valuesRef);
  
//       if (snapshot.empty) {
//         return []; // Koleksiyon boşsa
//       }
  
//       // Verileri döndür
//       return snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
//     } catch (error) {
//       console.error('Veriler alınırken hata:', error);
//       throw new Error('Veriler alınamadı.');
//     }
//   };


//   export const getRefs = async (guideId, refId) => {
//     try {
//       // guideId altındaki Degerler koleksiyonuna eriş
//       const degerlerRef = collection(db, `Kılavuzlar/${guideId}/Degerler/${refId}/Yaslar`);
//       const snapshot = await getDocs(degerlerRef);

//       if (snapshot.empty) {
//         return []; // Koleksiyon boşsa
//       }

//       // Verileri döndür
//       return snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
//     } catch (error) {
//       console.error("Alt koleksiyonlar alınırken hata:", error);
//       throw new Error("Alt koleksiyonlar alınamadı.");
//     }
//   }