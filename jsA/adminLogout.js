import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut} from 'https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY_FIREBASE,
  authDomain: import.meta.env.VITE_authDomain_Firebase,
  projectId: import.meta.env.VITE_projectId_Firebase,
  storageBucket: import.meta.env.VITE_storageBucket_Firebase,
  messagingSenderId: import.meta.env.VITE_messagingSenderId_Firebase,
  appId: import.meta.env.VITE_appId_Firebase,
  measurementId: import.meta.env.VITE_measurementId_Firebase
};

  const app = initializeApp(firebaseConfig);
  
  // Initialize Firebase Authentication and get a reference to the service
  const auth = getAuth();

export function logout(){
    onAuthStateChanged(auth, (user) => {
        if (user) {
            signOut(auth)
              .then(() => {
                alert("User signed out successfully!");
                console.log("User signed out successfully!");
                window.location.href = "adminLogin.html";
              })
              .catch((error) => {
                console.error("Error signing out: ", error);
              });
          } else {
            console.log("No user is currently logged in.");
            window.location.href = "adminLogin.html";
          }
      });
}

window.logout = logout;