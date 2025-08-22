// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getDatabase } from "firebase/database";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//     apiKey: "AIzaSyBimjWCzIJRBiHD_nlxjJ9Tnr7aDgeYoIk",
//     authDomain: "move-on-landing-page.firebaseapp.com",
//     projectId: "move-on-landing-page",
//     storageBucket: "move-on-landing-page.firebasestorage.app",
//     messagingSenderId: "309983206063",
//     appId: "1:309983206063:web:03b106dae276efcf89125a",
//     measurementId: "G-4M3KDCJBG0",
//     databaseURL: "https://move-on-landing-page-default-rtdb.firebaseio.com/"
// };


// // Initialize Firebase
// const app = initializeApp(firebaseConfig);

// // // Initialize Realtime Database and get a reference to the service
// const database = getDatabase(app);

// function writeUserData(userId, name, email){
//     const reference = ref(database, "users/" + userId);
    
//     set(reference, {
//         fullName: name,
//         uOttawaEmail: email,
//     });
// }

// writeUserData("1", "Fiona", "e@e.co");

const fullName = document.getElementById('fullName');
const fullNameError = document.getElementById('fullNameError');

const uOttawaEmail = document.getElementById('uOttawaEmail');
const uOttawaEmailError = document.getElementById('uOttawaEmailError');

const form = document.querySelector("form");

function validateName() {
    const expression = /^[a-zzA-Z ]+$/;
    if (fullName.value.trim() === '') {
        fullNameError.textContent = "Field cannot be empty";
        fullName.classList.add("errorField");
        return false;
    } else if (!expression.test(fullName.value.trim())) {
        fullNameError.textContent = "Name is not valid";
        fullName.classList.add("errorField");
        return false;
    } else {
        fullNameError.textContent = "";
        fullName.classList.remove("errorField");
        return true;
    }
}

function validateEmail() {
    const expression = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (uOttawaEmail.value.trim() === '') {
        uOttawaEmailError.textContent = "Field cannot be empty";
        uOttawaEmail.classList.add("errorField");
        return false;
    } else if (!expression.test(uOttawaEmail.value.trim())) {
        uOttawaEmailError.textContent = "Email is not valid";
        uOttawaEmail.classList.add("errorField");
        return false;
    } else {
        uOttawaEmailError.textContent = "";
        uOttawaEmail.classList.remove("errorField");
        return true;
    }
}

function validate() {
    const emailValid = validateEmail();
    const nameValid = validateName();
    return emailValid && nameValid;
}


fullName.addEventListener("focusout", validateName);
uOttawaEmail.addEventListener("focusout", validateEmail);


form.addEventListener("submit", function(e) {
    if (!validate()) {
        e.preventDefault();
    }
});