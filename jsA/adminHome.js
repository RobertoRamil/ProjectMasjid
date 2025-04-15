// Start: Redirect to login page if the user is not authenticated
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, onAuthStateChanged} from 'https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js';
import { getStorage, ref, listAll, getDownloadURL, uploadBytes, deleteObject } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-storage.js";
import { getFirestore, Timestamp, collection, doc, setDoc, getDoc, deleteDoc, updateDoc, getDocs, arrayUnion } from 'https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js'

//Hide this later
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
const auth = getAuth(app);

// Initialize Firebase Storage
const storage = getStorage(app);
const db = getFirestore(app);

// Check if the user is authenticated
/*
onAuthStateChanged(auth, (user) => {
  if (!user) {
    // User is not signed in, redirect to login page
    window.location.href = "adminLogin.html";
    console.log("Page restricted until signed in");
  } else {
    console.log(user);
  }
});
*/
// End: Redirect to login page if the user is not authenticated

// Load existing slideshow photos
function loadSlideshowPhotos() {
    const slideshowPreview = document.getElementById("slideshowPreview");
    const slideshowRef = ref(storage, 'Slideshow/');
    listAll(slideshowRef).then((result) => {
        result.items.forEach((itemRef) => {
            getDownloadURL(itemRef).then((url) => {
                const img = document.createElement("img");
                img.src = url;
                img.className = "slideshowImage";
                img.onclick = () => img.classList.toggle("selected");
                slideshowPreview.appendChild(img);
            });
        });
    }).catch((error) => {
        console.error("Error loading slideshow photos:", error);
    });
}

// Add a new photo to the slideshow
document.getElementById("addPhotoButton").addEventListener("click", () => {
    const slideshowInput = document.getElementById("slideshowInput");
    const file = slideshowInput.files[0];
    if (!file) return;

    const slideshowPreview = document.getElementById("slideshowPreview");
    if (slideshowPreview.children.length >= 10) {
        alert("Maximum number of photos reached.");
        return;
    }

    const storageRef = ref(storage, `Slideshow/${file.name}`);
    uploadBytes(storageRef, file).then(() => {
        const img = document.createElement("img");
        img.src = URL.createObjectURL(file);
        img.className = "slideshowImage";
        img.onclick = () => img.classList.toggle("selected");
        slideshowPreview.appendChild(img);

        // Alert success and reset input and preview
        alert("Photo added successfully.");
        slideshowInput.value = "";
        document.getElementById("photoPreview").style.display = "none";
    }).catch((error) => {
        console.error("Error uploading photo:", error);
        alert("Failed to add photo.");
    });
});


//Prayer List
let sPrayerCounter = 1;
let sPrayerRows=1;

document.getElementById("prayerSaveButton").addEventListener("click", function savePrayer() {
  const prayerAmount=document.getElementsByClassName("time").length;
  savePrayerTime(5);
  saveSPrayerTime(prayerAmount);
});

// Show photo preview when a file is selected
document.getElementById("slideshowInput").addEventListener("change", (event) => {
    const file = event.target.files[0];
    const photoPreview = document.getElementById("photoPreview");

    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            photoPreview.src = e.target.result;
            photoPreview.style.display = "block";
        };
        reader.readAsDataURL(file);
    } else {
        photoPreview.style.display = "none";
    }
});

// Delete selected photos from the slideshow
document.getElementById("deletePhotoButton").addEventListener("click", () => {
    const selectedImages = document.querySelectorAll(".slideshowImage.selected");
    const deletePromises = [];
    selectedImages.forEach((img) => {
        const fileName = decodeURIComponent(img.src.split('/').pop().split('#')[0].split('?')[0]);
        const storageRef = ref(storage, `/${fileName}`);
        deletePromises.push(deleteObject(storageRef).then(() => {
            img.remove();
        }).catch((error) => {
            console.error("Error deleting photo:", error);
        }));
    });

    Promise.all(deletePromises).then(() => {
        // Reload the slideshow photos after deletion
        document.getElementById("slideshowPreview").innerHTML = ""; // Clear existing photos
        loadSlideshowPhotos();
    });
});

loadSlideshowPhotos();

