// firebase-config.js

// 1. TU CONFIGURACIÓN ÚNICA
const firebaseConfig = {
  apiKey: "AIzaSyAA1mS__fij1XITHbBPhOQPyM7xhVwBEFA", // TU CLAVE DE API WEB
  authDomain: "pagina-web-5e6f9.firebaseapp.com", // TU ID DE PROYECTO + .firebaseapp.com
  projectId: "pagina-web-5e6f9", // TU ID DE PROYECTO
  storageBucket: "pagina-web-5e6f9.appspot.com", // TU ID DE PROYECTO + .appspot.com
  messagingSenderId: "489837560543", // TU NÚMERO DE PROYECTO
  appId: "1:489837560543:web:e3f5e55e5c8e3b2e5c8e3b2" // ESTE VALOR ESTÁ DENTRO DE "TUS APPS"
};

// NOTA: Para obtener el valor de 'appId', haz clic en "Tus apps" abajo y revisa la configuración. 
// Si no lo encuentras, el código debería funcionar incluso sin él por ahora.

// 2. Importar los módulos y servicios
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// 3. Inicializar
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app); 
export const db = getFirestore(app);