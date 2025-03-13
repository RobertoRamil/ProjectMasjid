//Connect to Firebase
//import { arrayUnion } from "firebase/firestore";
//const {arrayUnion, doc, updateDoc} = require("firebase/firestore");
//Continue

let currentDate = new Date();
let monthEvents = []; // Stores events as [{date: "YYYY-MM-DD", data: {Event 1: "Time", Event 2: "Time"}}]

async function renderCalendar() {
  const calendar = document.getElementById('calendar');
  calendar.innerHTML = '';
  const monthYear = document.getElementById('monthYear');
  const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

  monthYear.textContent = `${firstDay.toLocaleString('default', { month: 'long' })} ${currentDate.getFullYear()}`;

  // Fetch events for the current month
  const yearMonth = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-01`;
  monthEvents = await getEventsByMonth(yearMonth);
  
  //console.log('Events for the month:', monthEvents);

  //console.log(monthEvents[0].data["Event 1"]);
  
  const eventsDiv = document.getElementById('events');
  eventsDiv.innerHTML = ''; // Clear previous events
  eventsDiv.style.textAlign = 'center'; // Center align the events

  //Fill Events Div
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
      // Sort AM events alphabetically by eventTime
      amEvents.sort((a, b) => a.eventTime.localeCompare(b.eventTime));
      for (const event of amEvents) {
        const eventDetail = document.createElement('div');
        eventDetail.textContent = `${event.eventName} at ${event.eventTime}`;
        eventsDiv.appendChild(eventDetail);
      }

      // Append PM events next
      // Sort PM events alphabetically by eventTime
      pmEvents.sort((a, b) => a.eventTime.localeCompare(b.eventTime));
      for (const event of pmEvents) {
        const eventDetail = document.createElement('div');
        eventDetail.textContent = `${event.eventName} at ${event.eventTime}`;
        eventsDiv.appendChild(eventDetail);
      }
    }
  }
  console.log(monthEvents);
  getEventCountByDate("2025-03-07");

  // Padding for days before the first day of the month
  for (let i = 0; i < firstDay.getDay(); i++) {
    calendar.innerHTML += `<div class="calendar-day empty"></div>`;
  }

  for (let day = 1; day <= lastDay.getDate(); day++) {
    const date = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const eventCount = getEventCountByDate(date);
    calendar.innerHTML += `
      <div class="calendar-day" onclick="fetchAndPrintEvents('${date}')">
        <div>${day}</div>
        ${eventCount > 0 ? `<div class="event-circle">${eventCount}</div>` : ''}
      </div>
    `;
  }
}

function prevMonth() {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar();
}

function nextMonth() {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar();
}

async function fetchAndPrintEvents(date) {
  try {
    const result = await getEventsByDate(date);
    if (result != null ) {
      console.log(`Events for ${date}:`, result);
    }
  } catch (error) {
    console.error(`Error fetching events for ${date}:`, error);
  }
}

function getEventCountByDate(date) {
  const eventObject = monthEvents.find(event => event.date === date);
  if (eventObject) {
    console.log(Object.keys(eventObject.data).length)
    return Object.keys(eventObject.data).length;
  }
  return 0;
}

renderCalendar();

/*----Everything here is used for email and phone signup----*/
//IMPORTANT note, we need to make a function to connect to the database first (This should be done anyway to support calendar events)