//This is for generating the special prayer times and name
function addPrayer(){
  const rowsContainer = document.getElementById("rows-container");
  if(sPrayerCounter<=5){
      // Create a new row
      const newRow = document.createElement("form");
      newRow.className = "prayer_time_and_label";
      newRow.id = `sPrayerRow${sPrayerCounter}`; // Assign a unique ID to the row

      const sLabel=document.createElement("div");
      sLabel.className="sPrayerLabel";

      //Create the label of the speech and prayer
      const sPrayerLabel = document.createElement("label");
      sPrayerLabel.style.fontSize="medium";
      sPrayerLabel.textContent="Insert Prayer Name";

      const sPrayerName = document.createElement("input");
      sPrayerName.className="sPrayerName";  

      //'X' button to get rid of the special prayer row
      const sPrayerClose=document.createElement("button");
      sPrayerClose.ariaLabel = "Close alert";
      sPrayerClose.className="close_button";
      sPrayerClose.textContent='X';
      rowsContainer.appendChild(sPrayerClose);

      //If the X is pressed. Currently This has the issue of lengths being out of order as the ids need to be concatinated.
      sPrayerClose.addEventListener("click", () => {
        sPrayerCounter--;
        newRow.remove();
        sPrayerClose.remove();
      });

      // Create input for prayer time
      const sPrayerTimeInput = document.createElement("input");
      sPrayerTimeInput.type = "datetime-local";
      sPrayerTimeInput.placeholder = "Prayer Time";
      sPrayerTimeInput.className = "time";
      //Giving ids to the prayer name and input
      sPrayerName.id = `sPrayerName${sPrayerCounter}`; // Unique ID for the prayer name input
      sPrayerName.htmlFor = `sPrayerTime${sPrayerCounter}`; //Making the label bind to the input
      sPrayerTimeInput.id=`sPrayerTime${sPrayerCounter}`; //unique ID for prayer time input

      // Wrap the time input in a span for styling consistency
      const timeSpan = document.createElement("span");
      timeSpan.appendChild(sPrayerTimeInput);

      // Append inputs to the new row
      sLabel.appendChild(sPrayerLabel);
      sLabel.appendChild(sPrayerClose);

      newRow.appendChild(sLabel);
      newRow.appendChild(sPrayerName);
      newRow.appendChild(timeSpan);

      // Append the row to the rows container
      rowsContainer.appendChild(newRow);

      sPrayerCounter++;
      sPrayerRows++;
    }else{
      alert("Too many special prayers, change or delete.");
    }
}

document.getElementById("addSPrayerRow").addEventListener("click", addPrayer);

//This presets the prayer times on admin side to remind admins what size is in the database
async function loadCurrentPrayerTimes(){
  let congregationNames = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];
  

  for(let i=0; i<congregationNames.length; i++){
      let timeTemp =await pullPrayerTime(congregationNames[i]);
      var temp="prayerTime"+ (i+1);
      let prayerInput=document.getElementById(temp);
      prayerInput.value=timeTemp.toLocaleTimeString("en-GB", {hour: '2-digit', minute: '2-digit'});
 }

  let sPrayers=await pullSPrayerTime();
  const sPrayerNames=Object.values(sPrayers)[0];
  const sPrayerTime=Object.values(sPrayers)[1];

  if(sPrayers!=null){
    for(let i=0; i<sPrayerNames.length; i++){
      addPrayer();

      var nameTemp="sPrayerName"+ (i+1);
      var timeTemp="sPrayerTime"+ (i+1);

      let sPrayerNameInput=document.getElementById(nameTemp);
      let sPrayerInput=document.getElementById(timeTemp);

      sPrayerNameInput.value=sPrayerNames[i];
      sPrayerInput.value=sPrayerTime[i].toISOString().slice(0, 16);
    }
  }
}

async function pullPrayerTime(prayerName){
  const prayerRef = doc(db, "prayerTimes", "prayerTime");
  const prayerSnap = await getDoc(prayerRef);
  const prayerHourData = prayerSnap.data(); //Gets the data from the prayer database

  try{
    const fieldCount = Object.keys(prayerHourData).length;//Gets the count of prayers in the database
    let keys=Object.keys(prayerHourData); //Isolates data to prayer names
    let info=Object.values(prayerHourData); //Isolates the data to the values

    for(let i=0;i<fieldCount; i++){
      if(keys[i]==prayerName){
        let fullDate=info[i].toDate();
        return(fullDate);
      }
    }
  }catch (e) {
    console.log("error getting prayer Times"+e);
  }  
}

