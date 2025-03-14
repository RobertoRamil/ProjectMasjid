// footerScript.js

document.addEventListener('DOMContentLoaded', function() {
    getlinks();
    displayCurrentYear();
    setupBackToTopButton();
});

function displayCurrentYear() {
  const yearElement = document.getElementById('current-year');
  const year = new Date().getFullYear();
  yearElement.textContent = year;
}


function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth"  
  });
}