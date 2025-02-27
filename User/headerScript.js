import { pullPrayerTime } from './firebase.js';
const filter=document.getElementById("filter");

let congregationNames = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];
let congregationTimes=[];

async function initializeBackground() {
    for(let i=0; i<congregationNames.length; i++){
        var timeTemp = await pullPrayerTime(congregationNames[i]);
        congregationTimes[i] = timeTemp.toLocaleTimeString("en-US", {hour12: false});    
    }

    let Fajr=congregationTimes[0];
    let Dhuhr=congregationTimes[1];
    let Asr=congregationTimes[2];
    let Maghrib=congregationTimes[3];
    let Isha=congregationTimes[4];

    function backgroundHourChange(){
        //Grabbing the system times to compare them to find out if its night, afternoon, or sunrise/sundown
        var systemTime=new Date();
        var hour=systemTime.getHours().toLocaleString('en-US');
        //Change the background colors on the filter div that rests behind all objects but on top of the background image

        /*
        console.log("System Time="+hour);
        console.log("Fajr="+Fajr.split(":")[0]);
        console.log("Dhuhr="+Dhuhr.split(":")[0]);
        console.log("Asr="+Asr.split(":")[0]);
        console.log("Maghrib="+Maghrib.split(":")[0]);
        console.log("Isha="+Isha.split(":")[0]);
        */

        //Night Time
        if((hour>Maghrib || hour<=Isha)){
            filter.style.backdropFilter="hue-rotate(80deg) brightness(20%)";
        }
        //Sunrise/Sunset 
        else if((hour>=Asr && hour<=Maghrib)|| (hour>Isha || hour<=Fajr)){
            filter.style.backdropFilter="hue-rotate(180deg)";
        }
        //Afternoon
        else if(hour>Fajr && hour<Dhuhr){
            filter.style.backdropFilter="brightness(120%)";
        }
    }
    backgroundHourChange();
    setInterval(backgroundHourChange, 3.6e+6);
}
initializeBackground();
