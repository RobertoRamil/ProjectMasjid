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
/*
onAuthStateChanged(auth, (user) => {
  if (!user) {
    // User is not signed in, redirect to login page
    window.location.href = "adminLogin.html";
    console.log("Page restricted until signed in");
  } else {
    // User is signed in, you can get the user ID if needed
  }
});

*/




document.getElementById('deleteAdminBtn').addEventListener('click', deleteAdmin);
document.getElementById('adminDropDown2').addEventListener('change', (event) => {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      try {
        const hasPermission = await canEditElement(user.phoneNumber, "isSuperAdmin");
        if (!hasPermission) {
          alert("You do not have permission to perform this function.");
          adminDropDown2.value = '';
        }
        else {
          if (event.target.value !== '') {
            getAdminPermissions();
          }
          else{
            console.log(event.target.value);
            document.getElementById('permissionsContainer').innerHTML = ''; // Clear previous content
          }
        }
        //console.log(hasPermission);
      } catch (error) {
        console.error('Error checking permissions:', error);
      }

    }
  });
});

document.getElementById('permissionsContainer').addEventListener('change', async (event) => {
  const selectedAdmin = adminDropDown2.value;
  if (event.target.type === 'checkbox' && event.target.parentElement.textContent.includes('Can Edit Payments')) {
    // Empty event listener for canEditPaymentsCheckbox update
    const canEditPayments = event.target.checked;

    try {
      await updateDoc(doc(db, "whitelistedAdmins", selectedAdmin), {
      canEditPayments: canEditPayments
      });
      console.log(`Updated canEditPayments to ${canEditPayments} for admin ${selectedAdmin}`);
    } catch (error) {
      console.error('Error updating canEditPayments:', error);
    }
  }
  else if (event.target.type === 'checkbox' && event.target.parentElement.textContent.includes('Can Edit Socials')) {
    const canEditSocials = event.target.checked;

    try {
      await updateDoc(doc(db, "whitelistedAdmins", selectedAdmin), {
        canEditSocials: canEditSocials
      });
      console.log(`Updated canEditSocials to ${canEditSocials} for admin ${selectedAdmin}`);
    } catch (error) {
      console.error('Error updating canEditSocials:', error);
    }
  }
});


