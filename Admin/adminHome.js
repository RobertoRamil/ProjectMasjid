(function(){
    var darkOn=localStorage.getItem("darkCookie");
    var element=document.body;

    if(darkOn==="true"){
        element.classList.toggle("dark-mode");
    }

  })();

function darkSwitch() {
    var element = document.body;
    var switchDark=element.classList.toggle("dark-mode");
    document.cookie="darkCookie="+switchDark;
    localStorage.setItem("darkCookie", switchDark);
  }

$(document).ready(function() {

    // Handle form submission for social media links
    $('#socialLinksForm').on('submit', function(event) {
        event.preventDefault();  

        // Get values from input fields
        const facebookLink = $('#facebookLink').val().trim();
        const instagramLink = $('#instagramLink').val().trim();

        // Check if at least one link is provided
        if (!facebookLink && !instagramLink) {
            alert('Please enter at least one social media link.');
            return; 
        }

        // Placeholder for Firebase 
        const updates = {};
        if (facebookLink) updates.facebook = facebookLink;
        if (instagramLink) updates.instagram = instagramLink;

        // Temporary alert as a placeholder
        alert(`Updates:\n${facebookLink ? "Facebook: " + facebookLink : ""}\n${instagramLink ? "Instagram: " + instagramLink : ""}`);
    });
});
let sPrayerCounter = 1; 

document.getElementById("addSPrayerRow").addEventListener("click", function () {
    const rowsContainer = document.getElementById("rows-container");



    // Create a new row
    const newRow = document.createElement("p");
    newRow.id = `sPrayerRow${sPrayerCounter}`; // Assign a unique ID to the row

    // Create input for prayer name
    const sPrayerNameInput = document.createElement("input");
    sPrayerNameInput.type = "text";
    sPrayerNameInput.placeholder = "Prayer Name";
    sPrayerNameInput.className = "prayer";
    sPrayerNameInput.id = `sPrayerName${sPrayerCounter}`; 

    // Create input for prayer time
    const sPrayerTimeInput = document.createElement("input");
    sPrayerTimeInput.type = "text";
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
