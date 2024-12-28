const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const auth = require('../middleware/auth');
const Guest = require('../models/Guest');

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function(req, file, cb) {
        cb(null, 'ID-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 10000000 }, // 10MB limit
    fileFilter: function(req, file, cb) {
        checkFileType(file, cb);
    }
});

// Check file type
function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png|pdf/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images and PDFs Only!');
    }
}

// Submit guest check-in
router.post('/', upload.single('identityProof'), async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            contactNumber,
            checkInDate,
            checkOutDate,
            specialRequests,
            additionalGuests
        } = req.body;

        const newGuest = new Guest({
            firstName,
            lastName,
            contactNumber,
            checkInDate,
            checkOutDate,
            identityProofUrl: `/uploads/${req.file.filename}`,
            specialRequests,
            additionalGuests: JSON.parse(additionalGuests || '[]')
        });

        const guest = await newGuest.save();
        res.json(guest);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Get all guests (protected route)
router.get('/', auth, async (req, res) => {
    try {
        const guests = await Guest.find().sort({ createdAt: -1 });
        res.json(guests);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router; 