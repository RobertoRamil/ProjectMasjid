
document.addEventListener("DOMContentLoaded", () => {
    checkAuth();
});

document.getElementById("Logout").addEventListener("click", () => {
    redirectToLogout();
});
document.getElementById("darkModeToggle").addEventListener("click", () => {
    darkSwitch();
});

import { getStorage, ref, uploadBytes, getDownloadURL } from 'https://www.gstatic.com/firebasejs/11.0.1/firebase-storage.js';
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";

// Ensure environment variables are injected during the build process
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY_FIREBASE,
  authDomain: import.meta.env.VITE_authDomain_Firebase,
  projectId: import.meta.env.VITE_projectId_Firebase,
  storageBucket: import.meta.env.VITE_storageBucket_Firebase,
  messagingSenderId: import.meta.env.VITE_messagingSenderId_Firebase,
  appId: import.meta.env.VITE_appId_Firebase,
  measurementId: import.meta.env.VITE_measurementId_Firebase
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

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

async function uploadImageToFirebase(file, fileName) {
    try {
        const fileRef = ref(storage, `HeaderPhotos/${fileName}`);
        await uploadBytes(fileRef, file);
        const downloadURL = await getDownloadURL(fileRef);
        uploadStatus.textContent = "Upload successful!";
        console.log("File uploaded successfully. URL:", downloadURL);
    } catch (error) {
        uploadStatus.textContent = "Upload failed!";
        console.error("Error uploading file:", error);
    }
}

function handleUploadImage() {
    const file = imageUpload.files[0];
    if (!file) {
        uploadStatus.textContent = "No file selected!";
        return;
    }

    const imageType = document.getElementById("imageType").value;
    let fileName;

    if (imageType === "logo") {
        fileName = "logo2.png";
    } else if (imageType === "backdrop") {
        fileName = "FrontImage.png";
    } else if (imageType === "pageBackground") {
        fileName = "MainPageBackground.png"; // Rename for pageBackground
    }

    uploadImageToFirebase(file, fileName);
}

uploadButton.addEventListener("click", handleUploadImage);

// Reset the input for image input
document.getElementById("headerResetButton").addEventListener("click", function () {
    var imageInput = document.getElementById("imageUpload");
    var imageInputPreview = document.getElementById("imagePreview");

    imageInputPreview.style.display = "none";
    imageInput.value = "";
});

// Dark mode
(function () {
    var element = document.body;
    var darkOn = localStorage.getItem("darkCookie");

    if (darkOn === "true") {
        element.classList.toggle("dark-mode");
        var imageInput = document.getElementById("darkModeToggle");
        imageInput.innerText = String.fromCodePoint("0x263E");
    }
})();

function redirectToLogout() {
    let result = confirm("Are you sure you want to logout?");
    if (result) {
        console.log("Signing user out...");
        window.location.href = "adminLogout.html";
    } else {
        console.log("User has refused sign out");
    }
}

function darkSwitch() {
    var element = document.body;
    var switchDark = element.classList.toggle("dark-mode");

    var imageInput = document.getElementById("darkModeToggle");

    if (imageInput.innerText === String.fromCodePoint("0x263C") || switchDark) {
        /* Sun=0x263C */
        localStorage.setItem("darkCookie", true);
        imageInput.innerText = String.fromCodePoint("0x263E");
    } else {
        localStorage.removeItem("darkCookie");
        imageInput.innerText = String.fromCodePoint("0x263C"); /* Moon=0x263E */
    }
}

