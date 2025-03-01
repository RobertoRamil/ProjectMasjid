//Adding arbitrary # of team members
async function teamMems(){
  console.log("teamMems called"); // Debugging line
  const memberGrid = document.getElementById("membersBox");
  const memberNames = await getTeamNames(); // Await the getTeamNames function
  const num_mems = memberNames.length;
  //console.log("Number of team members:", num_mems); // Debug
  //get the portrait URLs
  const portraitURLs = await getTeamPortraits(num_mems, memberNames); // Await the getTeamPort
  //console.log("Portrait URLs:", portraitURLs); // Debug


  for(let i = 0; i < num_mems; i++){
    //Create the member object
    const member = document.createElement("div");
    member.classList.add("member");

    // Create an image
    var portrait = document.createElement("img");
    portrait.setAttribute("src", portraitURLs[i]); // Set the src attribute to the portrait URL

    // Create a p for the member name
    var name = document.createElement("p");
    name.textContent = memberNames[i]; // Set the text content to the name

    // Append portrait and name to the member div
    member.appendChild(portrait);
    member.appendChild(name);

    // Append the member div to the memberGrid
    memberGrid.appendChild(member);
  }
}

async function setupAbout(){
  const aboutBody = document.getElementById("abtBody");
  const aboutHeader = document.getElementById("abtHead");
  body = await getAboutBody();
  header = await getAboutHeader();

  aboutBody.textContent = body;
  aboutHeader.textContent = header;
}

//initialize the member list
document.addEventListener("DOMContentLoaded", function() {
  teamMems();
});
document.addEventListener("DOMContentLoaded", function() {
  setupAbout();
});

console.log("setupAbout called"); // Debugging line
setupAbout();
console.log("teamMems called"); // Debugging line
teamMems();
