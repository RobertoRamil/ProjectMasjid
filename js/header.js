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
 
    //Fajr
    if(hour>prayerTimes[4]){
      filter.style.backdropFilter="hue-rotate(150deg)";
      headerFilter.style.filter="hue-rotate(302deg) brightness(80%)";
    }
    //Dhuhr
    else if (hour>prayerTimes[0] && hour<=prayerTimes[1]){
      filter.style.backdropFilter="brightness(160%)";
      //Because the header is already filtered this wont be.
    }
    //Asr 
    else if (hour>prayerTimes[1] && hour<=prayerTimes[2]){
      filter.style.backdropFilter="hue-rotate(200deg)";
      headerFilter.style.filter="hue-rotate(340deg)";
    }
    //Maghrib
    else if (hour>prayerTimes[2] && hour<=prayerTimes[3]){
      filter.style.backdropFilter="hue-rotate(80deg) brightness(120%)";
      headerFilter.style.filter="hue-rotate(290deg) brightness(75%)";
    }
    //Isha
    else if (hour>prayerTimes[3] && hour<=prayerTimes[4]){
      filter.style.backdropFilter="hue-rotate(120deg) brightness(20%)";
      headerFilter.style.filter="hue-rotate(30deg) brightness(30%)";
    }
}
