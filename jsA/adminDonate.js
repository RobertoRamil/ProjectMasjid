document.addEventListener("DOMContentLoaded", () => {
  checkAuth();
});
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, onAuthStateChanged} from 'https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js';
import { getFirestore, doc, updateDoc } from 'https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'https://www.gstatic.com/firebasejs/11.0.1/firebase-storage.js';
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

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth();

const db = getFirestore(app);

const storage = getStorage(app);

/*This shows the preview of the image uploaded*/
zelleSubmitImg.onchange = evt => {
    const [file] = zelleSubmitImg.files
    if (file) {
        zelle_preview.src = URL.createObjectURL(file);
        zelle_preview.style.display = "block"; 
    }
  }

 // Upload and update Zelle image
document.getElementById('zelle').addEventListener('submit', async (e) => {
  e.preventDefault(); // Prevent the page from refreshing

  const file = document.getElementById('zelleSubmitImg').files[0];

  if (file) {
      const storageRef = ref(storage, 'Donation_Photos/zelle.png');

      try {
          await uploadBytes(storageRef, file); 
          const downloadURL = await getDownloadURL(storageRef);

          document.getElementById('zelle_preview').src = downloadURL;
          alert('Zelle image updated successfully!');
      } catch (error) {
          console.error("Error uploading image: ", error);
          alert('Error uploading Zelle image.');
      }
  } else {
      alert('Please select an image to upload.');
  }
});

  document.getElementById('paypal').addEventListener('submit', async (e) => {
    e.preventDefault();  

    const paypalLink = document.getElementById('paypalURL').value.trim();
    if (paypalLink) {
        await updateDoc(doc(db, "donate", "donate_paypal"), { body: paypalLink });
        alert("Paypal link updated successfully");
    } else {
        alert("Please enter a valid link");
    }
});

document.getElementById('donate_about').addEventListener('submit', async (e) => {
  e.preventDefault(); // Prevent form from refreshing the page

  const aboutText = document.getElementById('donate_about_text').value.trim();
  if (aboutText) {
      await updateDoc(doc(db, "donate", "donate_body"), { body: aboutText });
      alert("Donation about section updated successfully!");
  } else {
      alert("Please enter some text for the about section.");
  }
});

import { getDoc } from 'https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js';

async function loadDonateAboutText() {
    const docSnap = await getDoc(doc(db, "donate", "donate_body"));
    if (docSnap.exists()) {
        document.getElementById('donate_about_text').value = docSnap.data().body || "";
    }
}

window.onload = loadDonateAboutText;