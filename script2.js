import { auth, db, collection, addDoc, doc, setDoc } from "./firebase.js";

document.addEventListener("DOMContentLoaded", function() {
    const addToFavoritesBtn = document.getElementById("add-to-favorites");

    if (addToFavoritesBtn) {
        addToFavoritesBtn.addEventListener("click", async () => {
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
                await setDoc(userFavoritesRef, {
                    favorites: {
                        [bookId]: { title, author, imageUrl }
                    }
                }, { merge: true });

                alert("Book added to favorites!");
            } catch (error) {
                console.error("Error adding favorite:", error);
            }
        });
    }
});
