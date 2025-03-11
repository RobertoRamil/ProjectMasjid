// Initialize Firebase

window.onload = function() {
  console.log("Window onload event triggered"); // Debugging line
  fetchLogo();
  setHeaderBackground();
  backgroundHourChange();
  setInterval(backgroundHourChange, 3.6e+6);
};

async function backgroundHourChange(){
  prayerNames=["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];
  prayerTimes=[];
  SprayerTimes=[];
  for(let i=0; i<prayerNames.length; i++){
    prayerTimes[i]=await pullPrayerTime(prayerNames[i]);
  }
  SprayerTimes=await pullSPrayerTime();

  console.log(prayerTimes);
  console.log(SprayerTimes);

  /*The prayer times are pulled. but the filters need to be changed to fit the prayer times. Basically 
  the background color will change by comparing the system's time to what is the closest prayer time.
  The way to do this is comparing the dates in the prayerTimes and SprayerTimes array to the system time.
  */
  const filter=document.getElementById("filter");
    //Grabbing the system times to compare them to find out if its night, afternoon, or sunrise/sundown
    var systemTime=new Date();
    var hour=systemTime.getHours().toLocaleString('en-US');
    //Change the background colors on the filter div that rests behind all objects but on top of the background image

    //Night Time
    if((hour>=0 && hour<6) || (hour>=18 && hour<24)){
        filter.style.backdropFilter="hue-rotate(80deg) brightness(20%)";
    }
    //Sunrise
    else if((hour>=6 && hour<8)|| (hour>=17 && hour<18)){
        filter.style.backdropFilter="hue-rotate(180deg)";
    }
    //Afternoon
    else if(hour>=8 && hour<17){
        filter.style.backdropFilter="brightness(120%)";
    }
}
  
