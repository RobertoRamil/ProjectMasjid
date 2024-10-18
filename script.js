document.addEventListener("DOMContentLoaded", function(){
    console.log("Ready");
});

function showTab(tabName) {
    const contents = document.querySelectorAll('.tab-content');
    contents.forEach(content => {
        content.classList.remove('active');
    });
    const activeTab = document.getElementById(tabName);
    activeTab.classList.add('active');
}

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