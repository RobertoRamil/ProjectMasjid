import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, onAuthStateChanged} from 'https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js';
import { getFirestore, doc, updateDoc } from 'https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js';

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
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth();

// Initialize Firestore
const db = getFirestore(app);

// Check if the user is authenticated
onAuthStateChanged(auth, (user) => {
  if (!user) {
    // User is not signed in, redirect to login page
    window.location.href = "adminLogin.html";
    console.log("Page restricted until signed in");
  } else {

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

// Handle update buttons for social media links
document.getElementById("updateFacebookLink").addEventListener("click", async () => {
    const facebookLink = document.getElementById("facebookLink").value.trim();
    if (facebookLink) {
        await updateDoc(doc(db, "Links", "facebook"), { link: facebookLink });
        alert("Facebook link updated successfully!");
    } else {
        alert("Please enter a valid Facebook URL.");
    }
});

document.getElementById("updateInstagramLink").addEventListener("click", async () => {
    const instagramLink = document.getElementById("instagramLink").value.trim();
    if (instagramLink) {
        await updateDoc(doc(db, "Links", "instagram"), { link: instagramLink });
        alert("Instagram link updated successfully!");
    } else {
        alert("Please enter a valid Instagram URL.");
    }
});

document.getElementById("updateYouTubeLink").addEventListener("click", async () => {
    const youtubeLink = document.getElementById("youtubeLink").value.trim();
    if (youtubeLink) {
        await updateDoc(doc(db, "Links", "youtube"), { link: youtubeLink });
        alert("YouTube link updated successfully!");
    } else {
        alert("Please enter a valid YouTube URL.");
    }
});