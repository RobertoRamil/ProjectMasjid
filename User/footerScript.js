// footerScript.js

// Display the current year in the footer
const yearElement = document.getElementById('current-year');
const year = new Date().getFullYear();
yearElement.innerText = year;

// "Back to Top" button in the footer
const backToTopButton = document.querySelector('.back-to-top');

// Scroll back to top when button is clicked
backToTopButton.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});