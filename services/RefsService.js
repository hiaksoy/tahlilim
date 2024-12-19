import { db } from '../configs/firebase_config';
import { collection, doc, setDoc, getDocs, deleteDoc, getDoc, addDoc } from 'firebase/firestore';

export const addRef = async (guideId, data) => {
    const guideRef = doc(db, 'Kılavuzlar', guideId);
    const subRef = doc(collection(guideRef, 'Degerler'));
    await setDoc(subRef, data);
  };

  export const getRefs = async (guideId) => {
    try {
      // guideId altındaki Degerler koleksiyonuna eriş
      const degerlerRef = collection(db, `Kılavuzlar/${guideId}/Degerler`);
      const snapshot = await getDocs(degerlerRef);

      if (snapshot.empty) {
        return []; // Koleksiyon boşsa
      }

      // Verileri döndür
      return snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    } catch (error) {
      console.error("Alt koleksiyonlar alınırken hata:", error);
      throw new Error("Alt koleksiyonlar alınamadı.");
    }
  }