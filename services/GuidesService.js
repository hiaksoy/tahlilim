import { db } from '../configs/firebase_config';
import { collection, doc, getDocs, getDoc, addDoc, deleteDoc, updateDoc } from 'firebase/firestore';

export const addGuide = async (title, description,base) => {
  try {
    // Kılavuzlar koleksiyonuna yeni bir belge ekleniyor
    const newGuide = {
      title,
      description,
      base,
      Degerler: {},  // Map türünde boş bir nesne olarak eklenir
      createdAt: new Date(),
    };

    // Kılavuz verisini Firestore'a ekle
    const docRef = await addDoc(collection(db, 'Kılavuzlar'), { ...newGuide });

    return docRef.id;  // Yeni kılavuzun id'si döndürülür
  } catch (error) {
    console.error("Kılavuz eklenirken hata:", error);
    throw new Error("Kılavuz eklenirken hata oluştu.");
  }
};

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

export const deleteGuide = async (id) => {
  await deleteDoc(doc(db, 'Kılavuzlar', id));
};

export const updateGuide = async (id, title, description, base) => {
  try {
    // Güncellenecek belgeye referans oluşturuluyor
    const guideRef = doc(db, 'Kılavuzlar', id);

    // Güncellenmesi gereken veri
    const updatedGuide = {
      title,
      description,
      base,
      updatedAt: new Date(),  // Güncellenme tarihi
    };

    // Firestore'da belgeyi güncelle
    await updateDoc(guideRef, updatedGuide);

    return id;  // Güncellenen kılavuzun id'si döndürülür
  } catch (error) {
    console.error("Kılavuz güncellenirken hata:", error);
    throw new Error("Kılavuz güncellenirken hata oluştu.");
  }
};

export const getGuideById = async (id) => {
  try {
    // Kılavuzun Firestore'dan alınan referansı
    const guideRef = doc(db, 'Kılavuzlar', id);
    
    // Kılavuzu alıyoruz
    const guideDoc = await getDoc(guideRef);

    // Eğer kılavuz bulunmazsa hata döndürülür
    if (!guideDoc.exists()) {
      throw new Error('Kılavuz bulunamadı.');
    }

    // Kılavuzun verilerini alıyoruz ve sadece gerekli alanları döndürüyoruz
    const guideData = guideDoc.data();
    const result = {
      title: guideData.title,
      description: guideData.description,
      base : guideData.base,
      createdAt: guideData.createdAt,
    };

    return result;  // Sadece title, description ve createdAt özelliklerini döndüren nesne
  } catch (error) {
    console.error("Kılavuz alınırken hata:", error);
    throw new Error("Kılavuz alınırken hata oluştu.");
  }
};

