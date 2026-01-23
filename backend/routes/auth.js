const express = require('express');
const router = express.Router();

// Mock User Database
const users = [  //Demo accounts
    {
        id: '1',
        fullName: 'Admin User',
        email: 'admin@example.com',
        password: 'password', 
        role: 'admin',
        hasVoted: false
    },
    {
    id: '2',
    fullName: 'Demo Voter',
    email: 'voter@example.com',
    password: 'password',
    role: 'voter',
    hasVoted: false
    }
];

/**
 * POST /auth/register
 * Register a new user
 */
router.post('/register', (req, res) => {
    const { fullName, email, password, role } = req.body;

    if (!fullName || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    if (users.find(u => u.email === email)) {
        return res.status(400).json({ message: 'User already exists' });
    }

    const newUser = {
        id: Date.now().toString(),
        fullName,
        email,
        password,
        role: role || 'voter',
        hasVoted: false
    };

    users.push(newUser);

    const { password: _, ...userWithoutPassword } = newUser;
    res.status(201).json({ message: 'Registration successful', user: userWithoutPassword });
});

/**
 * POST /auth/login
 * Log in an existing user
 */
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    const { password: _, ...userWithoutPassword } = user;
    res.json({ 
        message: 'Login successful', 
        user: userWithoutPassword,
        token: 'mock-jwt-token-' + user.id 
    });
});

module.exports = router;
