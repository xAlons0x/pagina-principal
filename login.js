// login.js

// Importar herramientas necesarias de Firebase
import { auth, db } from "./firebase-config.js"; 
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js"; 


// =============================================================
// FUNCIÓN PARA MOSTRAR MENSAJES (ERROR)
// =============================================================
function showAlert(message, type, autoClose = false) {
    const container = document.getElementById('custom-alert-container');
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
        document.getElementById('alert-box').classList.add('show');
    }, 10); // Pequeño retraso para la animación

    if (autoClose) {
        setTimeout(() => {
            const alertBox = document.getElementById('alert-box');
            if(alertBox) {
                alertBox.classList.remove('show');
                setTimeout(() => { container.style.display = 'none'; }, 500); // Esperar animación de salida
            }
        }, 3000);
    }
}


// =============================================================
// FUNCIÓN DE LOGIN
// =============================================================
function handleLogin(event) {
    event.preventDefault(); 

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    signInWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
            const user = userCredential.user;
            
            // Buscar el username en Firestore
            let username = 'Usuario'; 

            try {
                const docRef = doc(db, "users", user.uid);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    username = docSnap.data().username; 
                }
            } catch (e) {
                console.error("Error al obtener datos de usuario: ", e);
            }
            
            // ÉXITO: Redirección INMEDIATA sin modal, como solicitaste.
            window.location.href = `/pagina-principal/dashboard.html?username=${username}`;
        })
        .catch((error) => {
            const errorCode = error.code;
            let errorMessage;

            if (errorCode === 'auth/wrong-password' || errorCode === 'auth/user-not-found' || errorCode === 'auth/invalid-credential') {
                errorMessage = "Correo o contraseña incorrectos.";
            } else if (errorCode === 'auth/invalid-email') {
                 errorMessage = "El formato del correo electrónico es inválido.";
            } else {
                 errorMessage = `Error: ${error.message}`;
            }

            // Mostrar el mensaje de error con icono X (requiere clic para quitar)
            showAlert(`¡ERROR! ${errorMessage}`, 'error', false);
        });
}


// =============================================================
// CONEXIÓN AL FORMULARIO
// =============================================================
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
});