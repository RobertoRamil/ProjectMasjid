const filter=document.getElementById("filter");

function backgroundHourChange(){
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
backgroundHourChange();
setInterval(backgroundHourChange, 3.6e+6);
