// Initialize Firebase

document.addEventListener('DOMContentLoaded', function() {
  console.log("DOMContentLoaded event triggered"); // Debugging line
  fetchLogo();
  setHeaderBackground();
  setPageBackground();
  backgroundHourChange();
  setInterval(backgroundHourChange, 3.6e+6);
});

async function backgroundHourChange(){
  prayerNames=["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];
  prayerTimes=[];
  for(let i=0; i<prayerNames.length; i++){
    prayerTimes[i]=await pullPrayerTime(prayerNames[i]);
    prayerTimes[i] = prayerTimes[i].toLocaleTimeString("en-US", {hour12:false,hour: "2-digit", minute: "2-digit"});   
  }
  
  /*The prayer times are pulled. but the filters need to be changed to fit the prayer times. Basically 
  the background color will change by comparing the system's time to what is the closest prayer time.
  The way to do this is comparing the dates in the prayerTimes and SprayerTimes array to the system time.
  */
  const filter=document.getElementById("filter");
  const headerFilter=document.querySelector('.header');

  //Grabbing the system times to compare them to find out if its night, afternoon, or sunrise/sundown
    var systemTime=new Date();
    var hour=systemTime.toLocaleTimeString("en-US", {hour12:false,hour: "2-digit", minute: "2-digit"});   
    //Change the background colors on the filter div that rests behind all objects but on top of the background image
 
    if (hour > prayerTimes[4]) { // Fajr
      filter.style.backgroundColor = "rgba(0, 0, 0, 0.25)";
      headerFilter.style.filter = "brightness(0.75)"; // Darken header
    }
    else if (hour > prayerTimes[0] && hour <= prayerTimes[1]) { // Dhuhr
      filter.style.backgroundColor = "rgba(0, 0, 0, 0.1)";
      headerFilter.style.filter = "brightness(1.0)"; // Normal brightness
    }
    else if (hour > prayerTimes[1] && hour <= prayerTimes[2]) { // Asr
      filter.style.backgroundColor = "rgba(0, 0, 0, 0.2)";
      headerFilter.style.filter = "brightness(0.9)"; // Slightly darker header
    }
    else if (hour > prayerTimes[2] && hour <= prayerTimes[3]) { // Maghrib
      filter.style.backgroundColor = "rgba(0, 0, 0, 0.4)";
      headerFilter.style.filter = "brightness(0.85)"; // Darker header
    }
    else if (hour > prayerTimes[3] && hour <= prayerTimes[4]) { // Isha
      filter.style.backgroundColor = "rgba(0, 0, 0, 0.6)";
      headerFilter.style.filter = "brightness(0.7)"; // Much darker header
    }
  }