async function pullSPrayerTime(){
  
  //This goes to the firebase database, looks at the prayerTimes collection and at the Prayers document.
  const prayerRef = doc(db, "prayerTimes", "specialPrayerTime");
  const prayerSnap = await getDoc(prayerRef);
  let prayerHourData = prayerSnap.data(); //Gets the data from the prayer database


  var sortedData= Object.entries(prayerHourData).sort();

    try{
      const fieldCount = Object.keys(sortedData).length;//Gets the count of prayers in the database
        let data=Object.values(sortedData); //Isolates the data to the values
        let keys=[];
        let info=[];


      for(let i=0;i<fieldCount; i++){
          info[i]=data[i][1].toDate();
          keys[i]=sortedData[i][0]=data[i][0];
      }
       return([keys,info]);
    }catch (e) {
      console.log("error getting prayer Times"+e);
    }  
  }


async function createPrayerTime(prayerName, prayerNumber, prayerTimes){
  let prayerTime,sPrayerName;
  let firebaseTimeStamp;
  let currentDate=new Date();

  if(prayerNumber>5){
    let prayerTemp=prayerNumber-5;
    prayerTime=document.getElementById(`sPrayerTime${prayerTemp}`).value;
    sPrayerName=document.getElementById(`sPrayerName${prayerTemp}`).value;
    let tempDate=new Date(prayerTime);
    firebaseTimeStamp=Timestamp.fromDate(tempDate);
    prayerTimes[sPrayerName] = firebaseTimeStamp;
  }else{
    prayerTime=document.getElementById(`prayerTime${prayerNumber}`).value;
    prayerTime=prayerTime.split(":");
    firebaseTimeStamp=Timestamp.fromDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), prayerTime[0], prayerTime[1],0));
    prayerTimes[prayerName] = firebaseTimeStamp;
  }
}

//Translating the prayer times to timestamps to put into database and then testing to push to the database.
//If there are time slots present but not filled, it will not push all of the data and alert the user.
//If it's a Jumu'ah prayer/speech it will translate the date value to timestamp to be stored.
  //Else, it will grab the system's current day, month, and year at the time of pressing save to fill in those data points for the timestamp.

  async function savePrayerTime(prayerAmount){
    //This goes to the firebase database, looks at the prayerTimes collection and at the Prayers document.
    const prayerRef = doc(db, "prayerTimes", "prayerTime");
    const prayerSnap = await getDoc(prayerRef);

    let prayerTimes={};
  
    for(let i=1; i<=prayerAmount;i++){ //Grabs the time slot's id number, associate it with a prayer name, grab that time's data 
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
      }
    }
  
    try{
      setDoc(prayerRef, prayerTimes);
      var popup=document.getElementById("popupItem");
      popup.classList.toggle("show");
      //Times popout out after 3 seconds
      setTimeout(() => {
        popup.style.display = "none";
      }, 3000);
    }catch(e){
      console.log("Error saving prayer times.",e);
      alert("All prayer hours must be submitted to update the prayer hours.");
    }
  }

  async function saveSPrayerTime(prayerAmount){
    //This goes to the firebase database, looks at the prayerTimes collection and at the Prayers document.
    const prayerSRef = doc(db, "prayerTimes", "specialPrayerTime");
    const prayerSnap = await getDoc(prayerSRef);
  
    let sPrayerTimes={};
  
    for(let i=6; i<=prayerAmount;i++){ //Grabs the time slot's id number, associate it with a prayer name, grab that time's data 
      createPrayerTime("",i,sPrayerTimes);
    }  
    try{
      setDoc(prayerSRef, sPrayerTimes);
    }catch(e){
      console.log("Error saving prayer times.",e);
      alert("All prayer hours must be submitted to update the prayer hours.");
    }
  }

//prayer time to auto get the current date on the system
function getDate() {
  var date = new Date();
  var day = date.getDate();
  var dayOfWeek = date.getDate() % 7;
  var month = date.getMonth() % 12;
  var year = date.getFullYear();

  const dayNames = ["Monday", "Tuesday", "Wednesday",
    "Thursday", "Friday", "Saturday", "Sunday"];
  const monthNames = ["January", "February", "March",
    "April", "May", "June", "July", "August", "September",
    "October", "November", "December"]

  const nth = (day) => {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
      case 1: return "st";
      case 2: return "nd";
      case 3: return "rd";
      default: return "th";
    }
  };


  document.getElementById("date").innerText = `${dayNames[dayOfWeek]}, ${monthNames[month]} ${day}${nth(day)} ${year}`;

}
getDate();
window.addAnnouncement = addAnnouncement;

