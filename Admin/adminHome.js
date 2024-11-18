(function(){
    var darkOn=localStorage.getItem("darkCookie");
    var element=document.body;

    if(darkOn==="true"){
        element.classList.toggle("dark-mode");
    }

  })();

function darkSwitch() {
    var element = document.body;
    var switchDark=element.classList.toggle("dark-mode");
    document.cookie="darkCookie="+switchDark;
    localStorage.setItem("darkCookie", switchDark);
  }

