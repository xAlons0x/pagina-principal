// registro.js

// Importar herramientas necesarias de Firebase
import { auth, db } from "./firebase-config.js"; 
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js"; 


// =============================================================
// FUNCIÓN PARA MOSTRAR MENSAJES (ÉXITO Y ERROR)
// =============================================================
function showAlert(message, type, autoClose = false, redirectURL = null) {
    const container = document.getElementById('custom-alert-container');
    container.style.display = 'block';

    // Se cambió a 'fas fa-check-circle' (paloma) y 'fas fa-times-circle' (X)
    const icon = type === 'success' ? '<i class="fas fa-check-circle"></i>' : '<i class="fas fa-times-circle"></i>';
    // Se asegura de que la función de cerrar sea global
    const closeBtn = autoClose ? '' : '<button onclick="document.getElementById(\'custom-alert-container\').style.display=\'none\'">CERRAR</button>';
    
    container.innerHTML = `
        <div class="custom-alert ${type}" id="alert-box">
            ${icon}
            <p>${message}</p>
            ${closeBtn}
        </div>
    `;

    setTimeout(() => {
        document.getElementById('alert-box').classList.add('show');
    }, 10); // Pequeño retraso para la animación de entrada

    if (autoClose) {
        setTimeout(() => {
            const alertBox = document.getElementById('alert-box');
            if(alertBox) {
                alertBox.classList.remove('show');
                setTimeout(() => { 
                    container.style.display = 'none'; 
                    if(redirectURL) {
                        window.location.href = redirectURL; // Redirigir DESPUÉS de la animación de salida
                    }
                }, 500); // Esperar animación de salida
            }
        }, 2500); // El mensaje dura 2.5 segundos
    }
}


// =============================================================
// FUNCIÓN DE REGISTRO
// =============================================================
function handleRegistration(event) {
    event.preventDefault(); 

    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const username = document.getElementById('register-username').value; 

    if (password.length < 6) {
        showAlert("Contraseña muy débil. Firebase requiere un mínimo de 6 caracteres.", 'error', false);
        return;
    }

    createUserWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
            const user = userCredential.user;
            
            // 1. Guardar datos adicionales (username) en Firestore
            try {
                await setDoc(doc(db, "users", user.uid), {
                    username: username,
                    email: user.email,
                    theme: 'light', 
                    language: 'es' 
                });
            } catch (e) {
                console.error("Error al guardar datos de usuario en la base de datos: ", e);
            }
            
            const redirectURL = `/pagina-principal/dashboard.html?username=${username}`;

            // 2. Mostrar mensaje de éxito (ESTA ES LA LÍNEA CRUCIAL CORREGIDA)
            showAlert("¡Te has registrado correctamente!", 'success', true, redirectURL);
        })
        .catch((error) => {
            const errorCode = error.code;
            let errorMessage;

            if (errorCode === 'auth/email-already-in-use') {
                errorMessage = "¡Ya hay una cuenta con este correo!";
            } else if (errorCode === 'auth/invalid-email') {
                 errorMessage = "El formato del correo electrónico es inválido.";
            } else if (errorCode === 'auth/weak-password') {
                 errorMessage = "Contraseña muy débil. Debe tener al menos 6 caracteres.";
            } else {
                 errorMessage = `Error de Firebase: ${error.message}`;
            }

            // Mostrar mensaje de error (cruz roja, requiere clic para quitar)
            showAlert(errorMessage, 'error', false);
        });
}


// =============================================================
// CONEXIÓN AL FORMULARIO
// =============================================================
document.addEventListener('DOMContentLoaded', () => {
    const registrationForm = document.getElementById('registration-form');
    if (registrationForm) {
        registrationForm.addEventListener('submit', handleRegistration);
    }
});