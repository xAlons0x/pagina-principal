// registro.js

// Importar herramientas necesarias de Firebase
import { auth, db } from "./firebase-config.js"; 
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js"; 


// =============================================================
// FUNCIÓN PARA MOSTRAR MENSAJES (SOLO ERRORES)
// =============================================================
function showAlert(message, type, autoClose = false) {
    const container = document.getElementById('custom-alert-container');
    
    // Si el contenedor no existe, usamos alert de emergencia
    if (!container) {
        alert(message);
        return;
    }
    
    container.style.display = 'block';

    const icon = type === 'success' ? '<i class="fas fa-check-circle"></i>' : '<i class="fas fa-times-circle"></i>';
    const closeBtn = autoClose ? '' : '<button onclick="document.getElementById(\'custom-alert-container\').style.display=\'none\'">CERRAR</button>';
    
    container.innerHTML = `
        <div class="custom-alert ${type}" id="alert-box">
            ${icon}
            <p>${message}</p>
            ${closeBtn}
        </div>
    `;

    setTimeout(() => {
        const alertBox = document.getElementById('alert-box');
        if(alertBox) {
             alertBox.classList.add('show');
        }
    }, 10); 
}


// =============================================================
// FUNCIÓN DE REGISTRO
// =============================================================
function handleRegistration(event) {
    event.preventDefault(); // CRÍTICO: Evita que el HTML redirija por defecto

    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const username = document.getElementById('register-username').value; 
    
    const submitBtn = document.querySelector('#registration-form button[type="submit"]');
    submitBtn.disabled = true;

    if (password.length < 6) {
        showAlert("Contraseña muy débil. Firebase requiere un mínimo de 6 caracteres.", 'error', false);
        submitBtn.disabled = false;
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
            
            // 2. REDIRECCIÓN CORREGIDA CON RUTA RELATIVA
            const redirectURL = `./dashboard.html?username=${username}`; 
            
            // Redirección inmediata y garantizada al panel
            window.location.href = redirectURL;
            
        })
        .catch((error) => {
            // Habilitar el botón en caso de error
            submitBtn.disabled = false;
            
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

            // Mostrar mensaje de error (requiere clic para quitar)
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