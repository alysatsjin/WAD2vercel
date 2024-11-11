import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getFirestore, collection, addDoc, setDoc, doc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-storage.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBQuzhT9kh6CvwzIE-diZ21XzKB8N_Ypz8",
    authDomain: "wad2-3b994.firebaseapp.com",
    databaseURL: "https://wad2-3b994-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "wad2-3b994",
    storageBucket: "wad2-3b994.firebasestorage.app",
    messagingSenderId: "841306816388",
    appId: "1:841306816388:web:1e089a4bdb598e5d7227d1"
};

// Initialize Firebase
const app1 = initializeApp(firebaseConfig);
const auth = getAuth(app1);
const db = getFirestore(app1);
const storage = getStorage(app1);


// LOGIN FUNCTION
const login = document.getElementById('loginBtn')
if (login) {

    login.addEventListener('click', function (event) {
        event.preventDefault()

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        //sign in function
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                showFloatingAlert('Successfully logged in')
                sessionStorage.setItem('userId', user.uid)
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                // alert(errorCode)
                switch (errorCode) {
                    case 'auth/user-not-found':
                        showFloatingAlert('No user found with this email address.', 'danger');
                        break;
                    case 'auth/wrong-password':
                        showFloatingAlert('Incorrect password. Please try again.', 'danger');
                        break;
                    case 'auth/user-disabled':
                        showFloatingAlert('This account has been disabled. Please contact support.', 'danger');
                        break;
                    case 'auth/invalid-email':
                        showFloatingAlert('Please enter a valid email address.', 'danger');
                        break;
                    case 'auth/too-many-requests':
                        showFloatingAlert('Too many requests. Please try again later.', 'danger');
                        break;
                    case 'auth/network-request-failed':
                        showFloatingAlert('Network error. Please check your connection and try again.', 'danger');
                        break;
                    //     // Add additional cases as needed
                    default:
                        showFloatingAlert('Failed to log in', 'danger'); // Generic error message
                }
            });

    })
}

// RESET PASSWORD FUNCTION
const ResetPassword = document.getElementById('SendEmail')

if (ResetPassword) {
    ResetPassword.addEventListener('click', function (event) {
        event.preventDefault()
        const email = document.getElementById('email').value
        console.log(email)
        sendPasswordResetEmail(auth, email)
            .then(() => {
                // alert('success')
                showFloatingAlert("An email has been sent", 'success', 'login.html')
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode)
                console.log(errorMessage)
            });
    })
}

// STATUS MESSAGE
function showFloatingAlert(message, type = 'success', redirectUrl = 'index.html', delay = 1000) {
    // Create the alert div
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible floating-alert fade`;
    alertDiv.role = 'alert';

    // Set the alert message with close button
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      `;

    // Append to alert container
    document.getElementById('alert-container').appendChild(alertDiv);

    // Show the alert by adding 'show' class after a brief delay
    setTimeout(() => alertDiv.classList.add('show'), 10);

    // Remove the alert after a specified delay
    setTimeout(() => {
        alertDiv.classList.remove('show');
        alertDiv.addEventListener('transitionend', () => alertDiv.remove());
    }, delay + 1500); // Delay plus the fade out time
    if (type == 'success') {
        setTimeout(() => {
            window.location.href = redirectUrl;
        }, delay);
    }
}

// REGISTRATION FUNCTION
const register = document.getElementById('RegisterBtn')
if (register) {
    register.addEventListener("click", async (event) => {
        event.preventDefault();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const username = document.getElementById("username").value;
        //get image object from input
        const profilePictureFile = document.getElementById("profilePicture").files[0];

        if (email && password && username && profilePictureFile) {
            await registerUser(email, password, username, profilePictureFile);
        } else {
            alert("Please fill out all fields and select a profile picture.");
        }
    });
}
// Function to create a new user with Authentication and store profile data in Firestore
async function registerUser(email, password, username, profilePictureFile) {
    try {
        // Step 1: Create user in Firebase Authentication
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        sessionStorage['userId'] = user.uid;
        // Step 2: Upload profile picture to Firebase Storage and get its URL
        let profilePictureURL = "";
        if (profilePictureFile) {
            profilePictureURL = await uploadImage("profilePictures",profilePictureFile);
        }

        // Step 3: Save user data in Firestore
        await setDoc(doc(db, "Users", user.uid), {
            email: email,
            username: username,
            profilepicture: profilePictureURL,
            password: password,
            bookings: [],
            listings: [],
            reviews: [],
            cart: []
        });

        console.log("User account created and profile saved in Firestore.");
        showFloatingAlert('Successfully signed up')
    } catch (error) {

        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
        switch (errorCode) {
            case 'auth/email-already-in-use':
                showFloatingAlert('This email address is already in use.', 'danger');

                break;
            case 'auth/invalid-email':
                showFloatingAlert('The email address is not valid.', 'danger');
                break;
            case 'auth/weak-password':
                showFloatingAlert('The password is too weak. It must be at least 6 characters long.', 'danger');
                break;
            case 'auth/missing-email':
                showFloatingAlert('An email address must be provided.', 'danger');
                break;

            // Add additional cases as needed
            default:
                console.log(errorMessage)
                showFloatingAlert('Failed to sign up', 'danger'); // Generic error message
        }


    }
}


async function uploadImage(path,file) {
    const storageRef = ref(storage, `${path}/${file.name}`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
}
