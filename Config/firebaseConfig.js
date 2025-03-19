import { initializeApp } from "firebase/app";
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";




const firebaseConfig = {
    apiKey: "AIzaSyBxvc7qkA8__ssdeAvYiBDRSzYyc4_efAQ",
    authDomain: "cajeroapp.firebaseapp.com",
    projectId: "cajeroapp",
    storageBucket: "cajeroapp.firebasestorage.app",
    messagingSenderId: "571859033707",
    appId: "1:571859033707:web:2dd52f76cff6da8ff51b2e",
    measurementId: "G-QTZ580W1P6"
  };


  const app = initializeApp(firebaseConfig);

  
  const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
  

  const db = getFirestore(app);
  
  export { auth, db };