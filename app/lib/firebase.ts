// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import Constants from 'expo-constants';

let firestore: any = {};
let auth: any = {};

const getFirebaseConfig = () => {
  const extra = Constants.expoConfig?.extra;
  
  if (!extra?.firebaseApiKey) {
    console.error("Firebase API Key is missing. Check your environment configuration.");
  }
  
  const config = {
    apiKey: extra?.firebaseApiKey,
    authDomain: extra?.firebaseAuthDomain,
    databaseURL: extra?.firebaseDatabaseURL,
    projectId: extra?.firebaseProjectId,
    storageBucket: extra?.firebaseStorageBucket,
    messagingSenderId: extra?.firebaseMessagingSenderId,
    appId: extra?.firebaseAppId,
    measurementId: extra?.firebaseMeasurementId
  };
  
  return config;
};

const firebaseConfig = getFirebaseConfig();

try {
  const app = initializeApp(firebaseConfig);
  firestore = getFirestore(app);
  auth = getAuth(app);
} catch (error) {
  console.error("Error initializing Firebase:", error);
}

export { firestore, auth };
export default { firestore, auth };