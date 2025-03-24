document.addEventListener('DOMContentLoaded', function() {
  console.log("DOMContentLoaded event triggered"); // Debugging line
  pullPrayerTime();
  pullSPrayerTime();
  fetchCarouselImages();
});
//announcment box auto makes the boxes
function quotePanes(announcement_panes) {
    const announcementGrid = document.getElementById("quoteRow");
    for (let j = 0; j < announcement_panes; j++) {
        // Create announcement box
        const announcement = document.createElement("div");
        announcement.classList.add("announcement");

        // Create inner box for content
        const boxInBox = document.createElement("div");
        boxInBox.classList.add("inner-box");
        boxInBox.textContent = "*Quote details go here*"; 
        announcement.appendChild(boxInBox);

        // Append announcement to grid
        announcementGrid.appendChild(announcement);
    }
}
quotePanes(1);

function map(URL){
    //If there is already a map embed, this gets rid of it
    const existingIframe = document.querySelector("iframe");
    existingIframe.src=URL;
}

//This grabs any space from the user input and replaces it with '+' to fit the URL google map uses for locations
function convertSpace(event){
    event.preventDefault();
    let converted= document.getElementById("Location").value.replaceAll(" ","+");
    let websiteURL=("https://www.google.com/maps?q="+converted+"&output=embed");
    map(websiteURL);
}    

//announcment box auto makes the boxes
function announcementPanes(announcement_panes) {
    const announcementGrid = document.getElementById("announcementRow");
    for (let j = 0; j < announcement_panes; j++) {
        // Create announcement box
        const announcement = document.createElement("div");
        announcement.classList.add("announcement");

        // Create inner box for content
        const boxInBox = document.createElement("div");
        boxInBox.classList.add("inner-box");
        boxInBox.textContent = "*Announcement details go here*"; 
        announcement.appendChild(boxInBox);

        // Append announcement to grid
        announcementGrid.appendChild(announcement);
    }
}
  announcementPanes(5);

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

// Alternative function for generating prayer boxes using prayerAmount
async function loadPrayerTimes(){
    let congregationAmount = 5;
    const congregationNames = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];
    let congregationTimes=[];

    for(let i=0; i<congregationNames.length; i++){
        let timeTemp =await pullPrayerTime(congregationNames[i]);
        congregationTimes[i] = timeTemp.toLocaleTimeString("en-US", {hour: 'numeric', minute: '2-digit'});   
    }

    let container = document.querySelector(".container"); // Selects the container div
    for (let i = 0; i < congregationAmount; i++) {
        let box = document.createElement("div"); // Create the outer box
        box.classList.add("prayerBox");

        let prayerName = document.createElement("div"); // Prayer name div
        prayerName.classList.add("prayer-name");
        prayerName.textContent = congregationNames[i];

        let prayerTime = document.createElement("div"); // Prayer time div
        prayerTime.classList.add("prayer-time");
        prayerTime.textContent = congregationTimes[i];

        // Append name and time inside the box
        box.appendChild(prayerName);
        box.appendChild(prayerTime);

        // Append box to the container
        container.appendChild(box);
    }

    //This creates a break between normal prayers and special prayers.
    let prayerBox = document.querySelector("#prayerBox");
    prayerBox.appendChild(document.createElement("hr"));
    prayerBox.appendChild(document.createElement("br"));

    let specialPrayers =await pullSPrayerTime();
    let specialSize=specialPrayers[0].length;

    let sContainer = document.createElement("div"); // Selects the special prayercontainer div

    sContainer.classList.add("container");

    for(let i=0; i<specialSize;i++){
        let sBox = document.createElement("div"); // Create the outer box
        sBox.classList.add("prayerBox");

        let prayerName = document.createElement("div"); // Prayer name div
        prayerName.classList.add("prayer-name");
        prayerName.textContent = specialPrayers[0][i];

        let prayerTime = document.createElement("div"); // Prayer time div
        prayerTime.classList.add("prayer-time");
        prayerTime.textContent = specialPrayers[1][i].toLocaleTimeString("en-US", {year:'numeric',month:'long',day:'numeric',hour: 'numeric', minute: '2-digit'});

        // Append name and time inside the box
        sBox.appendChild(prayerName);
        sBox.appendChild(prayerTime);

        // Append box to the container
        sContainer.appendChild(sBox);
    }
    prayerBox.appendChild(sContainer);

}

document.addEventListener("DOMContentLoaded", function() {
    loadPrayerTimes();
  });