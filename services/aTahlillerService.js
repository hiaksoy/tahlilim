import { collection, addDoc, getDoc, updateDoc, deleteDoc, getDocs, doc } from 'firebase/firestore';
import { db } from '../configs/firebase_config';

// Tahlil Ekle
export const addTahlil = async (userId, raporNo, tani, numuneTuru, raporGrubu, tetkikIstemZamani, numuneAlmaZamani, numuneKabulZamani, uzmanOnayZamani, degerler) => {
    try {
        const newTahlil = {
            userId,
            raporNo,
            tani,
            numuneTuru,
            raporGrubu,
            tetkikIstemZamani,
            numuneAlmaZamani,
            numuneKabulZamani,
            uzmanOnayZamani,
            degerler,
            createdAt: new Date()
        };
        const docRef = await addDoc(collection(db, 'Tahliller'), newTahlil);
        return docRef.id;
    } catch (error) {
        console.error('Tahlil eklenirken hata:', error);
        throw new Error('Tahlil eklenirken hata oluştu.');
    }
};

// Tahlil Getir
export const getTahlilById = async (id) => {
    const docRef = doc(db, 'Tahliller', id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : null;
};

// Tüm Tahlilleri Getir
export const getAllTahliller = async () => {
    const querySnapshot = await getDocs(collection(db, 'Tahliller'));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Tahlil Güncelle
export const updateTahlil = async (id, updatedData) => {
    const docRef = doc(db, 'Tahliller', id);
    await updateDoc(docRef, updatedData);
};

// Tahlil Sil
export const deleteTahlil = async (id) => {
    const docRef = doc(db, 'Tahliller', id);
    await deleteDoc(docRef);
};
