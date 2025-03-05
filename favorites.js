import { auth, db, doc, getDoc } from "./firebase.js";

document.addEventListener("DOMContentLoaded", async function () {
    const user = auth.currentUser;
    if (!user) {
        document.getElementById("favorites-list").innerHTML = "<p>Please log in to see your favorites.</p>";
        return;
    }

    const userFavoritesRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(userFavoritesRef);

    if (docSnap.exists()) {
        const favorites = docSnap.data().favorites;
        let html = "";
        Object.keys(favorites).forEach(bookId => {
            const book = favorites[bookId];
            html += `
                <div class="book-card">
                    <img src="${book.imageUrl}" alt="${book.title}" />
                    <h2>${book.title}</h2>
                    <h3>${book.author}</h3>
                    <a href="book.html?id=${bookId}">View Details</a>
                </div>
            `;
        });
        document.getElementById("favorites-list").innerHTML = html;
    } else {
        document.getElementById("favorites-list").innerHTML = "<p>No favorites yet!</p>";
    }
});
