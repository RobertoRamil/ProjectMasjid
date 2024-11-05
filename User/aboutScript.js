//Adding arbitrary # of team members
function teamMems(num_mems){
  //const numMems = 7;
  const memberGrid = document.getElementById("membersBox");
  for(let i = 0; i < num_mems; i++){
    //Create the member object
    const member = document.createElement("div");
    member.classList.add("member");

    // Create an image
    var portrait = document.createElement("img");
    portrait.setAttribute("src", "https://tinyurl.com/2s3cwmnp");

    // Create a p for the member name
    var name = document.createElement("p");
    name.textContent = "*Member Name*"; // Set the text content to the name

    // Append portrait and name to the member div
    member.appendChild(portrait);
    member.appendChild(name);

    // Append the member div to the memberGrid
    memberGrid.appendChild(member);

  }
  
}
//initialize the member list
teamMems(12);
