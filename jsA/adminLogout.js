import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut} from 'https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js';

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID
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