// Importamos las funciones necesarias de Firebase
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';

// Configuración de Firebase usando variables de entorno
// Estas variables deben estar definidas en el archivo .env.local
const firebaseConfig = {
 // Clave API de Firebase
 apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
 // Dominio de autenticación
 authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
 // ID del proyecto
 projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
 // Bucket de almacenamiento
 storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
 // ID del remitente para mensajería
 messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
 // ID de la aplicación
 appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
 // ID para análisis de métricas
 measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Inicializamos la aplicación Firebase
const app = initializeApp(firebaseConfig);
// Exportamos la instancia de Firestore para usar en la aplicación
export const db = getFirestore(app);