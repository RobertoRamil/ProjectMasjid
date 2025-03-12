// Start: Redirect to login page if the user is not authenticated
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, onAuthStateChanged} from 'https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js';

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
initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth();

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





//Prayer List
let sPrayerCounter = 1;
//This is for generating the special prayer times and name
document.getElementById("addSPrayerRow").addEventListener("click", function () {
  const rowsContainer = document.getElementById("rows-container");

  // Create a new row
  const newRow = document.createElement("form");
  newRow.id = `sPrayerRow${sPrayerCounter}`; // Assign a unique ID to the row

  // Create input for prayer name
  var prayerTypes = ["Jumu'ah (Speech)", "Jumu'ah (Prayer)"];
  const sPrayerNameInput = document.createElement("select");
  for (let i = 0; i < prayerTypes.length; i++) {
    sPrayerNameInput.appendChild(new Option(prayerTypes[i]));
  }
  sPrayerNameInput.className = "specialPrayerTime";
  sPrayerNameInput.id = `sPrayerName${sPrayerCounter}`;


  // Create input for prayer time
  const sPrayerTimeInput = document.createElement("input");
  sPrayerTimeInput.type = "time";
  sPrayerTimeInput.placeholder = "Prayer Time";
  sPrayerTimeInput.className = "time";
  sPrayerNameInput.id = `sPrayerName${sPrayerCounter}`; // Unique ID for the prayer name input

  // Wrap the time input in a span for styling consistency
  const timeSpan = document.createElement("span");
  timeSpan.appendChild(sPrayerTimeInput);

  // Append inputs to the new row
  newRow.appendChild(sPrayerNameInput);
  newRow.appendChild(timeSpan);

  // Append the row to the rows container
  rowsContainer.appendChild(newRow);

  sPrayerCounter++;
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

async function announcementPanes(announcement_panes) {
  const announcementGrid = document.getElementById("announcementRow");
  $(announcementGrid).empty();
  let announcements = (await getAnnouncements()).text;
  for (let j = 0; j < announcements.length; j++) {
    console.error(announcements[j]);
      // Create announcement box
      const announcement = document.createElement("div");
      announcement.classList.add("announcement");

      // Create inner box for content
      const boxInBox = document.createElement("div");
      boxInBox.classList.add("inner-box");
      boxInBox.textContent = announcements[j]; 
      announcement.appendChild(boxInBox);

      // Append announcement to grid
      announcementGrid.appendChild(announcement);
  }
}
announcementPanes(5);
window.announcementPanes = announcementPanes;
//announcment box auto makes the boxes
async function quotePanes(quote_panes) {
  const quoteGrid = document.getElementById("quoteRow");
  $(quoteGrid).empty();
  let quotes = (await getQuotes()).text;
  for (let j = 0; j < quotes.length; j++) {
      // Create quote box
      const quote = document.createElement("div");
      quote.classList.add("quote");

      // Create inner box for content
      const boxInBox = document.createElement("div");
      boxInBox.classList.add("inner-box");
      console.error(quotes[j]);
      boxInBox.textContent = quotes[j]; 
      quote.appendChild(boxInBox);

      // Append quote to grid
      quoteGrid.appendChild(quote);
  }
}
quotePanes(1);
window.quotePanes = quotePanes;