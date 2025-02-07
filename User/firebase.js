import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";

import { getStorage, ref, getDownloadURL } from 'https://www.gstatic.com/firebasejs/11.0.1/firebase-storage.js';
import { getFirestore, collection, doc, getDoc, updateDoc, getDocs, arrayUnion } from 'https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js'


export const firebaseConfig = {
  apiKey: "AIzaSyChNmvSjjLzXfWeGsKHebXgGq_AMUdKzHo",
  authDomain: "project-musjid.firebaseapp.com",
  projectId: "project-musjid",
  storageBucket: "project-musjid.firebasestorage.app",
  messagingSenderId: "445451894728",
  appId: "1:445451894728:web:09bffcb1743ae1ecec4afd",
  measurementId: "G-H5XN7NRJ6V"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
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

async function setHeaderBackground() {
  const storageRef = ref(storage, 'HeaderPhotos/FrontImage.png');
  try {
    const url = await getDownloadURL(storageRef);
    console.log("Header background URL fetched:", url); // Debugging line
    document.querySelector('.header').style.backgroundImage = `url(${url})`;
  } catch (error) {
    console.error("Error fetching header background:", error);
  }
}

const contactsRef = doc(db, "users", "userContacts");
const contactsSnap = getDoc(contactsRef);

const colRef = collection(db, "users");

function signUpEmail(){
    const userEmail = document.getElementById("emailField").value;
    var emailRegex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
      //IMPORTANT NOTE FOR LATER: Add functionality to ensure that the email is not a duplicate
      //IMPORTANT NOTE FOR LATER: When email sending is function we need to make an authentification method to avoid botting
    if(emailRegex.test(userEmail)){
        //This alert can be polished later into something prettier
      alert("You have joined the newsletter!");
      updateDoc(contactsRef, {emails: arrayUnion(userEmail)})
    }
    else{
      alert("Invalid Email");
  
    }
    
  }
  
function signUpPhone(){
    const userPhone = document.getElementById("phoneField").value;
    var phoneRegex = /^(\+\d{1,2}\s?)?1?\-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
    //IMPORTANT NOTE FOR LATER: Add functionality to ensure that the phonenumber is not a duplicate
    //IMPORTANT NOTE FOR LATER: When sms is function we need to make an authentification method to avoid botting
    if(phoneRegex.test(userPhone)){
        //This alert can be polished later into something prettier
        var phoneNum = userPhone.replace(/[^A-Z0-9]/ig, "");
        alert("You have joined the newsletter!");
        updateDoc(contactsRef, {phoneNums: arrayUnion(phoneNum)})
    }
    else{
      alert("Invalid Phone number");
    }
    
}
window.signUpEmail = signUpEmail;
window.signUpPhone = signUpPhone;
window.setHeaderBackground = setHeaderBackground;
window.fetchLogo = fetchLogo;

getDocs(colRef)
    .then((snapshot) => {
        let users = []
        snapshot.docs.forEach((doc) => {
            users.push({ ...doc.data(), id: doc.id })
        })
        console.log(users)
    })
    .catch(err => {
        console.log(err.message)
    })

