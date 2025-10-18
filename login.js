// login.js

// Importar herramientas necesarias de Firebase (auth, db ya están en firebase-config.js)
import { auth, db } from "./firebase-config.js"; 
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js"; // Para obtener el username


// Función principal que maneja el inicio de sesión
function handleLogin(event) {
    event.preventDefault(); // Detener el envío de formulario HTML

    // 1. Obtener los valores de los campos por sus IDs
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    // 2. Llamar a Firebase para iniciar sesión
    signInWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
            const user = userCredential.user;
            
            // 2.1. Buscar el username en Firestore
            let username = user.email; // Valor por defecto

            try {
                // El UID del usuario es la clave del documento en la colección 'users'
                const docRef = doc(db, "users", user.uid);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    username = docSnap.data().username; // Obtiene el nombre guardado
                }
            } catch (e) {
                console.error("Error al obtener datos de usuario: ", e);
            }
            
            alert(`¡Sesión iniciada! Bienvenido, ${username}.`);
            
            // 3. Redirigir al dashboard con el username
            window.location.href = `/pagina-principal/dashboard.html?username=${username}`;
        })
        .catch((error) => {
            // Manejar errores de Firebase
            const errorCode = error.code;
            let errorMessage;

            if (errorCode === 'auth/wrong-password' || errorCode === 'auth/user-not-found') {
                errorMessage = "Correo o contraseña incorrectos.";
            } else if (errorCode === 'auth/invalid-email') {
                 errorMessage = "El formato del correo electrónico es inválido.";
            } else {
                 errorMessage = `Error de inicio de sesión: ${error.message}`;
            }

            alert(errorMessage);
        });
}

// 3. Conectar la función al formulario cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
});