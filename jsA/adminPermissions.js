// Start: Redirect to login page if the user is not authenticated
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, deleteUser } from 'https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js';
import { getStorage, ref, getDownloadURL, uploadBytes, listAll } from 'https://www.gstatic.com/firebasejs/11.0.1/firebase-storage.js';
import { getFirestore, collection, doc, setDoc, getDoc, deleteDoc, updateDoc, getDocs, arrayUnion } from 'https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js'

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
initializeApp(firebaseConfig);
const db = getFirestore();
const storage = getStorage();

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth();

// Check if the user is authenticated
onAuthStateChanged(auth, (user) => {
    if (!user) {
        // User is not signed in, redirect to login page
        window.location.href = "adminLogin.html";
        console.log("Page restricted until signed in");
    } else {
        // User is signed in, you can get the user ID if needed
    }
});

document.getElementById('createAdminBtn').addEventListener('click', async () => {
    const email = document.getElementById('adminEmail').value.trim;

    if (!email || !document.getElementById('adminPhoneNumberCountryCode').value.trim() || !document.getElementById('adminPhoneNumber').value.trim()) {
        alert("Error: Fields not filled properly");
        return;
    }

    const adminFullPhoneNumber = "+" + document.getElementById('adminPhoneNumberCountryCode').value.trim + document.getElementById('adminPhoneNumber').value;
    const password = document.getElementById('adminPassword').value;

    const adminDocRef = doc(db, "whitelistedAdmins", email);
    const adminDocSnap = await getDoc(adminDocRef);
    if (adminDocSnap.exists()) {
        console.log("Admin already exists in whitelistedAdmins.");
    }
    else {

        await setDoc(adminDocRef, {
            isSuperAdmin: false,
            phoneNumber: adminFullPhoneNumber,
            canEditHome: false,
            canEditAbout: false
        });

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            console.log('User created:', user);
            alert('Admin created successfully');

        } catch (error) {
            if (error.code === "auth/email-already-in-use") {
                console.log("Error: ", error);
            } else {
                console.error('Error creating user:', error);
                alert('Error creating admin: ' + error.message);
            }
        }

        populateAdminDropDown();
    }

    document.getElementById('adminEmail').value = '';
    document.getElementById('adminPhoneNumberCountryCode').value = '';
    document.getElementById('adminPhoneNumber').value = '';
    document.getElementById('adminPassword').value = '';
    document.getElementById('canEditHome').checked = false;
    document.getElementById('canEditAbout').checked = false;

});

// Populate the adminDropDown with documents within whitelistedAdmins that contain the field isSuperAdmin = false
const adminDropDown = document.getElementById('adminDropDown');

async function populateAdminDropDown() {
    // Add a "No option selected" option as the first option
    const noOptionSelected = document.createElement('option');
    noOptionSelected.value = '';
    noOptionSelected.textContent = 'No Selection';
    adminDropDown.appendChild(noOptionSelected);

    const querySnapshot = await getDocs(collection(db, "whitelistedAdmins"));
    querySnapshot.forEach((doc) => {
        if (doc.data().isSuperAdmin === false) {
            const option = document.createElement('option');
            option.value = doc.id;
            option.textContent = doc.id;
            adminDropDown.appendChild(option);
        }
    });
}

async function deleteAdmin() {
    const selectedAdmin = adminDropDown.value;
    if (selectedAdmin === '') {
        alert('No selection has been made');
        return;
    }
    if (selectedAdmin) {
        try {
            await deleteDoc(doc(db, "whitelistedAdmins", selectedAdmin));
            alert('Admin deleted successfully');


            // Remove the deleted admin from the dropdown
            const optionToRemove = adminDropDown.querySelector(`option[value="${selectedAdmin}"]`);
            if (optionToRemove) {
                adminDropDown.removeChild(optionToRemove);
            }
        } catch (error) {
            console.error('Error deleting admin:', error);
            alert('Error deleting admin: ' + error.message);
        }
    } else {
        alert('Please select an admin to delete');
    }
}

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

document.getElementById('deleteAdminBtn').addEventListener('click', deleteAdmin);

populateAdminDropDown();