import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";

import { getStorage, ref, getDownloadURL, uploadBytes } from 'https://www.gstatic.com/firebasejs/11.0.1/firebase-storage.js';
import { getFirestore, collection, doc, setDoc, getDoc, deleteDoc, updateDoc, getDocs, arrayUnion } from 'https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js'
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js';

//Hide this later
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth();

// Check if the user is authenticated

onAuthStateChanged(auth, (user) => {
  if (!user) {
    // User is not signed in, redirect to login page
    window.location.href = "adminLogin.html";
    console.log("Page restricted until signed in");
  } else {
    // User is signed in, you can get the user ID if needed
  }
});


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
  
  async function removeTeamMember(name) {
    console.log("Removing team member:", name); // Debugging line
    const teamRef = doc(db, "team", "team_members");

    const teamSnap = await getDoc(teamRef); // Await the getDoc call
    const teamData = teamSnap.data();
    if (teamData.teamNames && teamData.teamTitles) {
      const index = teamData.teamNames.indexOf(name);
      if (index > -1) {
        teamData.teamNames.splice(index, 1);
        teamData.teamTitles.splice(index, 1);

        // Update the Firestore document with the modified arrays
        await updateDoc(teamRef, {
          teamNames: teamData.teamNames,
          teamTitles: teamData.teamTitles,
        });
      }
    }

    // Remove the portrait from storage
    const portraitRef = ref(storage, `team_portraits/${name}.PNG`);
    try {
      await deleteObject(portraitRef);
      console.log("Portrait deleted successfully");
    } catch (error) {
      console.error("Error deleting portrait:", error);
    }
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
async function getAboutHeader() {
  const aboutRef = doc(db, "about", "about_header");
  const aboutSnap = await getDoc(aboutRef); // Await the getDoc call
  const aboutHeader = aboutSnap.data().header;
  return aboutHeader;
}

async function getAboutBody() {
  const aboutRef = doc(db, "about", "about_body");
  const aboutSnap = await getDoc(aboutRef); // Await the getDoc call
  const aboutBody = aboutSnap.data().body;
  return aboutBody;
}

async function saveAbtHeader() {
  const aboutHeader = document.getElementById("adminLeftTitle").textContent;
  const aboutRef = doc(db, "about", "about_header");
  updateDoc(aboutRef, { header: aboutHeader });
}

async function saveAbtBody() {
  const aboutBody = document.getElementById("adminLeftText").textContent;
  const aboutRef = doc(db, "about", "about_body");
  updateDoc(aboutRef, { body: aboutBody });
}

// Initialize Firebase

let teamMembers;
let teamTitles;
let teamPortraits;

// End: Redirect to login page if the user is not authenticated

async function setupInfo() {
  const aboutBody = document.getElementById("adminLeftText");
  const aboutHeader = document.getElementById("adminLeftTitle");
  let body = await getAboutBody();
  let header = await getAboutHeader();

  aboutBody.textContent = body;
  aboutHeader.textContent = header;


}

async function initTeamMembers() {
  try {
    console.log("Initializing team members...");
    teamMembers = await getTeamNames();
    teamTitles = await getTeamTitles();
    teamPortraits = await getTeamPortraits(teamMembers.length, teamMembers);

    // Log the fetched data for debugging
    console.log("Team Members:", teamMembers);
    console.log("Team Titles:", teamTitles);
    console.log("Team Portraits:", teamPortraits);

    // Validate that all arrays are properly populated
    if (!teamMembers || !teamTitles || !teamPortraits) {
      throw new Error("One or more arrays are undefined.");
    }
    if (teamMembers.length !== teamTitles.length || teamMembers.length !== teamPortraits.length) {
      throw new Error("Array lengths are mismatched.");
    }

    renderTeamMembers();
    console.log("Team members initialized successfully.");
  } catch (error) {
    console.error("Error initializing team members:", error);
  }
}

async function remove(name) {
  await removeTeamMember(name);
  initTeamMembers();
}

async function addTeamMember() {
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

function renderTeamMembers() {
  // Attempt to remove all children of adminMembersBox
  const adminMembersBox = document.getElementById("adminMembersBox");
  adminMembersBox.innerHTML = ""; // Clear existing members

  // Ensure teamMembers, teamTitles, and teamPortraits are defined and have the same length
  if (!teamMembers || !teamTitles || !teamPortraits || teamMembers.length !== teamTitles.length || teamMembers.length !== teamPortraits.length) {
    console.error("Error: teamMembers, teamTitles, or teamPortraits is undefined or mismatched.");
    return;
  }

  for (let i = 0; i < teamMembers.length; i++) {
    // Create the member object
    const member = document.createElement("div");
    member.classList.add("member");

    // Create an image
    const portrait = document.createElement("img");
    portrait.setAttribute("src", teamPortraits[i]); // Set the src attribute to the portrait URL

    // Create a p for the member name
    const name = document.createElement("p");
    name.textContent = teamMembers[i]; // Set the text content to the name

    // Create a p for the member title
    const title = document.createElement("p");
    title.textContent = teamTitles[i]; // Set the text content to the title

    // Create a remove button
    const removeButton = document.createElement("button");
    removeButton.textContent = "- Remove";
    removeButton.addEventListener("click", () => {
      remove(name.textContent);
    });

    // Append portrait, name, title, and remove button to the member div
    member.appendChild(portrait);
    member.appendChild(name);
    member.appendChild(title);
    member.appendChild(removeButton);

    // Append the member div to the adminMembersBox
    adminMembersBox.appendChild(member);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  setupInfo();

  // Initialize team members, titles, and portraits
  initTeamMembers();
  initSocials();

    const adminMembersBox = document.getElementById("adminMembersBox");




  // Load Left Box Content


  // Render Team Members
  function renderTeamMembers() {
    adminMembersBox.innerHTML = ""; // Clear existing members
    /*teamMembers.forEach((member, index) => {
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
    });*/
  }
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
});

//social media 
$(document).ready(function () {

  // Handle form submission for social media links
  $('#socialLinksForm').on('submit', function (event) {
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
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      try {
        const hasPermission = await canEditElement(user.phoneNumber, "canEditSocials");
        if (!hasPermission) {
          alert("You do not have permission to perform this function.");
          return;
        } else {
          if (facebookLink) {
            await updateDoc(doc(db, "Links", "facebook"), { link: facebookLink });
            alert("Facebook link updated successfully!");
          } else {
            alert("Please enter a valid Facebook URL.");
          }
        }
        console.log(hasPermission);
      } catch (error) {
        console.error('Error checking permissions:', error);
      }
    }
  });
  document.getElementById('facebookLink').value = '';
});

/*
onAuthStateChanged(auth, async (user) => {
    if (user) {
      try {
        const hasPermission = await canEditElement(user.phoneNumber, "canEditSocials");
        if (!hasPermission) {
          alert("You do not have permission to perform this function.");

        } else {
          
        }
        console.log(hasPermission);
      } catch (error) {
        console.error('Error checking permissions:', error);
      }
    }
  });
*/



document.getElementById("updateInstagramLink").addEventListener("click", async () => {
  const instagramLink = document.getElementById("instagramLink").value.trim();
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      try {
        const hasPermission = await canEditElement(user.phoneNumber, "canEditSocials");
        if (!hasPermission) {
          alert("You do not have permission to perform this function.");

        } else {
          if (instagramLink) {
            await updateDoc(doc(db, "Links", "instagram"), { link: instagramLink });
            alert("Instagram link updated successfully!");
          } else {
            alert("Please enter a valid Instagram URL.");
          }
        }
        console.log(hasPermission);
      } catch (error) {
        console.error('Error checking permissions:', error);
      }
    }
  });
  document.getElementById('instagramLink').value = '';
});



