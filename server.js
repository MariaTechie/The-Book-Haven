const express = require("express");
const bodyParser = require("body-parser");
const { OAuth2Client } = require("google-auth-library");

const app = express();
const port = 3000;
app.get('/favicon.ico', (req, res) => res.status(204));

app.use(bodyParser.json());

// Serve static files (like your HTML page) from the web folder (the frontend and th server.js are in th same folder)
app.use(express.static("."));

const CLIENT_ID = "332987277419-cmjp52ed9r9tbbj501ub5uva05b4btmf.apps.googleusercontent.com";  // Client ID
const client = new OAuth2Client(CLIENT_ID);

// Google Login Route
app.post("/login", async (req, res) => {
    const { token } = req.body;

    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const userId = payload["sub"];

        res.json({ message: "User authenticated", user: payload });
    } catch (error) {
        res.status(400).json({ error: "Invalid token" });
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
