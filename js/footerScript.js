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

function setupBackToTopButton() {
  const backToTopButton = document.querySelector('.back-to-top');
  backToTopButton.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

