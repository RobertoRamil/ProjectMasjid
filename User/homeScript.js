import { pullPrayerTime } from './firebase.js';

function prayerBoxEmotes(){
    //Grabs all of the prayer time hours based on the class name
    let prayerHour=document.getElementsByClassName("prayerHour");
    let specialPrayerHour=document.getElementsByClassName("specialPrayerHour");

    //Checks if multiple elements are in the class. Then splits the time to only grab the hour to compare and use the emote
    if(prayerHour.length>0){
        for(i=0; i<prayerHour.length; i++){
            const splitTxt=prayerHour[i].innerText;
            var hour=splitTxt.split(":")[0];
            
            //This is for if we are sticking to am and pm where it adds 12 hours to signify pms for easier comparisons.
            var timeOfDay=splitTxt.includes("pm");
            if(timeOfDay){
                hour=Number(hour)+12;  
            }
            
            var emote=emoteHour(hour);

            //This keeps the text to only have one emoji
            let prayerName=document.getElementsByClassName("prayerName");
            let temp=prayerName[i].innerText.split(")")[0];
            
            prayerName[i].innerText=temp+")"+String.fromCodePoint(emote);
        }
    }

    //Takes the home page's prayer name and hour. Splits the name to ensure only one emote is seen with each interval at the end of the Jumu'ah(Speech/Prayer)
    //It takes the prayer time and splits the hour seen to check if it's day or night time.
    if(specialPrayerHour.length>0){
        for(i=0; i<specialPrayerHour.length; i++){
            var splitSpecialTxt=specialPrayerHour[i].innerText.split(" ")[2];
            var hour=splitSpecialTxt.split(":")[0];

            //This is for if we are sticking to am and pm where it adds 12 hours to signify pms for easier comparisons.
            var timeOfDay=splitSpecialTxt.includes("pm");
            if(timeOfDay){
                hour=Number(hour)+12;  
            }

            var emote=emoteHour(hour);
            
            let specialPrayerName=document.getElementsByClassName("specialPrayerName");
            splitSpecialTxt=specialPrayerName[i].innerText.split(")")[0];
            
            specialPrayerName[i].innerText=splitSpecialTxt+")"+String.fromCodePoint(emote);

        }
    } 
}

//It will return the UTF-8 emote value depending on the hour.
function emoteHour(hour){
    hour=Number(hour);

        //Sunrise
        if(hour>=6 && hour<8){
            return("0x1F305");
        }
        //Midday
        else if(hour>=12 && hour<15){
            return("0x26C5");
        
        }        
        //Afternoon
        else if(hour>=15 && hour<17){
            return("0x2600");
        }
        //Sundown
        else if(hour>=17 && hour<18){
            return("0x1F307");
        }
        //Night
        else if(hour>=18 && hour<20){
            return("0x1F303");
        }
        //If not within the times, use prayer emote
        return("0x1F64F");    
}    


//This will check for prayer time changes every hour (it goes based on milliseconds)
prayerBoxEmotes();
setInterval(prayerBoxEmotes, 3.6e+6);


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
let congregationAmount = 5;
let congregationNames = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];
let congregationTimes=[];

for(let i=0; i<congregationNames.length; i++){
    let timeTemp = await pullPrayerTime(congregationNames[i]);
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




