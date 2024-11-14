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
function announcementPanes(announcement_panes){
    const announcementGrid = document.getElementById("announcementBox");
    for(let j = 0; j < announcement_panes; j++){
      
      const announcement = document.createElement("div");
      announcement.classList.add("announcement");
      
      var boxinbox = document.createElement("announBox");
      boxinbox.textContent= "*Announcement details go here*"; 
      announcement.appendChild(boxinbox);

      if(announcement){
      announcementGrid.appendChild(announcement);
      }
    }
    
  }
  announcementPanes(2);

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



