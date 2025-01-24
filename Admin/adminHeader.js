// Select elements
const imageUpload = document.getElementById("imageUpload");
const imagePreview = document.getElementById("imagePreview");
const uploadStatus = document.getElementById("uploadStatus");

// Display preview of the uploaded image
imageUpload.addEventListener("change", function () {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            imagePreview.src = e.target.result;
            imagePreview.style.display = "block";
        };
        reader.readAsDataURL(file);
    }
});

// upload the image
function uploadImage() {
    const file = imageUpload.files[0];
    if (!file) {
        uploadStatus.textContent = "Please select an image first.";
        uploadStatus.style.color = "red";
        return;
    }

    // Create to hold the file data
    const formData = new FormData();
    formData.append("image", file);

    // Send the image to the server
    fetch("/upload", {
        method: "POST",
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            uploadStatus.textContent = "Image uploaded successfully!";
            uploadStatus.style.color = "green";
        } else {
            uploadStatus.textContent = "Image upload failed. Please try again.";
            uploadStatus.style.color = "red";
        }
    })
    .catch(error => {
        console.error("Error uploading image:", error);
        uploadStatus.textContent = "An error occurred. Please try again.";
        uploadStatus.style.color = "red";
    });
}

//Dark mode
(function(){
    var darkOn=localStorage.getItem("darkCookie");
    var element=document.body;

    if(darkOn==="true"){
        element.classList.toggle("dark-mode");
    }

  })();

function darkSwitch() {
    var element = document.body;
    var switchDark=element.classList.toggle("dark-mode");
    document.cookie="darkCookie="+switchDark;
    localStorage.setItem("darkCookie", switchDark);
  }
