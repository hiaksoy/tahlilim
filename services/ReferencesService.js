import { db } from '../configs/firebase_config';
import { collection, doc, updateDoc, arrayUnion, getDoc, deleteField  } from 'firebase/firestore';


export const addRef = async (guideId, name) => {
  try {
    // Kılavuzun referansı alınır
    const guideRef = doc(db, 'Kılavuzlar', guideId);

    // Firestore'dan otomatik bir ID oluşturulur
    const valueId = doc(collection(db, 'Kılavuzlar', guideId, name)).id; // key parametresi, map'in altındaki bir alandır

    // Degerler alanına, belirli bir key için boş bir array eklenir
    await updateDoc(guideRef, {
      [`Degerler.${name}`]: arrayUnion()  // Boş bir array ekleniyor
    });

    return valueId; // Yeni oluşturulan ID döndürülür
  } catch (error) {
    console.error("Degerler alanına değer eklenirken hata:", error);
    throw new Error("Degerler alanına değer eklenirken hata oluştu.");
  }
};

export const getAllRefs = async (guideId) => {
  try {
    // Kılavuzun Firestore'dan alınan referansı
    const guideRef = doc(db, 'Kılavuzlar', guideId);
    
    // Kılavuzu alıyoruz
    const guideDoc = await getDoc(guideRef);

    // Eğer kılavuz bulunmazsa hata döndürülür
    if (!guideDoc.exists()) {
      throw new Error('Kılavuz bulunamadı.');
    }

    // Kılavuzun Degerler alanı
    const degerler = guideDoc.data()?.Degerler;

    // Eğer Degerler alanı boşsa
    if (!degerler) {
      return [];
    }

    // Degerler altındaki tüm arraylerin adlarını almak için
    const result = [];

    // Degerler içindeki her bir key (örneğin IgA, IgM) üzerinde döngü
    for (const key in degerler) {
      // Eğer o key altında array varsa
      if (Array.isArray(degerler[key])) {
        result.push({
          key: key
        }); // Yalnızca key'i ekle
      }
    }

    return result;  // Keylerle dolu bir array döndürülür
  } catch (error) {
    console.error("Degerler alınırken hata:", error);
    throw new Error("Degerler alınırken hata oluştu.");
  }
};

export const addValuesToRef = async (guideId, refName, minAge, maxAge, minValue, maxValue) => {
  try {
    // Kılavuzun referansı alınır
    const guideRef = doc(db, 'Kılavuzlar', guideId);

    // Yeni array elemanını oluştur
    const newValue = {
      minAge,             // Min yaş
      maxAge,             // Max yaş
      minValue,           // Min değer
      maxValue,           // Max değer
    };

    // Degerler alanındaki ilgili key'e yeni array elemanını ekleyin
    await updateDoc(guideRef, {
      [`Degerler.${refName}`]: arrayUnion(newValue)  // Key ile belirtilen map altına array elemanı ekleme
    });

    return newValue; // Yeni değer döndürülür
  } catch (error) {
    console.error("Degerler alanına değer eklenirken hata:", error);
    throw new Error("Degerler alanına değer eklenirken hata oluştu.");
  }
};

export const getAllRefsWithValues = async (guideId, name) => {
  try {
    // Kılavuzun referansı alınır
    const guideRef = doc(db, 'Kılavuzlar', guideId);

    // Kılavuzu alıyoruz
    const guideDoc = await getDoc(guideRef);

    // Eğer kılavuz bulunmazsa hata döndürülür
    if (!guideDoc.exists()) {
      throw new Error('Kılavuz bulunamadı.');
    }

    // Kılavuzun Degerler alanı
    const degerler = guideDoc.data()?.Degerler;

    // Eğer Degerler alanı boşsa
    if (!degerler || !degerler[name]) {
      return [];
    }

    // İlgili key altındaki array elemanları
    const arrayValues = degerler[name];

    // Yalnızca gerekli değerleri döndüren bir array oluştur
    const result = arrayValues.map(item => ({
      minAge: item.minAge,
      maxAge: item.maxAge,
      minValue: item.minValue,
      maxValue: item.maxValue
    }));

    return result; // Yalnızca minAge, maxAge, minValue, maxValue döndürülür
  } catch (error) {
    console.error("Degerler alınırken hata:", error);
    throw new Error("Degerler alınırken hata oluştu.");
  }
};

export const updateValueInRef = async (guideId, refName, oldValue, newValue) => {
  try {
    // Kılavuzun referansı alınır
    const guideRef = doc(db, 'Kılavuzlar', guideId);

    // Eski değeri kaldırmak için arrayRemove kullanıyoruz
    await updateDoc(guideRef, {
      [`Degerler.${refName}`]: arrayRemove(oldValue), // Eski değeri kaldır
    });

    // Yeni değeri eklemek için arrayUnion kullanıyoruz
    await updateDoc(guideRef, {
      [`Degerler.${refName}`]: arrayUnion(newValue), // Yeni değeri ekle
    });

    return newValue; // Güncellenen değer döndürülür
  } catch (error) {
    console.error("Degerler alanında değer güncellenirken hata:", error);
    throw new Error("Degerler alanında değer güncellenirken hata oluştu.");
  }
};

export const removeValueFromRef = async (guideId, refName, valueToRemove) => {
  try {
    // Kılavuzun referansı alınır
    const guideRef = doc(db, 'Kılavuzlar', guideId);

    // Belirtilen değeri array'den kaldır
    await updateDoc(guideRef, {
      [`Degerler.${refName}`]: arrayRemove(valueToRemove),
    });

    return valueToRemove; // Silinen değer döndürülür
  } catch (error) {
    console.error("Degerler alanında değer silinirken hata:", error);
    throw new Error("Degerler alanında değer silinirken hata oluştu.");
  }
};

export const deleteRef = async (guideId, refName) => {
  try {
    // Reference to the specific guide
    const guideRef = doc(db, 'Kılavuzlar', guideId);

    // Delete the entire reference field
    await updateDoc(guideRef, {
      [`Degerler.${refName}`]: deleteField(),
    });

  } catch (error) {
    console.error(`Referans '${refName}' silinirken hata:`, error);
    throw new Error("Referans silinirken hata oluştu.");
  }
};