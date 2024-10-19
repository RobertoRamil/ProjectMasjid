document.addEventListener("DOMContentLoaded", function(){
    console.log("Ready");
});

function showTab(tabName) {
    const contents = document.querySelectorAll('.tab-content');
    contents.forEach(content => {
        content.classList.remove('active');
    });
    const activeTab = document.getElementById(tabName);
    activeTab.classList.add('active');
}


function getDate(){
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
            case 1:  return "st";
            case 2:  return "nd";
            case 3:  return "rd";
            default: return "th";
        }
    };


    document.getElementById("date").innerText = `${dayNames[dayOfWeek]}, ${monthNames[month]} ${day}${nth(day)} ${year}`;
    
}
getDate();

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

//Adding arbitrary # of team members
function teamMems(num_mems){
  //const numMems = 7;
  const memberGrid = document.getElementById("membersBox");
  for(let i = 0; i < num_mems; i++){
    //Create the member object
    const member = document.createElement("div");
    member.classList.add("member");

    // Create an image
    var portrait = document.createElement("img");
    portrait.setAttribute("src", "https://tinyurl.com/2s3cwmnp");

    // Create a p for the member name
    var name = document.createElement("p");
    name.textContent = "*Member Name*"; // Set the text content to the name

    // Append portrait and name to the member div
    member.appendChild(portrait);
    member.appendChild(name);

    // Append the member div to the memberGrid
    memberGrid.appendChild(member);

  }
  
}

//initialize the member list
teamMems(12);