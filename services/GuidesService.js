import { db } from '../configs/firebase_config';
import { collection, doc, setDoc, getDocs, deleteDoc, getDoc } from 'firebase/firestore';

export const addGuide = async (title, description) => {
  const guideRef = doc(collection(db, 'Kılavuzlar'));
  await setDoc(guideRef, { id: guideRef.id, title, description });

  // Alt koleksiyonları oluştur
  const subCollections = ['IgA', 'IgM', 'IgG', 'IgG1', 'IgG2', 'IgG3', 'IgG4'];
  for (const subCol of subCollections) {
    const subRef = doc(collection(guideRef, 'Degerler'));
    await setDoc(subRef, { id: subRef.id , title: subCol });
  }
};

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
