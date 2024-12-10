import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";




// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCAFVJSWkva9XHlm7faAtos36QIapnTIB8",
    authDomain: "tahlilim.firebaseapp.com",
    projectId: "tahlilim",
    storageBucket: "tahlilim.firebasestorage.app",
    messagingSenderId: "1050377111920",
    appId: "1:1050377111920:web:ab2da0d996644d74dea7b5"
};

// Firebase'i başlat
const app = initializeApp(firebaseConfig);

// Firestore bağlantısını al
const db = getFirestore(app);

// Auth'u AsyncStorage ile başlat
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export { db, auth };