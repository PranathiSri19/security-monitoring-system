const express = require('express');

const router = express.Router();

// Dummy user credentials
const users = {
    admin: "password123",
    user: "userpass",
};

router.post('/', (req, res) => {
    const { username, password } = req.body;

    if (users[username] && users[username] === password) {
        console.log(`✅ User '${username}' logged in successfully.`);
        res.json({ message: 'Login successful!' });
    } else {
        console.warn(`❌ Failed login attempt for user: '${username}'.`);
        res.status(401).json({ error: 'Invalid credentials' });
    }
});

module.exports = router;
