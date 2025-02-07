// Initialize Firebase

import { fetchLogo, setHeaderBackground } from './firebase.js'


window.onload = function() {
  console.log("Window onload event triggered"); // Debugging line
  fetchLogo();
  setHeaderBackground();
};