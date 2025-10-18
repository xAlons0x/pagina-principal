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
    
    if (!container) {
        if (redirectURL) {
            alert(message);
            window.location.href = redirectURL;
        } else {
            alert(message);
        }
        return;
    }
    
    container.style.display = 'block';

    const icon = type === 'success' ? '<i class="fas fa-check-circle"></i>' : '<i class="fas fa-times-circle"></i>';
    // ERROR: REQUIERE CLIC. ÉXITO: no tiene botón.
    const closeBtn = autoClose ? '' : '<button onclick="document.getElementById(\'custom-alert-container\').style.display=\'none\'">CERRAR</button>';
    
    container.innerHTML = `
        <div class="custom-alert ${type}" id="alert-box">
            ${icon}
            <p>${message}</p>
            ${closeBtn}
        </div>
    `;

    // 1. Mostrar el modal con animación de entrada
    setTimeout(() => {
        const alertBox = document.getElementById('alert-box');
        if(alertBox) {
             alertBox.classList.add('show');
        }
    }, 10); 

    if (autoClose) {
        // 2. Esperar el tiempo de visualización (2.0 segundos)
        setTimeout(() => {
            const alertBox = document.getElementById('alert-box');
            if(alertBox) {
                alertBox.classList.remove('show'); // Iniciar animación de salida
                
                // 3. Esperar a que la animación de salida termine (0.5 segundos)
                setTimeout(() => { 
                    container.style.display = 'none'; 
                    
                    // 4. Redirección GARANTIZADA al final
                    if(redirectURL) {
                        window.location.href = redirectURL; 
                    }
                }, 500); 
            }
        }, 2000); // Tiempo de visualización del mensaje
    }
}


// =============================================================
// FUNCIÓN DE REGISTRO
// =============================================================
function handleRegistration(event) {
    event.preventDefault();

    // IDs Sincronizados
    const email = document.getElementById('email').value;
    const password = document.getElementById('contrasena').value; 
    const username = document.getElementById('username').value; 
    
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
            
            // 1. Guardar datos en Firestore
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
            
            const redirectURL = `dashboard.html?username=${username}`; 

            // 2. ÉXITO: Muestra el modal verde con retraso y redirección
            showAlert("¡Te has registrado correctamente!", 'success', true, redirectURL);
            
        })
        .catch((error) => {
            // Habilitar el botón en caso de error
            submitBtn.disabled = false;
            
            const errorCode = error.code;
            let errorMessage;

            if (errorCode === 'auth/email-already-in-use') {
                errorMessage = "¡Ya hay una cuenta con este correo!"; // ESTE MENSAJE DEBE SALIR AHORA
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