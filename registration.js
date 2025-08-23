const firstName = document.getElementById('firstName');
const firstNameError = document.getElementById('firstNameError');

const uOttawaEmail = document.getElementById('uOttawaEmail');
const uOttawaEmailError = document.getElementById('uOttawaEmailError');

const profileForm = document.getElementById("profileForm");
const loadingOverlay = document.getElementById("loadingOverlay");

const personality = localStorage.getItem("userPersonality");
console.log(personality);

function validateName() {
    const expression = /^[a-zA-Z ]+$/;
    if (firstName.value.trim() === '') {
        firstNameError.textContent = "Field cannot be empty";
        firstName.classList.add("errorField");
        return false;
    } else if (!expression.test(firstName.value.trim())) {
        firstNameError.textContent = "Name is not valid";
        firstName.classList.add("errorField");
        return false;
    } else {
        firstNameError.textContent = "";
        firstName.classList.remove("errorField");
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


firstName.addEventListener("focusout", validateName);
uOttawaEmail.addEventListener("focusout", validateEmail);


const otpPopup = document.getElementById("pageThree");
const backBtn = document.getElementById("backBtn");
const otpCard = document.querySelector("#pageThree .container");

profileForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!validate()) return;

  loadingOverlay.style.display = "flex"; // show overlay

  try {
    const res = await fetch("/.netlify/functions/sendOTP", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "send", email: uOttawaEmail.value })
    });
    const data = await res.json();

    loadingOverlay.style.display = "none"; // hide overlay

    if (data.success) {
      otpPopup.style.display = "flex";
      requestAnimationFrame(() => otpPopup.classList.add("show"));
    } else {
      showErrorCard("Failed to send OTP");
    }
  } catch (err) {
    loadingOverlay.style.display = "none"; // hide overlay
    showErrorCard("Error sending OTP");
    console.error(err);
  }
});


const inputs = document.querySelectorAll("#otpForm input");
const verifyBtn = document.getElementById("verifyBtn");

// auto-move focus and enable next input
inputs.forEach((input, index1) => {
  input.addEventListener("keyup", (e) => {
    const currentInput = input,
      nextInput = input.nextElementSibling,
      prevInput = input.previousElementSibling;

    if (currentInput.value.length > 1) {
      currentInput.value = "";
      return;
    }

    if (nextInput && nextInput.hasAttribute("disabled") && currentInput.value !== "") {
      nextInput.removeAttribute("disabled");
      nextInput.focus();
    }

    if (e.key === "Backspace") {
      inputs.forEach((input, index2) => {
        if (index1 <= index2 && prevInput) {
          input.setAttribute("disabled", true);
          input.value = "";
          prevInput.focus();
        }
      });
    }

    if (!inputs[3].disabled && inputs[3].value !== "") {
      verifyBtn.classList.add("active");
      return;
    }
    verifyBtn.classList.remove("active");
  });
});

// auto-click when all inputs filled
inputs.forEach((input) => {
  input.addEventListener("input", () => {
    const allFilled = Array.from(inputs).every(i => i.value !== "");
    if (allFilled) {
      verifyOTP(); // call verification function directly
    }
  });
});

verifyBtn.addEventListener("click", async () => {
    // Add spinner inside button
    verifyBtn.innerHTML = `Resend OTP&nbsp;<i class="fa-solid fa-rotate-right fa-spin"></i>`;
    verifyBtn.disabled = true; // optional: prevent double clicks

    try {
        const res = await fetch("/.netlify/functions/sendOTP", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "send", email: uOttawaEmail.value })
        });
        const data = await res.json();

        if (data.success) {
            showNotification("success", "Another OTP has been sent!");
        } else {
            showNotification("error", "Failed to resend OTP");
        }
    } catch (err) {
        showNotification("error", "Error resending OTP");
        console.error(err);
    } finally {
        // Restore original button text and enable button
        verifyBtn.innerHTML = "Resend OTP";
        verifyBtn.disabled = false;
    }
});

backBtn.addEventListener("click", () => {
  otpPopup.classList.remove("show");
  otpPopup.addEventListener("transitionend", function handler(ev){
    if (ev.target === otpCard && ev.propertyName === "transform") {
      otpPopup.style.display = "none";
      otpPopup.removeEventListener("transitionend", handler);
    }
  });
});

//focus the first input which index is 0 on window load
window.addEventListener("load", () => inputs[0].focus());

async function verifyOTP() {
    const enteredOtp = Array.from(inputs).map(i => i.value).join("");
    try {
        const res = await fetch("/.netlify/functions/sendOTP", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "verify", email: uOttawaEmail.value, otp: enteredOtp })
        });
        const data = await res.json();
        if (data.verified) {
          await submitDataToBasin();
          window.location.href = "/success.html";
        } else {
          showNotification("error", "OTP does not match");
        }
    } catch (err) {
      showErrorCard("Error verifying OTP");
      console.error(err);
    }
}


async function submitDataToBasin() {
    const formData = new FormData();
    formData.append("firstName", firstName.value);
    const preferredName = document.querySelector("input[name='preferredName']").value;
    formData.append("preferredName", preferredName);
    const lastName = document.querySelector("input[name='lastName']").value;
    formData.append("lastName", lastName);
    formData.append("uOttawaEmail", uOttawaEmail.value);
    const bio = document.querySelector("textarea[name='bio']").value;
    formData.append("bio", bio);
    formData.append("personality", personality);

    try {
        const res = await fetch("https://usebasin.com/f/48434ad4fbe7", {
            method: "POST",
            body: formData
        });
        if (!res.ok) throw new Error("Failed to submit profile to Basin");
    } catch (err) {
        console.error("Basin submission error:", err);
        showNotification("Failed to submit profile. Try again.");
        throw err; // stop redirect if submission fails
    }
}

function showNotification(type, message) {
    const card = document.getElementById("notificationCard");
    const pic = document.getElementById("notificationPic");
    const msg = document.getElementById("notificationMessage");

    if (type === "error") {
        pic.src = "assets/pics/Question.png";
    } else if (type === "success") {
        pic.src = "assets/pics/Message Sent 1.png";
    }

    msg.textContent = message;
    card.style.display = "flex";  // ensure it's visible
    requestAnimationFrame(() => card.classList.add("show")); // animate in
}


const notificationCard = document.getElementById("notificationCard");
const notificationCloseBtn = document.getElementById("notificationCloseBtn");

notificationCloseBtn.addEventListener("click", () => {
    notificationCard.classList.remove("show");
    setTimeout(() => notificationCard.style.display = "none", 350);
});
