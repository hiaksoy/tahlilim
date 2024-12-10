import { db } from '../configs/firebase_config';
import { collection, doc, setDoc, getDocs, deleteDoc } from 'firebase/firestore';

export const addGuide = async (title, description) => {
  const guideRef = doc(collection(db, 'Kılavuzlar'));
  await setDoc(guideRef, { id: guideRef.id, title, description });

  // Alt koleksiyonları oluştur
  const subCollections = ['IgA', 'IgM', 'IgG', 'IgG1', 'IgG2', 'IgG3', 'IgG4'];
  for (const subCol of subCollections) {
    const subRef = doc(collection(guideRef, subCol), 'default');
    await setDoc(subRef, { createdAt: new Date() });
  }
};

export const getGuides = async () => {
  const snapshot = await getDocs(collection(db, 'Kılavuzlar'));
  return snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
};

export const deleteGuide = async (id) => {
  await deleteDoc(doc(db, 'Kılavuzlar', id));
};