async function addAnnouncement(){
  const announcementRef = doc(db, "announcements", "announcement");
  const announcementText = document.getElementById("announcementText").value;
  getDoc(announcementRef).then((docSnap) => {
    if (docSnap.exists()) {
      const existingAnnouncements = docSnap.data().text || [];
      updateDoc(announcementRef, { text: [...existingAnnouncements, announcementText] });
    } else {
      setDoc(announcementRef, { text: [announcementText] });
    }
    alert("Announcement posted");
    announcementPanes(5);
  }).catch((error) => {
    console.error("Error adding announcement:", error);
  });
}

async function getAnnouncements(){
  const announcementRef = doc(db, "announcements", "announcement");
  const announcementSnap = await getDoc(announcementRef);
  const announcements = announcementSnap.data().text;
  const announcementRow = document.getElementById("announcementRow");
  console.log(announcementRow);
  announcementRow.innerHTML = ''; // Clear existing announcements

  announcements.forEach(announcement => {
    const announcementDiv = document.createElement("div");
    announcementDiv.className = "announcement";
    announcementDiv.textContent = announcement;
    announcementRow.appendChild(announcementDiv);
  });
  return announcements;
}


window.addQuotes = addQuotes;
async function addQuotes(){
  const quoteRef = doc(db, "quotes", "quote");
  const quoteText = document.getElementById("quoteText").value;
  setDoc(quoteRef, { text: quoteText }).then(() => {
    alert("Quote posted");
    quotePanes(1);
  }).catch((error) => {
    console.error("Error adding quote:", error);
  });
}

async function announcementPanes(announcement_panes) {
  const announcementGrid = document.getElementById("announcementRow");
  $(announcementGrid).empty();
  let announcements = (await getAnnouncements());
  for (let j = 0; j < announcements.length; j++) {
      // Create announcement box
      const announcement = document.createElement("div");
      announcement.classList.add("announcement");
      // Create inner box for content
      const boxInBox = document.createElement("div");
      boxInBox.classList.add("inner-box");
      boxInBox.style.width = "100%";
      boxInBox.textContent = announcements[j];
      const announcementRef = doc(db, "announcements", "announcement");

      // creating a delete buutton
      let deleteButton = $(`<button class="deleteAnnouncementBtn" style="margin-left: 10px" type="button"><i class="fa fa-close" style="font-size:48px;color:red"></i></button>`);
      deleteButton.on('click', function(){
        getDoc(announcementRef).then((docSnap) => {
          if (docSnap.exists()) {
            const existingAnnouncements = docSnap.data().text || [];
            const indexInAnnouncements = existingAnnouncements.indexOf(announcements[j]);
            existingAnnouncements.splice(indexInAnnouncements, 1); // Removes 1 element at index 2
            updateDoc(announcementRef, { text: [...existingAnnouncements] });
            announcementPanes()
            alert("Announcement deleted");
          } else {
            setDoc(announcementRef, { text: [announcementText] });
          }
        }).catch((error) => {
          console.error("Error removing announcement:", error);
        });
      });

      $(boxInBox).append(deleteButton);
      announcement.appendChild(boxInBox);

      // Append announcement to grid
      announcementGrid.appendChild(announcement);
  }
}

/*
//announcment box auto makes the boxes
async function quotePanes(quote_panes) {
  const quoteGrid = document.getElementById("quoteRow");
  $(quoteGrid).empty();
  let quote = (await getDoc(doc(db, "quotes", "quote"))).data().text;
  // Create quote box
  const quoteBox = document.createElement("div");
  quoteBox.classList.add("quote");

  // Create inner box for content
  const boxInBox = document.createElement("div");
  boxInBox.classList.add("inner-box");
  boxInBox.textContent = quote; 
  quoteBox.appendChild(boxInBox);

  // Append quote to grid
  quoteGrid.appendChild(quoteBox);
}
*/
async function getQuote(){
  const quoteRef = doc(db, "quotes", "quote");
  const quoteSnap = await getDoc(quoteRef);
  if (quoteSnap.exists()) {
    const quoteData = quoteSnap.data();
    document.getElementById("quoteText").value = quoteData.text;
  } else {
    console.log("No such document!");
  }

}





document.addEventListener("DOMContentLoaded", function() {
  loadCurrentPrayerTimes();
  getQuote();
  announcementPanes(5);
  //quotePanes(1);
});