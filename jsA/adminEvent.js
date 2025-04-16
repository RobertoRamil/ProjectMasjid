// Start: Redirect to login page if the user is not authenticated
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, onAuthStateChanged} from 'https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js';
import { getStorage, ref, getDownloadURL, uploadBytes, listAll } from 'https://www.gstatic.com/firebasejs/11.0.1/firebase-storage.js';
import { getFirestore, collection, doc, setDoc, getDoc, deleteDoc, updateDoc, getDocs, arrayUnion } from 'https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js'


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
const db = getFirestore(app);
const storage = getStorage(app);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

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


//Newsletter
document.getElementById("newspaper_toggle").addEventListener("change", async () => {
  let toggle = document.getElementById('newspaper_toggle');
  let isChecked=toggle.checked;
  const checkboxRef = doc(db, "Toggles", "NewsLetter");
  try {
    await updateDoc(checkboxRef, {
      toggle: isChecked
    });
  } catch (e) {
    console.log(`Error saving ${checkName} toggle value.`, e);
  }  
});

async function initChecked(){
  const news = doc(db, "Toggles","NewsLetter");
  const newsSnap = await getDoc(news);

  const newsToggleValue=newsSnap.data().toggle;

  let newsCheck=document.getElementById("newspaper_toggle");

  newsCheck.checked=newsToggleValue;
  }



//Calendar functionality

let currentDate = new Date();
let monthEvents = []; // Stores events as [{date: "YYYY-MM-DD", data: {Event 1: "Time", Event 2: "Time"}}]

