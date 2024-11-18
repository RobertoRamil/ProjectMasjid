(function(){
    var darkOn=localStorage.getItem("darkCookie");
    var element=document.body;
    element.classList.toggle("dark-mode",darkOn);
  })();

function darkSwitch() {
    var element = document.body;
    var darkCookie=element.classList.toggle("dark-mode");
    document.cookie="darkCookie="+darkCookie;
    localStorage.setItem("darkCookie", darkCookie);
  }

