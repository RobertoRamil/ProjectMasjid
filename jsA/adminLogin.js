// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";

import { getStorage, ref, getDownloadURL, uploadBytes } from 'https://www.gstatic.com/firebasejs/11.0.1/firebase-storage.js';

import {
  getAuth, signInWithEmailAndPassword, sendPasswordResetEmail, browserSessionPersistence, setPersistence,
  signInWithPopup, GoogleAuthProvider, RecaptchaVerifier, multiFactor, PhoneAuthProvider, PhoneMultiFactorGenerator,
  signInWithPhoneNumber
} from 'https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js';

import { getFirestore, collection, doc, getDoc, updateDoc, getDocs, arrayUnion } from 'https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js'
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
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth();
const provider = new GoogleAuthProvider();
const db = getFirestore();

// Elements
const submit = document.getElementById("submit");
const resetSend = document.getElementById("resetSend");
const forgotPassword = document.getElementById("forgotPassword");
const modalOverlay = document.getElementById("modalOverlay");
const userLogin = document.getElementById("username");
const userPass = document.getElementById("password");
const storage = getStorage(app);

async function fetchLogo() {
  console.log("fetchLogo function called"); // Debugging line
  const storageRef = ref(storage, 'HeaderPhotos/logo2.png');
  try {
    const url = await getDownloadURL(storageRef);
    console.log("Logo URL:", url); // Debugging line
    document.getElementById('logo of MMSC').src = url;
    console.log("Logo fetched and set successfully"); // Debugging line
  } catch (error) {
    console.error("Error fetching logo:", error);
  }
} 
window.onload = function() {
  fetchLogo();
}

userLogin.addEventListener('keydown', onEnterKeyPress);
userPass.addEventListener('keydown', onEnterKeyPress);

function onEnterKeyPress(event) {
  if (event.key === 'Enter') {
    console.log("click submitted");
    submit.click();
  }
}


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
      verifyAdminAndSignIn(user.user);
      
      //window.location.href = "adminHome.html";
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

const whitelistedAdmins = await getDocs(collection(db, "whitelistedAdmins"));
const appVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
  size: 'normal'
});

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

// Google Sign-In
const googleLogin = document.getElementById("googleLogin");
googleLogin.addEventListener("click", (event) => {
  event.preventDefault();
  signInWithPopup(auth, provider)
    .then((result) => {
      const user = result.user;
      verifyAdminAndSignIn(user);
    }).catch((error) => {
      console.log(error);
    });
});

// Phone Sign-In (After Google Sign-In & Manual Sign-In)
async function verifyAdminAndSignIn(user) {
  const isAdmin = whitelistedAdmins.docs.some(doc => doc.id === user.email);
  if (isAdmin) {
    const phoneNumber = whitelistedAdmins.docs.find(doc => doc.id === user.email).data().phoneNumber;

    //const adminDocId = whitelistedAdmins.docs.find(doc => doc.id === user.email).id;

    try {
      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      const verificationCode = prompt("Please enter the verification code sent to your phone:");
      const result = await confirmationResult.confirm(verificationCode);
      const user = result.user;
      console.log(result);
      //console.log("Phone number verified and user signed in:");
      window.location.href = "adminHome.html";
    } catch (error) {
      grecaptcha.reset(appVerifier);
      console.error("Error during phone number sign-in:", error);

      alert("Error: Unable to sign in with phone number.");
    }
  } else {
    alert("You are not authorized to access this page.");
  }
}