document.getElementById("updateYouTubeLink").addEventListener("click", async () => {
  const youtubeLink = document.getElementById("youtubeLink").value.trim();
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      try {
        const hasPermission = await canEditElement(user.phoneNumber, "canEditSocials");
        if (!hasPermission) {
          alert("You do not have permission to perform this function.");

        } else {
          if (youtubeLink) {
            await updateDoc(doc(db, "Links", "youtube"), { link: youtubeLink });
            alert("YouTube link updated successfully!");
          } else {
            alert("Please enter a valid YouTube URL.");
          }
        }
        console.log(hasPermission);
      } catch (error) {
        console.error('Error checking permissions:', error);
      }
    }
  });
  document.getElementById('youtubeLink').value = '';
});

async function getEmail(phoneNumber) {
  const querySnapshot = await getDocs(collection(db, "whitelistedAdmins"));
  let documentName = null;

  querySnapshot.forEach((doc) => {
    if (doc.data().phoneNumber === phoneNumber) {
      documentName = doc.id;
    }
  });
  console.log(documentName);

  return documentName;
}

async function canEditElement(phoneNumber, permission) {
  const email = await getEmail(phoneNumber);
  if (!email) {
    return false;
  }

  const docSnap = await getDoc(doc(db, "whitelistedAdmins", email));
  const hasPermission = docSnap.data()[permission];
  return hasPermission;
}

async function initSocials(){
  const facebookRef = doc(db, "Links", "facebook");
  const instagramRef = doc(db, "Links", "instagram");
  const youtubeRef = doc(db, "Links", "youtube");

  const facebookSnap = await getDoc(facebookRef);
  const instagramSnap = await getDoc(instagramRef);
  const youtubeSnap = await getDoc(youtubeRef);

  document.getElementById("facebookLink").value = facebookSnap.data().link;
  document.getElementById("instagramLink").value = instagramSnap.data().link;
  document.getElementById("youtubeLink").value = youtubeSnap.data().link;
}