import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, onAuthStateChanged} from 'https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js';

//Hide this later
const firebaseConfig = {
  apiKey: "AIzaSyChNmvSjjLzXfWeGsKHebXgGq_AMUdKzHo",
  authDomain: "project-musjid.firebaseapp.com",
  projectId: "project-musjid",
  storageBucket: "project-musjid.firebasestorage.app",
  messagingSenderId: "445451894728",
  appId: "1:445451894728:web:09bffcb1743ae1ecec4afd",
  measurementId: "G-H5XN7NRJ6V"
};

// Initialize Firebase
initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth();

// Check if the user is authenticated
onAuthStateChanged(auth, (user) => {
  if (!user) {
    // User is not signed in, redirect to login page
    window.location.href = "adminLogin.html";
    console.log("Page restricted until signed in");
  } else {
    // User is signed in, you can get the user ID if needed
    console.log("Signed in as account Name:", user.displayName);
  }
});
// End: Redirect to login page if the user is not authenticated





document.addEventListener("DOMContentLoaded", () => {
    const teamMembers = JSON.parse(localStorage.getItem("teamMembers") || "[]");
    const adminMembersBox = document.getElementById("adminMembersBox");

    // Load Left Box Content
    const adminLeftTitle = document.getElementById("adminLeftTitle");
    const adminLeftText = document.getElementById("adminLeftText");
    adminLeftTitle.textContent = localStorage.getItem("leftBoxTitle") || "*Title of the information here*";
    adminLeftText.textContent = localStorage.getItem("leftBoxText") || "The full text goes here.";

    // Render Team Members
    function renderTeamMembers() {
        adminMembersBox.innerHTML = ""; // Clear existing members
        teamMembers.forEach((member, index) => {
            const memberDiv = document.createElement("div");
            memberDiv.classList.add("member");

            const portrait = document.createElement("img");
            portrait.setAttribute("src", member.photo || "https://tinyurl.com/2s3cwmnp");

            const name = document.createElement("p");
            name.textContent = member.name || "*Member Name*";
            name.contentEditable = "true";

            // Update the name in the teamMembers array on blur (when editing ends)
            name.addEventListener("blur", () => {
                teamMembers[index].name = name.textContent;
            });

            const editPhoto = document.createElement("textarea");
            editPhoto.type = "text";
            editPhoto.placeholder = "Photo URL";
            editPhoto.value = member.photo;
            editPhoto.addEventListener("input", (e) => {
                member.photo = e.target.value;
                portrait.src = e.target.value;
            });

            const removeButton = document.createElement("button");
            removeButton.textContent = "- Remove";
            removeButton.addEventListener("click", () => {
                teamMembers.splice(index, 1);
                renderTeamMembers();
            });

            memberDiv.appendChild(portrait);
            memberDiv.appendChild(name);
            memberDiv.appendChild(editPhoto);
            memberDiv.appendChild(removeButton);
            adminMembersBox.appendChild(memberDiv);
        });
    }

    // Add New Member
    document.getElementById("addNewMember").addEventListener("click", () => {
        teamMembers.push({ name: "*Member Name*", photo: "https://tinyurl.com/2s3cwmnp" });
        renderTeamMembers();
    });

    // Save Changes
    document.getElementById("saveChanges").addEventListener("click", () => {
        // Save Left Box Content
        localStorage.setItem("leftBoxTitle", adminLeftTitle.textContent);
        localStorage.setItem("leftBoxText", adminLeftText.textContent);

        // Save Team Members
        localStorage.setItem("teamMembers", JSON.stringify(teamMembers));

        alert("Changes saved successfully!");
    });

    renderTeamMembers();
});

//social media 
$(document).ready(function() {

    // Handle form submission for social media links
    $('#socialLinksForm').on('submit', function(event) {
        event.preventDefault();  

        // Get values from input fields
        const facebookLink = $('#facebookLink').val().trim();
        const instagramLink = $('#instagramLink').val().trim();

        // Check if at least one link is provided
        if (!facebookLink && !instagramLink) {
            alert('Please enter at least one social media link.');
            return; 
        }

        // Placeholder for Firebase 
        const updates = {};
        if (facebookLink) updates.facebook = facebookLink;
        if (instagramLink) updates.instagram = instagramLink;

        // Temporary alert as a placeholder
        alert(`Updates:\n${facebookLink ? "Facebook: " + facebookLink : ""}\n${instagramLink ? "Instagram: " + instagramLink : ""}`);
    });
});