import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut} from 'https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js';

const firebaseConfig = {
    apiKey: "AIzaSyChNmvSjjLzXfWeGsKHebXgGq_AMUdKzHo",
    authDomain: "project-musjid.firebaseapp.com",
    projectId: "project-musjid",
    storageBucket: "project-musjid.firebasestorage.app",
    messagingSenderId: "445451894728",
    appId: "1:445451894728:web:09bffcb1743ae1ecec4afd",
    measurementId: "G-H5XN7NRJ6V"
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