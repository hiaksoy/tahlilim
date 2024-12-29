import { db } from '../configs/firebase_config';
import { collection, doc, getDocs, getDoc, addDoc, deleteDoc, updateDoc } from 'firebase/firestore';

export const getAllTests = async () => {
    try {
        const testsCollection = collection(db, 'Tahliller');
        const querySnapshot = await getDocs(testsCollection);

        const tests = [];
        querySnapshot.forEach((doc) => {
            tests.push({
                id: doc.id,
                ...doc.data(),
            });
        });

        return tests;
    } catch (error) {
        throw new Error('Testler alınırken hata oluştu: ' + error.message);
    }
}

export const getTestById = async (testId) => {
    try {
        const testDoc = doc(db, 'Tahliller', testId);
        const docSnapshot = await getDoc(testDoc);

        if (!docSnapshot.exists()) {
            throw new Error('Test bulunamadı.');
        }

        return {
            id: docSnapshot.id,
            ...docSnapshot.data(),
        };
    } catch (error) {
        throw new Error('Test alınırken hata oluştu: ' + error.message);
    }
}

export const addTest = async (name, description, questionCount) => {
    try {
        const newTest = {
            name,
            description,
            questionCount,
            createdAt: new Date(),
        };

        const docRef = await addDoc(collection(db, 'Tahliller'), { ...newTest });

        console.log('Test eklendi:', docRef.id);
        return docRef.id;
    } catch (error) {
        console.error('Test eklenirken hata:', error);
        throw new Error('Test eklenirken hata oluştu.');
    }
}

export const deleteTest = async (testId) => {
    await deleteDoc(doc(db, 'Tahliller', testId));
}