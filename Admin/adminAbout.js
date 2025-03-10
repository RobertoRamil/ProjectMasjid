

// Initialize Firebase

let teamMembers;
let teamPortraits;

// End: Redirect to login page if the user is not authenticated

async function setupInfo(){
    const aboutBody = document.getElementById("adminLeftText");
    const aboutHeader = document.getElementById("adminLeftTitle");
    body = await getAboutBody();
    header = await getAboutHeader();

    aboutBody.textContent = body;
    aboutHeader.textContent = header;


}

async function initTeamMembers(){
    teamMembers = await getTeamNames();
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

    // Create a save button
    const saveButton = document.createElement("button");
    saveButton.textContent = "Save";
    saveButton.addEventListener("click", async () => {
        //Get files
        const name = nameInput.value;
        const portrait = imageInput.files[0];
        if (!name || !portrait) {
            alert("Please provide a name and portrait.");
            return;
        }
        //Save the portrait to storage
        console.log("Adding team member:", name); // Debugging line
        console.log("Portrait file:", portrait); // Debugging line
        //Save the name and portrait
        await saveTeamMember(name, portrait);



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

        const removeButton = document.createElement("button");
        removeButton.textContent = "- Remove";
        removeButton.addEventListener("click", () => {
            //teamMembers.splice(index, 1);
            //renderTeamMembers();
            const nameParagraph = removeButton.previousElementSibling;
            remove(nameParagraph.textContent);

        });

        
        

        // Append portrait and name to the member div
        member.appendChild(portrait);
        member.appendChild(name);
        member.appendChild(removeButton);

        // Append the member div to the memberGrid
        adminMembersBox.appendChild(member);
    }
}


document.addEventListener("DOMContentLoaded", () => {
    checkAuth();

    setupInfo();

    initTeamMembers();

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
