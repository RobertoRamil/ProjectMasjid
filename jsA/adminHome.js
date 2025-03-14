// Start: Redirect to login page if the user is not authenticated
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, onAuthStateChanged} from 'https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js';
import { getStorage, ref, listAll, getDownloadURL, uploadBytes, deleteObject } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-storage.js";

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

// Check if the user is authenticated
onAuthStateChanged(auth, (user) => {
  if (!user) {
    // User is not signed in, redirect to login page
    window.location.href = "adminLogin.html";
    console.log("Page restricted until signed in");
  } else {

  }
});
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
    if (slideshowPreview.children.length >= 5) {
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
  alert("Prayer Time submitted");

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
      newRow.appendChild(sPrayerLabel);
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
document.addEventListener("DOMContentLoaded", function() {
  loadCurrentPrayerTimes();
  });


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

