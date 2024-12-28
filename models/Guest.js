const mongoose = require('mongoose');

const guestSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    contactNumber: {
        type: String,
        required: true
    },
    checkInDate: {
        type: Date,
        required: true
    },
    checkOutDate: {
        type: Date,
        required: true
    },
    identityProofUrl: {
        type: String,
        required: true
    },
    specialRequests: String,
    additionalGuests: [{
        firstName: String,
        lastName: String,
        contactNumber: String
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Guest', guestSchema); 