//Connect to Firebase
//import { arrayUnion } from "firebase/firestore";
//const {arrayUnion, doc, updateDoc} = require("firebase/firestore");
//Continue

const calendarGrid = document.getElementById("calendar-grid");
const monthYearLabel = document.getElementById("month-year");
let currentDate = new Date();

// Sample events data
const events = [
  { date: "2024-10-31", keyword: "Halloween", details: "Costume Party at 8 PM" },
  { date: "2024-11-11", keyword: "Veteran's Day", details: "Ceremony at 10 AM" },
  { date: "2024-04-22", keyword: "Eid", details: "Family Gathering" }
];

function renderCalendar(date) {
  const month = date.getMonth();
  const year = date.getFullYear();
  
  monthYearLabel.textContent = `${date.toLocaleString("default", { month: "long" })} ${year}`;
  
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const firstDayOfWeek = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();
  const prevMonthLastDay = new Date(year, month, 0).getDate();
  
  calendarGrid.innerHTML = ''; // Clear previous calendar

  // Fill the days from the previous month
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const day = document.createElement("div");
      day.classList.add("calendar-day", "other-month");
      day.textContent = prevMonthLastDay - i;
      calendarGrid.appendChild(day);
  }

  // Fill the current month
  for (let i = 1; i <= daysInMonth; i++) {
      const day = document.createElement("div");
      day.classList.add("calendar-day");
      day.textContent = i;

      // Event container
      const eventContainer = document.createElement("div");
      eventContainer.classList.add("event-container");

      // Find events for this date
      const eventDate = `${year}-${String(month + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`;
      events.forEach(event => {
          if (event.date === eventDate) {
              const keyword = document.createElement("span");
              keyword.classList.add("event-keyword");
              keyword.textContent = event.keyword;
              
              // Initially hidden details container
              const details = document.createElement("div");
              details.classList.add("event-details");
              details.textContent = event.details;
              details.style.display = "none"; // Hide initially
              keyword.appendChild(details);

              eventContainer.appendChild(keyword);
          }
      });

      day.appendChild(eventContainer);
      calendarGrid.appendChild(day);
  }

  // Fill the next month's days to complete the last row if needed
  const totalDays = firstDayOfWeek + daysInMonth;
  for (let i = 1; i <= (7 - (totalDays % 7)) % 7; i++) {
      const day = document.createElement("div");
      day.classList.add("calendar-day", "other-month");
      day.textContent = i;
      calendarGrid.appendChild(day);
  }
}

// Event delegation to toggle event details visibility
calendarGrid.addEventListener("click", (event) => {
  if (event.target.classList.contains("event-keyword")) {
      const details = event.target.querySelector(".event-details");
      if (details) {
          details.style.display = details.style.display === "none" ? "block" : "none";
      }
  }
});

document.getElementById("prev-month").addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar(currentDate);
});

document.getElementById("next-month").addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar(currentDate);
});

// Initialize the calendar on page load
renderCalendar(currentDate);

function eventList(events){
  numEvents = events.length
  const eventGrid = document.getElementById("eventBox");
  for(let i = 0; i < numEvents; i++){
    const eventObj = document.createElement("div");
    eventObj.classList.add("eventItem");
    var eventcontent = document.createElement("eventItemBox");
    eventcontent.textContent= "item"; 
    eventObj.appendChild(eventcontent);
    eventGrid.appendChild(eventItem);
  }
}
eventList(events);

/*----Everything here is used for email and phone signup----*/
//IMPORTANT note, we need to make a function to connect to the database first (This should be done anyway to support calendar events)
function signUpEmail(){
  const userEmail = document.getElementById("emailField").value;
  var emailRegex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  if(emailRegex.test(userEmail)){
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
  if(phoneRegex.test(userPhone)){
    alert("You have joined the newsletter!");
    updateDoc(contactsRef, {phoneNums: arrayUnion(userPhone)})
  }
  else{
    alert("Invalid Phone number");
  }
  
  //This function needs to grab the input data from the textbox(the ID is phone)
  //This function is triggered by an in site button press
}