import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, getDoc, doc} from 'https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js'
import { getStorage, ref, getDownloadURL } from 'https://www.gstatic.com/firebasejs/11.0.1/firebase-storage.js';

export const firebaseConfig = {
  apiKey: "AIzaSyChNmvSjjLzXfWeGsKHebXgGq_AMUdKzHo",
  authDomain: "project-musjid.firebaseapp.com",
  projectId: "project-musjid",
  storageBucket: "project-musjid.firebasestorage.app",
  messagingSenderId: "445451894728",
  appId: "1:445451894728:web:09bffcb1743ae1ecec4afd",
  measurementId: "G-H5XN7NRJ6V"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export async function fetchLogo() {
  console.log("fetchLogo function called"); // Debugging line
  const storageRef = ref(storage, 'HeaderPhotos/logo2.png');
  try {
    const url = await getDownloadURL(storageRef);
    console.log("Logo URL:", url); // Debugging line
    document.getElementById('logo of MMSC').src = url;
    console.log("Logo fetched and set successfully"); // Debugging line
  } catch (error) {
    console.error("Error fetching logo:", error);
  }
} 

export async function setHeaderBackground() {
  const storageRef = ref(storage, 'HeaderPhotos/FrontImage.png');
  try {
    const url = await getDownloadURL(storageRef);
    console.log("Header background URL fetched:", url); // Debugging line
    document.querySelector('.header').style.backgroundImage = `url(${url})`;
  } catch (error) {
    console.error("Error fetching header background:", error);
  }
}
