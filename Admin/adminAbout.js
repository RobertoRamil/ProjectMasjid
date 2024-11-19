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

            const editPhoto = document.createElement("input");
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
