document.addEventListener("DOMContentLoaded", function(){
    console.log("Ready");
});
/*---------------Everything under here is used for the calender------------ */

const calendarGrid = document.getElementById("calendar-grid");
const monthYearLabel = document.getElementById("month-year");
let currentDate = new Date();

function renderCalendar(date) {
  const month = date.getMonth();
  const year = date.getFullYear();
  
  monthYearLabel.textContent = `${date.toLocaleString("default", { month: "long" })} ${year}`;
  
  // Get the first day of the month
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  
  const firstDayOfWeek = firstDayOfMonth.getDay(); // Day of the week (0 = Sunday, 6 = Saturday)
  const daysInMonth = lastDayOfMonth.getDate();
  
  // Get previous month's days if the first day of the current month is not Sunday
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
/*--------------------------- */

/*----Everything here is used for email and phone signup----*/
//IMPORTANT note, we need to make a function to connect to the database first (This should be done anyway to support calendar events)
function signUpEmail(){
  //This function needs to grab the input data from the textbox(the ID is email)
  //This function is triggered by an in site button press
}

function signUpPhone(){
  //This function needs to grab the input data from the textbox(the ID is phone)
  //This function is triggered by an in site button press
}
/*----------------------------------------------------------*/