async function renderCalendar() {
  const calendar = document.getElementById('calendar');
  const eventsDiv = document.getElementById('events');
  
  // Save the current scroll position
  const scrollPosition = window.scrollY;

  calendar.innerHTML = '';
  const monthYear = document.getElementById('monthYear');
  const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

  monthYear.textContent = `${firstDay.toLocaleString('default', { month: 'long' })} ${currentDate.getFullYear()}`;

  // Fetch events for the current month
  const yearMonth = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-01`;
  monthEvents = await getEventsByMonth(yearMonth);

  eventsDiv.innerHTML = ''; // Clear previous events
  eventsDiv.style.textAlign = 'center'; // Center align the events

  // Fill Events Div
  if (monthEvents.length === 0) {
    eventsDiv.textContent = 'No events in month';
  } else {
    for (const eventObject of monthEvents) {
      const eventDate = document.createElement('div');
      eventDate.textContent = eventObject.date;
      eventDate.style.textDecoration = 'underline'; // Underline the date
      eventsDiv.appendChild(eventDate);

      // Separate AM and PM events
      const amEvents = [];
      const pmEvents = [];

      for (const [eventName, eventTime] of Object.entries(eventObject.data)) {
        if (eventTime.includes('AM')) {
          amEvents.push({ eventName, eventTime });
        } else {
          pmEvents.push({ eventName, eventTime });
        }
      }

      // Append AM events first
      amEvents.sort((a, b) => a.eventTime.localeCompare(b.eventTime));
      for (const event of amEvents) {
        const eventDetail = document.createElement('div');
        eventDetail.textContent = `${event.eventName} at ${event.eventTime}`;
        eventsDiv.appendChild(eventDetail);
      }

      // Append PM events next
      pmEvents.sort((a, b) => a.eventTime.localeCompare(b.eventTime));
      for (const event of pmEvents) {
        const eventDetail = document.createElement('div');
        eventDetail.textContent = `${event.eventName} at ${event.eventTime}`;
        eventsDiv.appendChild(eventDetail);
      }
    }
  }

  // Padding for days before the first day of the month
  for (let i = 0; i < firstDay.getDay(); i++) {
    calendar.innerHTML += `<div class="calendar-day empty"></div>`;
  }

  for (let day = 1; day <= lastDay.getDate(); day++) {
    const date = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const eventCount = getEventCountByDate(date);
    calendar.innerHTML += `
      <div class="calendar-day">
        <div>${day}</div>
        ${eventCount > 0 ? `<div class="event-circle">${eventCount}</div>` : ''}
      </div>
    `;
  }

  // Restore the scroll position
  window.scrollTo(0, scrollPosition);
}

export function prevMonth() {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar();
}

export function nextMonth() {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar();
}

async function getEventsByMonth(date) {
  const [year, month] = date.split('-');
  const events = [];
  try {
    const snapshot = await getDocs(collection(db, "calendarDates"));
    snapshot.forEach(doc => {
      const docDate = doc.id.split('-');
      if (docDate[0] === year && docDate[1] === month) {
        events.push({ date: doc.id, data: doc.data() });
      }
    });
    return events;
  } catch (error) {
    console.error("Error fetching events by month:", error);
    return [];
  }
}
async function addEventToFirebase(eventDate, eventName, eventTime) {
  const eventRef = doc(db, "calendarDates", eventDate);
  const eventSnap = await getDoc(eventRef);

  if (eventSnap.exists()) {
    const eventData = eventSnap.data();
    if (eventData[eventName]) {
      alert("ERROR: An event with the same name already exists for this date.");
    } else {
      // Document exists, update the existing document
      await updateDoc(eventRef, {
        [eventName]: eventTime
      });
    }
  } else {
    // Document does not exist, create a new document
    await setDoc(eventRef, {
      [eventName]: eventTime
    });
  }
}

async function deleteEventFromFirebase(eventDate, eventName) {
  const eventRef = doc(db, "calendarDates", eventDate);
  const eventSnap = await getDoc(eventRef);

  if (eventSnap.exists()) {
    const eventData = eventSnap.data();
    if (eventData[eventName]) {
      const updatedData = { ...eventData };
      delete updatedData[eventName];

      if (Object.keys(updatedData).length === 0) {
        await deleteDoc(eventRef);
      } else {
        await setDoc(eventRef, updatedData);
      }
    } else {
      alert("ERROR: No event with the given name exists for this date.");
    }
  } else {
    alert("ERROR: No events found for the given date.");
  }
}

function getEventCountByDate(date) {
  const eventObject = monthEvents.find(event => event.date === date);
  if (eventObject) {
    //console.log(Object.keys(eventObject.data).length)
    return Object.keys(eventObject.data).length;
  }
  return 0;
}

export async function addEvent() {
  const eventDate = document.getElementById('event-date-input').value;
  const eventName = document.getElementById('event-name-input').value.trim();
  let eventTime = document.getElementById('event-time-input').value;
  const [hours, minutes] = eventTime.split(':');
  const period = hours >= 12 ? 'PM' : 'AM';
  const adjustedHours = hours % 12 || 12;
  eventTime = `${adjustedHours}:${minutes} ${period}`;

  console.log(eventTime);
  if (eventDate && eventName && eventTime) {
    try {
      await addEventToFirebase(eventDate, eventName, eventTime);
      renderCalendar(); // Re-render the calendar to show the new event
    } catch (error) {
      console.error('Error adding event:', error);
      alert('Failed to add event. Please try again.');
    }
  } else {
    alert('Please fill in all fields.');
  }
  document.getElementById('event-date-input').value = '';
  document.getElementById('event-name-input').value = '';
  document.getElementById('event-time-input').value = '';
}

export async function deleteEvent() {
  const eventDate = document.getElementById('event-date-delete').value;
  const eventName = document.getElementById('event-name-delete').value;
  if (eventDate && eventName) {
    try {
      await deleteEventFromFirebase(eventDate, eventName);
      renderCalendar(); // Re-render the calendar to reflect the deleted event
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Failed to delete event. Please try again.');
    }
  } else {
    alert('Event date and name are required to delete an event.');
  }
  document.getElementById('event-date-delete').value = '';
  document.getElementById('event-name-delete').value = '';
}

export async function sendPinpointEmail() {
  console.log("Sending Email");
  const messageContent = document.getElementById("pinpoint_box").value;

  // Directly define getEmailsList logic here
  const contactsRef = doc(db, "users", "userContacts");

  async function getEmailsListLocal() {
    const emailSnap = await getDoc(contactsRef);
    const emails = [];
    if (emailSnap.exists()) {
      const emailData = emailSnap.data();
      if (emailData.emails) {
        emailData.emails.forEach((email) => {
          emails.push(email);
        });
      }
    }
    return emails;
  }

  try {
    const emailAddresses = await getEmailsListLocal();

    if (!emailAddresses.length) {
      console.log("No email addresses found.");
      return;
    }

    for (const emailAddress of emailAddresses) {
      const emailPayload = {
        to: emailAddress,
        subject: "Email from Admin Panel",
        message: messageContent
      };

      const response = await fetch("/api/sendEmail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(emailPayload)
      });

      const responseText = await response.text();
      try {
        const result = JSON.parse(responseText);
        console.log(`Email sent to ${emailAddress}:`, result);
      } catch (jsonError) {
        console.error(`Failed to parse JSON for ${emailAddress}. Raw response:`, responseText);
      }
    }
  } catch (error) {
    console.error("Error sending emails:", error);
  }
}

export async function sendPinpointSMS() {
  console.log("Sending SMS");
  const messageContent = document.getElementById("pinpoint_box").value;

  // Directly define getPhoneList logic here
  const contactsRef = doc(db, "users", "userContacts");
  
  async function getPhoneListLocal() {
    const phoneSnap = await getDoc(contactsRef);
    const phones = [];
    if (phoneSnap.exists()) {
      const phoneData = phoneSnap.data();
      if (phoneData.phoneNums) {
        phoneData.phoneNums.forEach((phone) => {
          phones.push(phone);
        });
      }
    }
    return phones;
  }

  try {
    const phoneNumbers = await getPhoneListLocal();

    if (!phoneNumbers.length) {
      console.log("No phone numbers found.");
      return;
    }

    for (const phoneNumber of phoneNumbers) {
      const smsPayload = {
        to: phoneNumber,
        message: messageContent
      };

      const response = await fetch("/api/sendSMS", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(smsPayload)
      });

      const result = await response.json();
      console.log(`SMS sent to ${phoneNumber}:`, result);
    }
  } catch (error) {
    console.error("Error sending SMS:", error);
  }
}

// Ensure these functions are accessible globally
window.sendPinpointEmail = sendPinpointEmail;
window.sendPinpointSMS = sendPinpointSMS;
window.nextMonth = nextMonth;
window.prevMonth = prevMonth;
window.addEvent = addEvent;
window.deleteEvent = deleteEvent;
renderCalendar();


document.addEventListener("DOMContentLoaded", function() {
  initChecked();
});



