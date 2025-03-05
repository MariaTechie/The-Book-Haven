import { auth, provider, signInWithPopup, signOut } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const loginBtn = document.getElementById("user-login");
const logoutBtn = document.getElementById("user-logout");
const userInfo = document.getElementById("user-info");

// Handle login
loginBtn.addEventListener("click", () => {
  console.log("Login button clicked");
  
  // Disable button to prevent multiple clicks
  loginBtn.disabled = true;

  // Create a new window with about:blank to prevent popup blocking
  const loginWindow = window.open("", "_blank");

  signInWithPopup(auth, provider)
    .then((result) => {
      loginWindow.location.href = "https://mariatechie.github.io/The-Book-Haven/"; // 🔹 Replace with your actual website URL
      console.log("User signed in:", result.user);
    })
    .catch((error) => {
      loginWindow.close(); // Close the blank window if there's an error
      console.error("Error signing in:", error);
    })
    .finally(() => {
      loginBtn.disabled = false; // Re-enable the button
    });
});

// Handle logout
logoutBtn.addEventListener("click", async () => {
  try {
    await signOut(auth);
    console.log("User signed out");
  } catch (error) {
    console.error("Error signing out:", error);
  }
});

// Monitor auth state
onAuthStateChanged(auth, (user) => {
    const loginIcon = document.getElementById("user-login");
    const logoutIcon = document.getElementById("user-logout");
    const userInfo = document.getElementById("user-info");
  
    if (user) {
      userInfo.textContent = `Hello, ${user.displayName}`;
      loginIcon.style.display = "none";  // Hide login icon
      logoutIcon.style.display = "inline-block";  // Show logout icon
    } else {
      userInfo.textContent = "";
      loginIcon.style.display = "inline-block";  // Show login icon
      logoutIcon.style.display = "none";  // Hide logout icon
    }
  });
  
  
