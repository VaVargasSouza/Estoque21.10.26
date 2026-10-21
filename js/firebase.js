import { initializeApp } from
    "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";

import { getFirestore } from
    "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";

// Cole aqui a configuração REAL do seu projeto Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDY6t2VR1JYpgO_1SOtt8v0EtejV1YHg1g",
  authDomain: "rotina21-10-2026.firebaseapp.com",
  projectId: "rotina21-10-2026",
  storageBucket: "rotina21-10-2026.firebasestorage.app",
  messagingSenderId: "739441108510",
  appId: "1:739441108510:web:596394fbd3298aade6300f",
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Cria e exporta a conexão com o Firestore
export const db = getFirestore(app);

// 