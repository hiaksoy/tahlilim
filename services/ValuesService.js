import { db } from '../configs/firebase_config';
import { doc, updateDoc, arrayRemove, arrayUnion} from 'firebase/firestore';

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
  
      console.log("Degerler alanındaki değer güncellendi:", newValue);
      return newValue; // Güncellenen değer döndürülür
    } catch (error) {
        console.log(guideId, refName, oldValue, newValue);
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
  
      console.log("Degerler alanından değer silindi:", valueToRemove);
      return valueToRemove; // Silinen değer döndürülür
    } catch (error) {
      console.error("Degerler alanında değer silinirken hata:", error);
      throw new Error("Degerler alanında değer silinirken hata oluştu.");
    }
  };