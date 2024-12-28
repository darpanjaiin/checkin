const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Host = require('../models/Host');
const auth = require('../middleware/auth');

// Register Host
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if host exists
        let host = await Host.findOne({ email });
        if (host) {
            return res.status(400).json({ msg: 'Host already exists' });
        }

        // Create new host
        host = new Host({
            name,
            email,
            password
        });

        // Hash password
        const salt = await bcrypt.genSalt(10);
        host.password = await bcrypt.hash(password, salt);

        await host.save();

        // Create JWT
        const payload = {
            host: {
                id: host.id
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '24h' },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Login Host
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if host exists
        let host = await Host.findOne({ email });
        if (!host) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, host.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Create JWT
        const payload = {
            host: {
                id: host.id
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '24h' },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Get profile
router.get('/profile', auth, async (req, res) => {
    try {
        const host = await Host.findById(req.host.id).select('-password');
        res.json(host);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Update profile
router.put('/profile', auth, async (req, res) => {
    try {
        const host = await Host.findById(req.host.id);
        if (!host) {
            return res.status(404).json({ msg: 'Host not found' });
        }

        host.name = req.body.name || host.name;
        await host.save();

        res.json(host);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Update password
router.put('/password', auth, async (req, res) => {
    try {
        const host = await Host.findById(req.host.id);
        if (!host) {
            return res.status(404).json({ msg: 'Host not found' });
        }

        const { currentPassword, newPassword } = req.body;

        // Verify current password
        const isMatch = await bcrypt.compare(currentPassword, host.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Current password is incorrect' });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        host.password = await bcrypt.hash(newPassword, salt);
        await host.save();

        res.json({ msg: 'Password updated successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Delete account
router.delete('/profile', auth, async (req, res) => {
    try {
        await Host.findByIdAndDelete(req.host.id);
        res.json({ msg: 'Account deleted successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router; 