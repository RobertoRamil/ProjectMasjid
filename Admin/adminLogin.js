// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail, GoogleAuthProvider, signInWithPopup } from 'https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js';

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
const provider = new GoogleAuthProvider();


const submit = document.getElementById("submit");
const reset = document.getElementById("forgot_password");

submit.addEventListener("click", (event) => {
  event.preventDefault();
  const email = document.getElementById("username").value;
  const password = document.getElementById("password").value;



  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      window.location.href = "adminHome.html"
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      if (email != "" && password != "") {
        alert("Error: Username or password incorrect");
      }


    });
})
/*
reset.addEventListener("click", (event) => {
  event.preventDefault();
  const email = document.getElementById("username").value;

  sendPasswordResetEmail(auth, email)
    .then((userCredential) => {
      // Signed in 
      alert("pass");
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert("fail");
    });
})
*/

/*Reset password modal*/
/*
function openModal() {
  document.getElementById("modalOverlay").style.display = "flex";
}

function closeModal() {
  document.getElementById("modalOverlay").style.display = "none";
}
*/
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