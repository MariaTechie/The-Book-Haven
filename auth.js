import { auth, provider, signInWithPopup, signOut } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const loginBtn = document.getElementById("google-login");
const logoutBtn = document.getElementById("google-logout");
const userInfo = document.getElementById("user-info");

// Handle login
loginBtn.addEventListener("click", () => {
  console.log("Login button clicked");
  signInWithPopup(auth, provider)
    .then((result) => {
      const user = result.user;
      console.log("User signed in:", user);
    })
    .catch((error) => console.error("Error signing in:", error));
});

// Handle logout
logoutBtn.addEventListener("click", () => {
  signOut(auth)
    .then(() => console.log("User signed out"))
    .catch((error) => console.error("Error signing out:", error));
});

// Monitor auth state
onAuthStateChanged(auth, (user) => {
  if (user) {
    userInfo.textContent = `Hello, ${user.displayName}`;
    loginBtn.style.display = "none";
    logoutBtn.style.display = "block";
  } else {
    userInfo.textContent = "";
    loginBtn.style.display = "block";
    logoutBtn.style.display = "none";
  }
});
