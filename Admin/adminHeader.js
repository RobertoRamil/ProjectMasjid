// Select elements
const imageUpload = document.getElementById("imageUpload");
const imagePreview = document.getElementById("imagePreview");
const uploadStatus = document.getElementById("uploadStatus");
const uploadButton = document.getElementById("uploadButton");

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

function handleUploadImage() {
    uploadImage();
}

uploadButton.addEventListener("click", handleUploadImage);
