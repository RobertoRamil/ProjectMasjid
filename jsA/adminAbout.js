import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";

import { getStorage, ref, getDownloadURL, uploadBytes } from 'https://www.gstatic.com/firebasejs/11.0.1/firebase-storage.js';
import { getFirestore, collection, doc, setDoc, getDoc, deleteDoc, updateDoc, getDocs, arrayUnion } from 'https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js'
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
  
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
  const auth = getAuth();
  
  //Login disabled on this branch for testing purposes
  /*// Check if the user is authenticated
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      // User is not signed in, redirect to login page
      window.location.href = "adminLogin.html";
      console.log("Page restricted until signed in");
    } else {
      // User is signed in, you can get the user ID if needed
    }
  });*/


  async function getTeamNames(){
    const teamRef = doc(db, "team", "team_members");
    const teamSnap = await getDoc(teamRef); // Await the getDoc call
    const teamNames = [];
    //get all the team names from the database
    if (teamSnap.exists()) {
      const teamData = teamSnap.data();
      if (teamData.teamNames) { 
        teamData.teamNames.forEach((name) => {
          teamNames.push(name);
        });
      }
    }
    //console.log(teamNames);
    return teamNames;
  }
  async function getTeamTitles(){
    const teamRef = doc(db, "team", "team_members");
    const teamSnap = await getDoc(teamRef); // Await the getDoc call
    const teamTitles = [];
    //get all the team titles from the database
    if (teamSnap.exists()) {
      const teamData = teamSnap.data();
      if (teamData.teamTitles) { 
        teamData.teamTitles.forEach((title) => {
          teamTitles.push(title);
        });
      }
    }
    //console.log(teamTitles);
    return teamTitles;
  }
  
  async function getTeamPortraits(num_mems, memberNames){
    //create array to store portraitURLs
    const portraitURLs = [];
    for(let i = 0; i < num_mems; i++){
      console.log("Getting portrait for", memberNames[i]); // Debugging line
      const portraitRef = ref(storage, `team_portraits/${memberNames[i]}.PNG`);
      const portraitURL = await getDownloadURL(portraitRef); // Await the getDownloadURL call
      //add portraitURL to an array
      portraitURLs.push(portraitURL);
    }
    //console.log(portraitURLs);
    return portraitURLs;
  }
  
  async function removeTeamMember(name){
    console.log("Removing team member:", name); // Debugging line
    const teamRef = doc(db, "team", "team_members");
    
    const teamSnap = await getDoc(teamRef); // Await the getDoc call
    const teamData = teamSnap.data();
    if (teamData.teamNames) {
      const index = teamData.teamNames.indexOf(name);
      if (index > -1) {
        teamData.teamNames.splice(index, 1);
        teamData.teamTitles.splice(index, 1);
      }
    }
    updateDoc(teamRef, { teamNames: teamData.teamNames });
    //Remove the portrait from storage
    const portraitRef = ref(storage, `team_portraits/${name}.PNG`);
    try {
      await deleteObject(portraitRef);
      console.log("Portrait deleted successfully");
    } catch (error) {
      console.error("Error deleting portrait:", error);
    }
  }
  async function getAboutHeader(){
    const aboutRef = doc(db, "about", "about_header");
    const aboutSnap = await getDoc(aboutRef); // Await the getDoc call
    const aboutHeader = aboutSnap.data().header;
    return aboutHeader;
  }
  
  async function getAboutBody(){
    const aboutRef = doc(db, "about", "about_body");
    const aboutSnap = await getDoc(aboutRef); // Await the getDoc call
    const aboutBody = aboutSnap.data().body;
    return aboutBody;
  }
  
  async function saveAbtHeader(){
    const aboutHeader = document.getElementById("adminLeftTitle").textContent;
    const aboutRef = doc(db, "about", "about_header");
    updateDoc(aboutRef, {header: aboutHeader});
  }
  
  async function saveAbtBody(){
    const aboutBody = document.getElementById("adminLeftText").textContent;
    const aboutRef = doc(db, "about", "about_body");
    updateDoc(aboutRef, {body: aboutBody});
  }
  async function saveTeamMember(name, title, portrait){
    const teamRef = doc(db, "team", "team_members");
    updateDoc(teamRef, {teamNames: arrayUnion(name)});
    updateDoc(teamRef, {teamTitles: arrayUnion(title)}); // Placeholder for title, can be modified later
    //Rename portrait file name to match the name
    const storageRef = ref(storage, `team_portraits/${name}.PNG`);
    try {
      await uploadBytes(storageRef, portrait);
      console.log("Portrait uploaded successfully");
    } catch (error) {
      console.error("Error uploading portrait:", error);
    }
  
  
  }
// Initialize Firebase

let teamMembers;
let teamTitles;
let teamPortraits;

// End: Redirect to login page if the user is not authenticated

async function setupInfo(){
    const aboutBody = document.getElementById("adminLeftText");
    const aboutHeader = document.getElementById("adminLeftTitle");
    let body = await getAboutBody();
    let header = await getAboutHeader();

    aboutBody.textContent = body;
    aboutHeader.textContent = header;


}

