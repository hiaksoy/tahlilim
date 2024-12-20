import { db } from '../configs/firebase_config';
import { collection, doc, getDocs, setDoc, addDoc, deleteDoc, updateDoc } from 'firebase/firestore';

// **Kılavuz Ekleme (Degerler Map Türü ile)**
export const addGuide = async (title, description) => {
    try {
      const guideRef = doc(collection(db, 'Kılavuzlar'));  // Kılavuzlar koleksiyonuna yeni bir referans oluşturuluyor
  
      // Kılavuz verisini ve Degerler map türünde bir field ile ayarlama
      const newGuide = {
        title,
        description,
        Degerler: {},  // Map türünde boş bir nesne olarak eklenir
        createdAt: new Date(),
      };
  
      // Kılavuz verisini Firestore'a ekle
      await setDoc(guideRef, { id: guideRef.id, ...newGuide });
  
      console.log("Kılavuz eklendi:", guideRef.id);
      return guideRef.id;  // Yeni kılavuzun id'si döndürülür
    } catch (error) {
      console.error("Kılavuz eklenirken hata:", error);
      throw new Error("Kılavuz eklenirken hata oluştu.");
    }
  };

// **Read - Tüm kılavuzları almak**
export const getAllGuides = async () => {
  try {
    const guidesRef = collection(db, 'Kılavuzlar');
    const snapshot = await getDocs(guidesRef);

    if (snapshot.empty) {
      return [];
    }

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Kılavuzlar alınırken hata:", error);
    throw new Error("Kılavuzlar alınırken hata oluştu.");
  }
};

// **Read - Tek bir kılavuzu almak (ID ile)**
export const getGuideById = async (guideId) => {
  try {
    const guideDoc = doc(db, 'Kılavuzlar', guideId);
    const snapshot = await getDocs(guideDoc);

    if (snapshot.empty) {
      return null;
    }

    return { id: snapshot.id, ...snapshot.data() };
  } catch (error) {
    console.error("Kılavuz alınırken hata:", error);
    throw new Error("Kılavuz alınırken hata oluştu.");
  }
};

// **Update - Var olan bir kılavuzu güncellemek**
export const updateGuide = async (guideId, newData) => {
  try {
    const guideDoc = doc(db, 'Kılavuzlar', guideId);
    
    await updateDoc(guideDoc, newData);
    console.log(`Kılavuz ${guideId} güncellendi`);
  } catch (error) {
    console.error("Kılavuz güncellenirken hata:", error);
    throw new Error("Kılavuz güncellenirken hata oluştu.");
  }
};

// **Delete - Bir kılavuzu silmek**
export const deleteGuide = async (guideId) => {
  try {
    const guideDoc = doc(db, 'Kılavuzlar', guideId);
    
    await deleteDoc(guideDoc);
    console.log(`Kılavuz ${guideId} silindi`);
  } catch (error) {
    console.error("Kılavuz silinirken hata:", error);
    throw new Error("Kılavuz silinirken hata oluştu.");
  }
};
