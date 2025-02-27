import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";

import { getStorage, ref, getDownloadURL, uploadBytes } from 'https://www.gstatic.com/firebasejs/11.0.1/firebase-storage.js';
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

//--------------------------------------------Setup for team members---------------------------------------------------
async function getTeamNames(){
  const teamRef = doc(db, "team", "team_members");
  const teamSnap = await getDoc(teamRef); // Await the getDoc call
  const teamNames = [];
  //get all the team names from the database
  if (teamSnap.exists()) {
    const teamData = teamSnap.data();
    if (teamData.teamNames) { 
      teamData.teamNames.forEach((name) => {
        teamNames.push(name);
      });
    }
  }
  //console.log(teamNames);
  return teamNames;
}

async function getTeamPortraits(num_mems, memberNames){
  //create array to store portraitURLs
  const portraitURLs = [];
  for(let i = 0; i < num_mems; i++){
    console.log("Getting portrait for", memberNames[i]); // Debugging line
    const portraitRef = ref(storage, `team_portraits/${memberNames[i]}.PNG`);
    const portraitURL = await getDownloadURL(portraitRef); // Await the getDownloadURL call
    //add portraitURL to an array
    portraitURLs.push(portraitURL);
  }
  //console.log(portraitURLs);
  return portraitURLs;
}
//--------------------------------------------End of setup for team members--------------------------------------------

//--------------------------------------------Setup for about section--------------------------------------------------
async function getAboutHeader(){
  const aboutRef = doc(db, "about", "about_header");
  const aboutSnap = await getDoc(aboutRef); // Await the getDoc call
  const aboutHeader = aboutSnap.data().header;
  return aboutHeader;
}

async function getAboutBody(){
  const aboutRef = doc(db, "about", "about_body");
  const aboutSnap = await getDoc(aboutRef); // Await the getDoc call
  const aboutBody = aboutSnap.data().body;
  return aboutBody;
}
//--------------------------------------------End of setup for about section-------------------------------------------
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

async function getlinks() {
  const linksColRef = collection(db, "Links");
  try {
    const snapshot = await getDocs(linksColRef);
    let links = {};
    snapshot.docs.forEach((doc) => {
      links[doc.id] = doc.data().link;
    });

    if (links.facebook) {
      document.getElementById('facebook_footer_link').href = links.facebook;
      console.log("Facebook link set to:", links.facebook);
    }
    if (links.instagram) {
      document.getElementById('instagram_footer_link').href = links.instagram;
      console.log("Instagram link set to:", links.instagram);
    }
    if (links.youtube) {
      document.getElementById('youtube_footer_link').href = links.youtube;
      console.log("YouTube link set to:", links.youtube); 
    }
    console.log(links);
  } catch (error) {
    console.error("Error fetching links:", error);
  }
}

async function uploadImage() {
    const file = document.getElementById("imageUpload").files[0];
    const imageType = document.getElementById("imageType").value;
    if (!file) {
        document.getElementById("uploadStatus").textContent = "Please select an image first.";
        document.getElementById("uploadStatus").style.color = "red";
        return;
    }

    let storagePath;
    if (imageType === "logo") {
        storagePath = 'HeaderPhotos/logo2.png';
    } else if (imageType === "backdrop") {
        storagePath = 'HeaderPhotos/FrontImage.png';
    } else {
        document.getElementById("uploadStatus").textContent = "Invalid image type selected.";
        document.getElementById("uploadStatus").style.color = "red";
        return;
    }

    const storageRef = ref(storage, storagePath);
    try {
        await uploadBytes(storageRef, file);
        document.getElementById("uploadStatus").textContent = "Image uploaded successfully!";
        document.getElementById("uploadStatus").style.color = "green";
        document.getElementById("imagePreview").style.display = "none";
        document.getElementById("imageUpload").value = "";
    } catch (error) {
        console.error("Error uploading image:", error);
        document.getElementById("uploadStatus").textContent = "An error occurred. Please try again.";
        document.getElementById("uploadStatus").style.color = "red";
    }
}

window.getAboutHeader = getAboutHeader;
window.getAboutBody = getAboutBody;
window.getTeamNames = getTeamNames;
window.getTeamPortraits = getTeamPortraits;
window.uploadImage = uploadImage;
window.getlinks = getlinks;
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