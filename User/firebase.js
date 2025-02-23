import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";

import { getStorage, ref, getDownloadURL } from 'https://www.gstatic.com/firebasejs/11.0.1/firebase-storage.js';
import { getFirestore, collection, doc, getDoc, updateDoc, getDocs, setDoc, arrayUnion,Timestamp,getCountFromServer } from 'https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js'

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
    })
    .catch(err => {
        console.log(err.message)
    })




//This goes to the firebase database, looks at the prayerTimes collection and at the Prayers document.
const prayerRef = doc(db, "prayerTimes", "Prayers");

//This pulls the prayer times from the prayerTimes collection in firebase
async function pullPrayerTime(){
const prayerSnap = await getDoc(prayerRef);

  try{
    const data = prayerSnap.data();
    const fieldCount = Object.keys(data).length;
    /*
    forloop (using fieldCount), 
    grab prayer name->congregationNames[i] in homeScript.js
    grab prayer time-> congregationTimes[i]
    
    */
    console.log("Document data:", `${fieldCount}`);

  }catch (e) {
    console.log("error getting prayer Times"+e);
  }  
}
window.onload=pullPrayerTime;


function createPrayerTime(prayerName, prayerNumber, prayerTimes){
  let prayerTime;
  let firebaseTimeStamp;
  let currentDate=new Date();

  //If it's a Jumu'ah prayer/speech it will translate the date value to timestamp to be stored.
  //Else, it will grab the system's current day, month, and year at the time of pressing save to fill in those data points for the timestamp.

  //CURRENTLY ONLY ALLOWS ONLY ONE JUMU'AH PRAYER AND SPEECH. CURRENTLY DOES NOT WORK IF MULTIPLE JUMU'AH ARE ADDED THEN REMOVED!!!! 
  if(prayerName.includes("Jumu'ah")){
    prayerTime=document.getElementById(`sPrayerTime${prayerNumber}`).value;
    let tempDate=new Date(prayerTime);
    firebaseTimeStamp=Timestamp.fromDate(tempDate);
  }else{
    prayerTime=document.getElementById(`prayerTime${prayerNumber}`).value;
    prayerTime=prayerTime.split(":");
    firebaseTimeStamp=Timestamp.fromDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), prayerTime[0], prayerTime[1],0));
  }

  prayerTimes[prayerName] = firebaseTimeStamp;
}

//ERROR IN THE CONSOLE WHEN NOT IN THE ADMIN SIDE 
//Translating the prayer times to timestamps to put into database and then testing to push to the database.
//If there are time slots present but not filled, it will not push all of the data and alert the user.
document.getElementById("prayerSaveButton").addEventListener("click",function(){
  let timeAmount=document.getElementsByClassName("time").length;
  let prayerTimes={};

  for(let i=1; i<=timeAmount;i++){ //Grabs the time slot's id number, associate it with a prayer name, grab that time's data 
    switch(i){
      case 1:
        createPrayerTime("Fajr",1,prayerTimes);
      break;
      case 2:
        createPrayerTime("Dhuhr",2,prayerTimes);
        break;
      case 3:
        createPrayerTime("Asr",3,prayerTimes);
        break;  
      case 4:
        createPrayerTime("Maghrib",4,prayerTimes);
        break;
      case 5:
        createPrayerTime("Isha",5,prayerTimes);
        break; 
      default:
        if(i%2==0){
          createPrayerTime("Jumu'ah (Speech)",i-5,prayerTimes);
        }else{
          createPrayerTime("Jumu'ah (Prayer)",i-5,prayerTimes);
        }
    }
  }

  try{
    setDoc(prayerRef, prayerTimes);
  }catch(e){
    console.log("Error saving prayer times.",e);
    alert("All prayer hours must be submitted to update the prayer hours.");
  }
});

