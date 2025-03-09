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
function handleUploadImage() {
    uploadImage();
}

uploadButton.addEventListener("click", handleUploadImage);

//Reset the input for image input
document.getElementById("headerResetButton").addEventListener("click", function (){
    var imageInput=document.getElementById("imageUpload");
    var imageInputPreview=document.getElementById("imagePreview");

    imageInputPreview.style.display="none";
    imageInput.value="";
});


//Dark mode
(function(){
    var element=document.body;
    var darkOn=localStorage.getItem("darkCookie");
    
    if(darkOn==="true"){
        element.classList.toggle("dark-mode");
        var imageInput=document.getElementById("darkModeToggle");
        imageInput.innerText=String.fromCodePoint("0x263E");   
    }

  })();

function darkSwitch() {
    var element=document.body;
    var switchDark=element.classList.toggle("dark-mode");
    
    var imageInput=document.getElementById("darkModeToggle");


    if(imageInput.innerText===String.fromCodePoint("0x263C")||switchDark){/*Sun=0x263C */
        localStorage.setItem("darkCookie", true);
        imageInput.innerText=String.fromCodePoint("0x263E");
    }else{
        localStorage.removeItem("darkCookie");
        imageInput.innerText=String.fromCodePoint("0x263C");/* Moon=0x263E */
    }
  }

