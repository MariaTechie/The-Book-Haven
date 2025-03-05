import { auth, db, doc, setDoc, getDoc } from "./firebase.js";

document.addEventListener("DOMContentLoaded", function () {
    setTimeout(() => {  // ✅ Wait to ensure the button is in the DOM
        const favoriteButton = document.getElementById("add-to-favorites");

        if (!favoriteButton) {
            console.error("❌ Favorite button not found in DOM");
            return;
        }

        favoriteButton.addEventListener("click", async function () {
            const user = auth.currentUser;

            if (!user) {
                alert("Please sign in to save favorites!");
                return;
            }

            const bookId = new URLSearchParams(window.location.search).get("id");
            const title = document.querySelector("h2").innerText;
            const author = document.querySelector("h3").innerText;
            const imageUrl = document.querySelector(".book-card img").src;

            try {
                const userFavoritesRef = doc(db, "users", user.uid);
                const docSnap = await getDoc(userFavoritesRef);

                let favorites = {};
                if (docSnap.exists()) {
                    favorites = docSnap.data().favorites || {};
                }

                favorites[bookId] = { title, author, imageUrl };

                await setDoc(userFavoritesRef, { favorites }, { merge: true });

                alert("✅ Book added to favorites!");
            } catch (error) {
                console.error("❌ Error adding favorite:", error);
            }
        });

        console.log("✅ Favorite button event listener added");
    }, 1000);  // ✅ Small delay to ensure button is loaded
});
