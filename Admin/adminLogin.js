// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail, browserSessionPersistence, setPersistence }
  from 'https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyChNmvSjjLzXfWeGsKHebXgGq_AMUdKzHo",
  authDomain: "project-musjid.firebaseapp.com",
  projectId: "project-musjid",
  storageBucket: "project-musjid.firebasestorage.app",
  messagingSenderId: "445451894728",
  appId: "1:445451894728:web:09bffcb1743ae1ecec4afd",
  measurementId: "G-H5XN7NRJ6V"
};

// Initialize Firebase
initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth();

// Elements
const submit = document.getElementById("submit");
const resetSend = document.getElementById("resetSend");
const forgotPassword = document.getElementById("forgotPassword");
const modalOverlay = document.getElementById("modalOverlay")
const signOutButton = document.getElementById("signOutButton")

// Submit button
submit.addEventListener("click", (event) => {
  event.preventDefault();

  const email = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  // Sets session to persistent while tab is open. Logs out when tab is closed
  setPersistence(auth, browserSessionPersistence)
    .then(() => {
      return signInWithEmailAndPassword(auth, email, password);
    })
    .then((user) => {
      console.log("Successful Login!");
      window.location.href = "adminHome.html";
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;

      if (email != "" && password != "") {
        document.getElementById("password").value = "";
        alert("Error: Username or password incorrect");

      }
      else if (email == "" || password == "") {
        alert("Error: Both fields must be filled out");
      }
    });
});

// Reset Password button (In modal)
resetSend.addEventListener("click", (event) => {
  event.preventDefault();

  const email = document.getElementById("email").value;

  sendPasswordResetEmail(auth, email)
    .then((userCredential) => {
      // Signed in 
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert("Error: Unable to send password reset email");
    });
})

//Forgot password button
forgotPassword.addEventListener("click", (event) => {
  event.preventDefault();

  document.getElementById("modalOverlay").style.display = "flex";
})

//Close modal if admin clicks off it
modalOverlay.addEventListener("click", (event) => {
  event.preventDefault();
  if (event.target === document.getElementById('modalOverlay')) {
    document.getElementById("modalOverlay").style.display = "none";
  }
})


/*
const googleLogin = document.getElementById("googleLogin");
googleLogin.addEventListener("click", (event) => {
  event.preventDefault();

  signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      // The signed-in user info.
      const user = result.user;
      // IdP data available using getAdditionalUserInfo(result)
      // ...
      alert("success")
    }).catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      alert("fail")
      // ...
    });
})
*/