import { db } from '../configs/firebase_config';
import { collection, doc, getDocs, setDoc, addDoc, deleteDoc, updateDoc } from 'firebase/firestore';

// **Create - Yeni bir ref eklemek**
export const createRef = async (guideId, refName) => {
  try {
    const guideRef = doc(db, 'Kılavuzlar', guideId);
    const degerlerRef = collection(guideRef, 'Degerler');

    // Yeni ref ekle
    const newRef = {
      ref: refName, // Eklenen ref'in adı
      createdAt: new Date(),
    };

    const refDoc = await addDoc(degerlerRef, newRef);
    console.log("Yeni ref eklendi:", refDoc.id);
    return refDoc.id; // Yeni oluşturulan ref'in id'si
  } catch (error) {
    console.error("Ref eklenirken hata:", error);
    throw new Error("Ref eklenirken hata oluştu.");
  }
};

// **Read - Tüm ref'leri almak**
export const getAllRefs = async (guideId) => {
  try {
    const guideRef = doc(db, 'Kılavuzlar', guideId);
    const degerlerRef = collection(guideRef, 'Degerler');
    const snapshot = await getDocs(degerlerRef);

    if (snapshot.empty) {
      return [];
    }

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Ref'ler alınırken hata:", error);
    throw new Error("Ref'ler alınırken hata oluştu.");
  }
};

// **Read - Tek bir ref almak (ID ile)**
export const getRefById = async (guideId, refId) => {
  try {
    const refDoc = doc(db, 'Kılavuzlar', guideId, 'Degerler', refId);
    const snapshot = await getDocs(refDoc);

    if (snapshot.empty) {
      return null;
    }

    return { id: snapshot.id, ...snapshot.data() };
  } catch (error) {
    console.error("Ref alınırken hata:", error);
    throw new Error("Ref alınırken hata oluştu.");
  }
};

// **Update - Var olan bir ref'i güncellemek**
export const updateRef = async (guideId, refId, newData) => {
  try {
    const refDoc = doc(db, 'Kılavuzlar', guideId, 'Degerler', refId);
    
    await updateDoc(refDoc, newData);
    console.log(`Ref ${refId} güncellendi`);
  } catch (error) {
    console.error("Ref güncellenirken hata:", error);
    throw new Error("Ref güncellenirken hata oluştu.");
  }
};

// **Delete - Bir ref silmek**
export const deleteRef = async (guideId, refId) => {
  try {
    const refDoc = doc(db, 'Kılavuzlar', guideId, 'Degerler', refId);
    
    await deleteDoc(refDoc);
    console.log(`Ref ${refId} silindi`);
  } catch (error) {
    console.error("Ref silinirken hata:", error);
    throw new Error("Ref silinirken hata oluştu.");
  }
};
