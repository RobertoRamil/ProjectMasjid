import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js';
import { getFirestore, doc, updateDoc, getDocs, getDoc, collection } from 'https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'https://www.gstatic.com/firebasejs/11.0.1/firebase-storage.js';

// Hide this later
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

// Check if the user is authenticated
onAuthStateChanged(auth, (user) => {
  if (!user) {
    // User is not signed in, redirect to login page
    window.location.href = "adminLogin.html";
    console.log("Page restricted until signed in");
  } else {
    // User is signed in
  }
});

// This shows the preview of the image uploaded
document.getElementById('zelleSubmitImg').onchange = evt => {
  const [file] = evt.target.files;
  if (file) {
    document.getElementById('zelle_preview').src = URL.createObjectURL(file);
    document.getElementById('zelle_preview').style.display = "block";
  }
};

// Upload and update Zelle image
document.getElementById('zelle').addEventListener('submit', async (e) => {
  e.preventDefault(); // Prevent the page from refreshing

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      try {
        const hasPermission = await canEditElement(user.phoneNumber, "canEditPayments");
        if (!hasPermission) {
          alert("You do not have permission to perform this function.");
        } else {
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
        }
      } catch (error) {
        console.error('Error checking permissions:', error);
      }
    }
  });
});

document.getElementById('paypal').addEventListener('submit', async (e) => {
  e.preventDefault();

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      try {
        const hasPermission = await canEditElement(user.phoneNumber, "canEditPayments");
        if (!hasPermission) {
          alert("You do not have permission to perform this function.");

        } else {
          const paypalLink = document.getElementById('paypalURL').value.trim();
          if (paypalLink) {
            await updateDoc(doc(db, "donate", "donate_paypal"), { body: paypalLink });
            alert("Paypal link updated successfully");


          } else {
            alert("Please enter a valid link");
          }
        }
        console.log(hasPermission);
      } catch (error) {
        console.error('Error checking permissions:', error);
      }
    }
  });
  document.getElementById('paypalURL').value = '';



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

async function loadDonateAboutText() {
  const docSnap = await getDoc(doc(db, "donate", "donate_body"));
  if (docSnap.exists()) {
    document.getElementById('donate_about_text').value = docSnap.data().body || "";
  }
}

window.onload = loadDonateAboutText;

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