async function initTeamMembers(){
    teamMembers = await getTeamNames();
    teamTitles = await getTeamTitles();
    teamPortraits = await getTeamPortraits(teamMembers.length, teamMembers);
    renderTeamMembers();
}

async function remove(name){
    await removeTeamMember(name);
    initTeamMembers();
}

async function addTeamMember(){
    //create a temporary div with to accept inputs
    const adminMembersBox = document.getElementById("adminMembersBox");
    // Create a temporary div to accept inputs
    const tempDiv = document.createElement("div");
    tempDiv.classList.add("member");

    // Create an input for the image upload
    const imageInput = document.createElement("input");
    imageInput.type = "file";
    imageInput.classList.add("memberUpload");
    imageInput.accept = "image/png";

    // Create an image element for preview
    const imagePreview = document.createElement("img");
    imagePreview.classList.add("imagePreview");
    imagePreview.style.display = "none"; // Hide the preview initially

    // Add an event listener to show the preview when an image is selected
    imageInput.addEventListener("change", (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                imagePreview.src = e.target.result;
                imagePreview.style.display = "block"; // Show the preview
            };
            reader.readAsDataURL(file);
        } else {
            imagePreview.style.display = "none"; // Hide the preview if no file is selected
        }
    });

    // Create an input for the member name
    const nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.classList.add("memberName");
    nameInput.placeholder = "Member Name";

    // Create an input for the member title
    const titleInput = document.createElement("input");
    titleInput.type = "text";
    titleInput.classList.add("memberTitle");
    titleInput.placeholder = "Member Title";

    // Create a save button
    const saveButton = document.createElement("button");
    saveButton.textContent = "Save";
    saveButton.addEventListener("click", async () => {
        //Get files
        const name = nameInput.value;
        const title = titleInput.value;
        const portrait = imageInput.files[0];
        if (!name || !title || !portrait) {
            alert("Please provide a name, title, and portrait.");
            return;
        }
        //Save the portrait to storage
        console.log("Adding team member:", name); // Debugging line
        console.log("Portrait file:", portrait); // Debugging line
        //Save the name and portrait
        await saveTeamMember(name, title, portrait);



        //Rerender
        initTeamMembers();
    });

    //Create cancel button
    const cancelButton = document.createElement("button");
    cancelButton.textContent = "Cancel";
    cancelButton.addEventListener("click", () => {
        // Remove the temporary div
        tempDiv.remove();
    });

    // Append inputs and button to the temporary div
    tempDiv.appendChild(imageInput);
    tempDiv.appendChild(imagePreview);
    tempDiv.appendChild(nameInput);
    tempDiv.appendChild(titleInput);
    tempDiv.appendChild(saveButton);
    tempDiv.appendChild(cancelButton);

    // Append the temporary div to the adminMembersBox
    adminMembersBox.appendChild(tempDiv);


}

function renderTeamMembers(){
    //Attempt to remove all children of adminMembersBox
    const adminMembersBox = document.getElementById("adminMembersBox");
    adminMembersBox.innerHTML = ""; // Clear existing members   const adminMembersBox = document.getElementById("adminMembersBox");
    for(let i = 0; i < teamMembers.length; i++){
        //Create the member object
        const member = document.createElement("div");
        member.classList.add("member");

        // Create an image
        var portrait = document.createElement("img");
        portrait.setAttribute("src", teamPortraits[i]); // Set the src attribute to the portrait URL

        // Create a p for the member name
        var name = document.createElement("p");
        name.textContent = teamMembers[i]; // Set the text content to the name
        // Update the name in the teamMembers array on blur (when editing ends)

        var title = document.createElement("p");
        title.textContent = teamTitles[i]; // Placeholder for title, can be modified later


        const removeButton = document.createElement("button");
        removeButton.textContent = "- Remove";
        removeButton.addEventListener("click", () => {
            //teamMembers.splice(index, 1);
            //renderTeamMembers();
            const titleParagraph = removeButton.previousElementSibling;
            const nameParagraph = titleParagraph.previousElementSibling;
            remove(nameParagraph.textContent);

        });

        
        

        // Append portrait and name to the member div
        member.appendChild(portrait);
        member.appendChild(name);
        member.appendChild(title);
        member.appendChild(removeButton);

        // Append the member div to the memberGrid
        adminMembersBox.appendChild(member);
    }
}


document.addEventListener("DOMContentLoaded", () => {


    setupInfo();

    initTeamMembers();

    const adminMembersBox = document.getElementById("adminMembersBox");
   

    // Add New Member
    document.getElementById("addNewMember").addEventListener("click", () => {
        addTeamMember();
    });

    document.getElementById("saveAbt").addEventListener("click", () => {
        // Save Left Box Content
        console.log("Saving Left Box Content...");
        
        saveAbtHeader();
        saveAbtBody();
        alert("Changes saved successfully!");
        
    });

    // Save Changes
    /*document.getElementById("saveChanges").addEventListener("click", () => {
        // Save Left Box Content
        localStorage.setItem("leftBoxTitle", adminLeftTitle.textContent);
        localStorage.setItem("leftBoxText", adminLeftText.textContent);

        // Save Team Members
        localStorage.setItem("teamMembers", JSON.stringify(teamMembers));

        alert("Changes saved successfully!");
    });*/

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