document.getElementById('createAdminBtn').addEventListener('click', async () => {
  console.log("Admin Phone Number: +" + document.getElementById('adminPhoneNumberCountryCode').value.trim() + document.getElementById('adminPhoneNumber').value.trim());
  const email = document.getElementById('adminEmail').value.trim();
  const adminPhoneNumberCountryCode = document.getElementById('adminPhoneNumberCountryCode').value.trim();
  const adminPhoneNumber = document.getElementById('adminPhoneNumber').value.trim();
  const password = document.getElementById('adminPassword').value;
  const canEditPayments = document.getElementById('canEditPayments').checked;
  const canEditSocials = document.getElementById('canEditSocials').checked;

  onAuthStateChanged(auth, async (user) => 
    {
    console.log(user);
    const hasPermission = await canEditElement(user.phoneNumber, "isSuperAdmin");
    
    if (user) {
      try {
        if (!hasPermission) {
          alert("You do not have permission to perform this function.");

        } else {
            if (!email || !adminPhoneNumberCountryCode || !adminPhoneNumber) {
              console.log(email);
              console.log("+" + adminPhoneNumberCountryCode + adminPhoneNumber);
              alert("Error: Fields not filled properly");
              return;
            }
          const adminFullPhoneNumber = "+" + adminPhoneNumberCountryCode + adminPhoneNumber;
          

          const adminDocRef = doc(db, "whitelistedAdmins", email);
          const adminDocSnap = await getDoc(adminDocRef);
          if (adminDocSnap.exists()) {
            console.log("Admin already exists in whitelistedAdmins.");
          }
          else {
            await setDoc(adminDocRef, {
              isSuperAdmin: false,
              phoneNumber: adminFullPhoneNumber,
              canEditSocials: canEditSocials,
              canEditPayments: canEditPayments
            });

            try {
              const userCredential = await createUserWithEmailAndPassword(auth, email, password);
              //const user = userCredential.user;
              console.log('User created:', userCredential.user);
              alert('Admin created successfully. Please relogin to add first time admin account');
              window.location.href = "adminLogin.html";

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
          }
          console.log(hasPermission);
          } catch (error) {
          console.error('Error checking permissions:', error);
          }
        }
        });

        document.getElementById('adminEmail').value = '';
        document.getElementById('adminPhoneNumberCountryCode').value = '';
        document.getElementById('adminPhoneNumber').value = '';
        document.getElementById('adminPassword').value = '';
        document.getElementById('canEditSocials').checked = false;
        document.getElementById('canEditPayments').checked = false;

      });

      // Populate the adminDropDown with documents within whitelistedAdmins that contain the field isSuperAdmin = false
      const adminDropDown = document.getElementById('adminDropDown');
      const adminDropDown2 = document.getElementById('adminDropDown2');

      async function populateAdminDropDown() {
        // Clear existing options to prevent duplicates
        adminDropDown.innerHTML = '';
        adminDropDown2.innerHTML = '';

        // Add a "No option selected" option as the first option for both dropdowns
        const noOptionSelected1 = document.createElement('option');
        noOptionSelected1.value = '';
        noOptionSelected1.textContent = 'No Selection';
        adminDropDown.appendChild(noOptionSelected1);

        const noOptionSelected2 = document.createElement('option');
        noOptionSelected2.value = '';
        noOptionSelected2.textContent = 'No Selection';
        adminDropDown2.appendChild(noOptionSelected2);

        const querySnapshot = await getDocs(collection(db, "whitelistedAdmins"));
        querySnapshot.forEach((doc) => {
        if (doc.data().isSuperAdmin === false) {
          const option1 = document.createElement('option');
          option1.value = doc.id;
          option1.textContent = doc.id;
          adminDropDown.appendChild(option1);

          const option2 = document.createElement('option');
          option2.value = doc.id;
          option2.textContent = doc.id;
          adminDropDown2.appendChild(option2);
        }
        });
      }

async function deleteAdmin() {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      try {
        const hasPermission = await canEditElement(user.phoneNumber, "isSuperAdmin");
        if (!hasPermission) {
          alert("You do not have permission to perform this function.");

        } else {
          const selectedAdmin = adminDropDown.value;
          if (selectedAdmin === '') {
            alert('No selection has been made');
            return;
          }
          if (selectedAdmin) {
            try {
              await deleteDoc(doc(db, "whitelistedAdmins", selectedAdmin));
              alert('Admin deleted successfully');


                // Remove the deleted admin from adminDropDown
                const optionToRemove = adminDropDown.querySelector(`option[value="${selectedAdmin}"]`);
                if (optionToRemove) {
                  adminDropDown.removeChild(optionToRemove);
                }

                // Remove the deleted admin from adminDropDown2 if it is selected
                const optionToRemove2 = adminDropDown2.querySelector(`option[value="${selectedAdmin}"]`);
                if (optionToRemove2) {
                  adminDropDown2.removeChild(optionToRemove2);
                  permissionsContainer.innerHTML = ''; // Clear the permissions container
                }
            } catch (error) {
              console.error('Error deleting admin:', error);
              alert('Error deleting admin: ' + error.message);
            }
          } else {
            alert('Please select an admin to delete');
          }
        }
        console.log(hasPermission);
      } catch (error) {
        console.error('Error checking permissions:', error);
      }
    }
  });
}

async function getEmail(phoneNumber) {
  const querySnapshot = await getDocs(collection(db, "whitelistedAdmins"));
  let documentName = null;

  querySnapshot.forEach((doc) => {
    if (doc.data().phoneNumber === phoneNumber) {
      documentName = doc.id;
    }
  });
  //console.log(documentName);

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

async function getAdminPermissions() {
  const selectedAdmin = adminDropDown2.value;
  //console.log(adminDropDown2.value);

  const adminSnap = await getDoc(doc(db, "whitelistedAdmins", selectedAdmin));
  const data = adminSnap.data();

  const permissionsContainer = document.getElementById('permissionsContainer');

  permissionsContainer.innerHTML = ''; // Clear previous content

  const canEditSocialsCheckbox = document.createElement('input');
  canEditSocialsCheckbox.type = 'checkbox';
  canEditSocialsCheckbox.checked = data.canEditSocials;
  canEditSocialsCheckbox.style.transform = 'scale(1.5)';

  const canEditSocialsLabel = document.createElement('label');
  canEditSocialsLabel.textContent = 'Can Edit Socials';
  canEditSocialsLabel.appendChild(canEditSocialsCheckbox);

  const canEditPaymentsCheckbox = document.createElement('input');
  canEditPaymentsCheckbox.type = 'checkbox';
  canEditPaymentsCheckbox.checked = data.canEditPayments;
  canEditPaymentsCheckbox.style.transform = 'scale(1.5)';

  const canEditPaymentsLabel = document.createElement('label');
  canEditPaymentsLabel.textContent = 'Can Edit Payments';
  canEditPaymentsLabel.appendChild(canEditPaymentsCheckbox);

  permissionsContainer.appendChild(canEditSocialsLabel);
  permissionsContainer.appendChild(document.createElement('br')); // Line break
  permissionsContainer.appendChild(canEditPaymentsLabel);

}


populateAdminDropDown();