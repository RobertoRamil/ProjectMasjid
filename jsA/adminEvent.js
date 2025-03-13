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
    // User is signed in, you can get the user ID if needed
  }
});
// End: Redirect to login page if the user is not authenticated





let currentDate = new Date();
let events = {}; // Stores events as { "yyyy-mm-dd": ["Event 1", "Event 2"] }

function renderCalendar() {
  const calendar = document.getElementById('calendar');
  calendar.innerHTML = '';
  const monthYear = document.getElementById('monthYear');
  const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

  monthYear.textContent = `${firstDay.toLocaleString('default', { month: 'long' })} ${currentDate.getFullYear()}`;

  // Padding for days before the first day of the month
  for (let i = 0; i < firstDay.getDay(); i++) {
    calendar.innerHTML += `<div class="calendar-day empty"></div>`;
  }

  for (let day = 1; day <= lastDay.getDate(); day++) {
    const date = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const eventList = events[date] || [];
    calendar.innerHTML += `
      <div class="calendar-day" onclick="openPopup('${date}')">
        <div>${day}</div>
        ${eventList.length ? `<div class="event-circle">${eventList.length}</div>` : ''}
      </div>
    `;
  }
}

function openPopup(date) {
  document.getElementById('selectedDate').textContent = `Events on ${date}`;
  document.getElementById('eventInput').value = '';
  document.getElementById('eventPopup').style.display = 'block';
  document.getElementById('overlay').style.display = 'block';

  const eventList = document.getElementById('eventList');
  eventList.innerHTML = '';
  (events[date] || []).forEach((event, index) => {
    eventList.innerHTML += `
      <div class="event">
        <span>${event}</span>
        <button onclick="editEvent('${date}', ${index})">Edit</button>
        <button onclick="deleteEvent('${date}', ${index})">Delete</button>
      </div>
    `;
  });
}

function closePopup() {
  document.getElementById('eventPopup').style.display = 'none';
  document.getElementById('overlay').style.display = 'none';
}

function addEvent() {
  const date = document.getElementById('selectedDate').textContent.split(' ')[2];
  const eventInput = document.getElementById('eventInput');
  const eventText = eventInput.value.trim();
  if (!eventText) return;

  if (!events[date]) events[date] = [];
  events[date].push(eventText);
  eventInput.value = '';
  renderCalendar();
  openPopup(date); // Refresh popup
}

function editEvent(date, index) {
  const newEvent = prompt("Edit the event:", events[date][index]);
  if (newEvent !== null) {
    events[date][index] = newEvent.trim();
    renderCalendar();
    openPopup(date);
  }
}

function deleteEvent(date, index) {
    events[date].splice(index, 1);
    if (events[date].length === 0) delete events[date];
    renderCalendar();
    openPopup(date);
  
}

function prevMonth() {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar();
}

function nextMonth() {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar();
}

renderCalendar();
