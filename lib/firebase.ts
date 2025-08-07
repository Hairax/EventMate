// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth,connectAuthEmulator } from "firebase/auth";
import { getFirestore,connectFirestoreEmulator } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAs5pK3QkC-2MmdWJG3oexEq_Ery4lCycU",
  authDomain: "eventmate-fddb6.firebaseapp.com",
  projectId: "eventmate-fddb6",
  storageBucket: "eventmate-fddb6.firebasestorage.app",
  messagingSenderId: "157299629064",
  appId: "1:157299629064:web:0b10cdbf195b63add6c5bd",
  measurementId: "G-M3LEC0WSSB"
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

import { getFunctions, connectFunctionsEmulator } from "firebase/functions";

// Nuevo:
const functions = getFunctions(app);

if (process.env.NEXT_PUBLIC_EMULATOR === "true") {
  connectFunctionsEmulator(functions, "localhost", 5001);
  connectFirestoreEmulator(db, "localhost", 8080);
  connectAuthEmulator(auth, "http://localhost:9099");
}

export { functions };
