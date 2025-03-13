document.addEventListener("DOMContentLoaded", () => {
  checkAuth();
});
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

