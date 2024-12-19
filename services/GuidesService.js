import { db } from '../configs/firebase_config';
import { collection, doc, setDoc, getDocs, deleteDoc, getDoc, addDoc } from 'firebase/firestore';

export const addGuide = async (title, description, colName) => {
  const guideRef = doc(collection(db, colName));
  await setDoc(guideRef, { id: guideRef.id, title, description });

  const degerlerRef = collection(guideRef, 'Degerler');
  await addDoc(degerlerRef, {});
};

export const addSubTable = async (guideId, subTable, data) => {
  const guideRef = doc(db, 'Kılavuzlar', guideId);
  const subRef = doc(collection(guideRef, subTable));
  await setDoc(subRef, data);
};



export const getSubTables = async (guideId) => {
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
};

  // const guideRef = doc(db, 'Kılavuzlar', guideId);
  // const snapshot = await getDocs(collection(guideRef, subTable));
  // return snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));


export const getGuides = async () => {
  const snapshot = await getDocs(collection(db, 'Kılavuzlar'));
  return snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
};


// ID'ye Göre Kılavuzu Getir
export const getGuideById = async (id) => {
  const guideRef = doc(db, 'Kılavuzlar', id);
  const snapshot = await getDoc(guideRef);

  if (!snapshot.exists()) {
    throw new Error('Kılavuz bulunamadı.');
  }

  const guideData = { ...snapshot.data(), id: snapshot.id, subTables: {} };

  // Alt koleksiyonları alma
  const subCollections = ['IgA', 'IgM', 'IgG', 'IgG1', 'IgG2', 'IgG3', 'IgG4'];

  for (const subCol of subCollections) {
    const subSnapshot = await getDocs(collection(guideRef, subCol));
    guideData.subTables[subCol] = subSnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
  }

  return guideData;
};

export const deleteGuide = async (id) => {
  await deleteDoc(doc(db, 'Kılavuzlar', id));
};



export const deleteSubTable = async (guideId, subTableId) => {
  try {
    // Belirtilen guideId ve subTableId ile 'Degerler' koleksiyonundaki belgeyi hedef alıyoruz
    const subTableRef = doc(db, 'Kılavuzlar', guideId, 'Degerler', subTableId);
    
    // Belgeyi sil
    await deleteDoc(subTableRef);
    console.log(`SubTable ${subTableId} başarıyla silindi.`);
  } catch (error) {
    console.error('SubTable silinirken hata oluştu:', error.message);
  }
};