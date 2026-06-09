import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBtx_EaqNs0RBu6BC8s16kVqxizO0iQQdE",
  authDomain: "deveco-feria-87930.firebaseapp.com",
  databaseURL: "https://deveco-feria-87930-default-rtdb.firebaseio.com",
  projectId: "deveco-feria-87930",
  storageBucket: "deveco-feria-87930.firebasestorage.app",
  messagingSenderId: "1016015429921",
  appId: "1:1016015429921:web:1e8eace5f8a1473b8e5e60"
};

// Inicializamos la app de Firebase
const app = initializeApp(firebaseConfig);

// Exportamos la base de datos para usarla en el resto del proyecto
export const db = getFirestore(app);