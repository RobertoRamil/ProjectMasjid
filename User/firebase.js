import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";

import { getStorage, ref, getDownloadURL, deleteObject, uploadBytes} from 'https://www.gstatic.com/firebasejs/11.0.1/firebase-storage.js';
import { getFirestore, collection, doc, getDoc, updateDoc, getDocs, arrayUnion} from 'https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js'
import { getAuth, onAuthStateChanged} from 'https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js';


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

const auth = getAuth();

function checkAuth(){
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      // User is not signed in, redirect to login page
      window.location.href = "adminLogin.html";
      console.log("Page restricted until signed in");
    } else {
      // User is signed in, you can get the user ID if needed
      console.log("Signed in as account Name:", user.displayName);
    }
  });
}
const db = getFirestore(app);
const storage = getStorage(app);

async function fetchLogo() {
  console.log("fetchLogo function called"); // Debugging line
  const storageRef = ref(storage, 'HeaderPhotos/logo2.png');
  try {
    const url = await getDownloadURL(storageRef);
    //console.log("Logo URL:", url); // Debugging line
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
    try {
      //get portraitURL
      const portraitRef = ref(storage, `team_portraits/${memberNames[i]}.PNG`);
      const portraitURL = await getDownloadURL(portraitRef); // Await the getDownloadURL call
      //add portraitURL to an array
      portraitURLs.push(portraitURL);
    } catch (error) {
      console.error("Error getting portrait:", error);
    }
  }
  //console.log(portraitURLs);
  return portraitURLs;
}

async function removeTeamMember(name){
  console.log("Removing team member:", name); // Debugging line
  const teamRef = doc(db, "team", "team_members");
  
  const teamSnap = await getDoc(teamRef); // Await the getDoc call
  const teamData = teamSnap.data();
  if (teamData.teamNames) {
    const index = teamData.teamNames.indexOf(name);
    if (index > -1) {
      teamData.teamNames.splice(index, 1);
    }
  }
  updateDoc(teamRef, { teamNames: teamData.teamNames });
  //Remove the portrait from storage
  const portraitRef = ref(storage, `team_portraits/${name}.PNG`);
  try {
    await deleteObject(portraitRef);
    console.log("Portrait deleted successfully");
  } catch (error) {
    console.error("Error deleting portrait:", error);
  }
}

async function saveTeamMember(name, portrait){
  const teamRef = doc(db, "team", "team_members");
  updateDoc(teamRef, {teamNames: arrayUnion(name)});
  //Rename portrait file name to match the name
  const storageRef = ref(storage, `team_portraits/${name}.PNG`);
  try {
    await uploadBytes(storageRef, portrait);
    console.log("Portrait uploaded successfully");
  } catch (error) {
    console.error("Error uploading portrait:", error);
  }


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

async function saveAbtHeader(){
  const aboutHeader = document.getElementById("adminLeftTitle").textContent;
  const aboutRef = doc(db, "about", "about_header");
  updateDoc(aboutRef, {header: aboutHeader});
}

async function saveAbtBody(){
  const aboutBody = document.getElementById("adminLeftText").textContent;
  const aboutRef = doc(db, "about", "about_body");
  updateDoc(aboutRef, {body: aboutBody});
}

//--------------------------------------------End of setup for about section-------------------------------------------
const contactsRef = doc(db, "users", "userContacts");
const contactsSnap = getDoc(contactsRef);

const colRef = collection(db, "users");

async function getEmailsList(){
  const emailSnap = await getDoc(contactsRef); // Await the getDoc call
  const emails = [];
  //get all the emails from the database
  if (emailSnap.exists()) {
    const emailData = emailSnap.data();
    if (emailData.emails) { 
      emailData.emails.forEach((name) => {
        emails.push(name);
      });
    }
  }
  return emails;
}

async function getPhoneList(){
  const phoneSnap = await getDoc(contactsRef); // Await the getDoc call
  const phones = [];
  //get all the phone numbers from the database
  if (phoneSnap.exists()) {
    const phoneData = phoneSnap.data();
    if (phoneData.phoneNums) { 
      phoneData.phoneNums.forEach((name) => {
        phones.push(name);
      });
    }
  }
  return phones;
}

async function signUpEmail(){
    const userEmail = document.getElementById("emailField").value;
    var emailRegex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
      //IMPORTANT NOTE FOR LATER: Add functionality to ensure that the email is not a duplicate
      //IMPORTANT NOTE FOR LATER: When email sending is function we need to make an authentification method to avoid botting
    if(emailRegex.test(userEmail)){
        //This alert can be polished later into something prettier
        //If email is valid, ensure it is not a duplicate
        //Get emails from the database
        
        //Check if the email is already in the database
        let emails = await getEmailsList();
        if(emails.includes(userEmail)){
          alert("Email already enrolled!");
          return;
        }
        
      alert("You have joined the newsletter!");
      updateDoc(contactsRef, {emails: arrayUnion(userEmail)})
    }
    else{
      alert("Invalid Email");
  
    }
    
  }
  
async function signUpPhone(){
    const userPhone = document.getElementById("phoneField").value;
    var phoneRegex = /^(\+\d{1,2}\s?)?1?\-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
    var phoneNum = userPhone.replace(/[^A-Z0-9]/ig, "");
    //If the phone number does not have a country code, assume it is from the US
    if(phoneNum.length == 10){
        phoneNum = "1" + phoneNum;
    }
    //IMPORTANT NOTE FOR LATER: Add functionality to ensure that the phonenumber is not a duplicate
    //IMPORTANT NOTE FOR LATER: When sms is function we need to make an authentification method to avoid botting
    if(phoneRegex.test(userPhone)){
        //This alert can be polished later into something prettier
        //If number is valid, ensure it is not a duplicate
        //Get phone numbers from the database
        let phones = await getPhoneList();
        if(phones.includes(phoneNum)){
          alert("Phone number already enrolled!");
          return;
        }
        alert("You have joined the newsletter!");
        updateDoc(contactsRef, {phoneNums: arrayUnion(phoneNum)})
    }
    else{
      alert("Invalid Phone number");
    }
    
}
window.getAboutHeader = getAboutHeader;
window.getAboutBody = getAboutBody;
window.getTeamNames = getTeamNames;
window.getTeamPortraits = getTeamPortraits;
window.signUpEmail = signUpEmail;
window.signUpPhone = signUpPhone;
window.setHeaderBackground = setHeaderBackground;
window.fetchLogo = fetchLogo;
window.auth = auth;
window.removeTeamMember = removeTeamMember;
window.saveAbtHeader = saveAbtHeader;
window.saveAbtBody = saveAbtBody;
window.saveTeamMember = saveTeamMember;
window.checkAuth = checkAuth; 

getDocs(colRef)
    .then((snapshot) => {
        let users = []
        snapshot.docs.forEach((doc) => {
            users.push({ ...doc.data(), id: doc.id })
        })
        //console.log(users)
    })
    .catch(err => {
        console.log(err.message)
    })