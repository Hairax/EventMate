// features/auth/services/authService.ts

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup, // <--- CAMBIAR ESTA LÍNEA
  GoogleAuthProvider,
  signOut,
} from "firebase/auth";
import { auth } from "@/lib/firebase";


const provider = new GoogleAuthProvider();

export const loginWithEmail = (email: string, password: string) =>
  signInWithEmailAndPassword(auth, email, password);

export const registerWithEmail = (email: string, password: string) =>
  createUserWithEmailAndPassword(auth, email, password);

export const loginWithGoogle = () => signInWithPopup(auth, provider);

export const logout = () => signOut(auth);