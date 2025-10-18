// registro.js

// Importar herramientas necesarias de Firebase
// Nota: 'auth' y 'db' vienen de tu firebase-config.js
import { auth, db } from "./firebase-config.js"; 
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js"; 


// Función principal que maneja el registro
function handleRegistration(event) {
    event.preventDefault(); // Detener el envío de formulario HTML

    // 1. Obtener los valores de los campos por sus IDs
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const username = document.getElementById('register-username').value; 

    // Opcional: Validaciones de longitud mínima de Firebase
    if (password.length < 6) {
        alert("Contraseña muy débil. Firebase requiere un mínimo de 6 caracteres.");
        return;
    }

    // 2. Llamar a Firebase para crear el usuario
    createUserWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
            const user = userCredential.user;
            
            // 2.1. Guardar datos adicionales (username) en Firestore
            try {
                // Guarda el username y ajustes iniciales (tema/idioma)
                await setDoc(doc(db, "users", user.uid), {
                    username: username,
                    email: user.email,
                    theme: 'light', 
                    language: 'es' 
                });
            } catch (e) {
                console.error("Error al guardar datos de usuario en la base de datos: ", e);
            }
            
            alert(`¡Registro exitoso! Bienvenido, ${username}.`);
            
            // 3. Redirigir al dashboard (Usando la ruta absoluta para GitHub Pages)
            window.location.href = `/pagina-principal/dashboard.html?username=${username}`;
        })
        .catch((error) => {
            // Manejar errores de Firebase
            const errorCode = error.code;
            let errorMessage;

            if (errorCode === 'auth/email-already-in-use') {
                errorMessage = "Ese correo ya está registrado.";
            } else if (errorCode === 'auth/invalid-email') {
                 errorMessage = "El formato del correo electrónico es inválido.";
            } else if (errorCode === 'auth/weak-password') {
                 errorMessage = "Contraseña muy débil. Debe tener al menos 6 caracteres.";
            } else {
                 errorMessage = `Error de Firebase: ${error.message}`;
            }

            alert(errorMessage);
        });
}

// 4. Conectar la función al formulario cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    const registrationForm = document.getElementById('registration-form');
    if (registrationForm) {
        registrationForm.addEventListener('submit', handleRegistration);
    }
});