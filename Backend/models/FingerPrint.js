const mongoose = require('mongoose');

const fingerprintSchema = new mongoose.Schema({
    email: { type: String, required: true, index: true }, 
    webAuthnUserID: { type: String, required: true , index: true,}, // Unique ID for the registered fingerprint
    id: { type: String, required: true },           // ID of the registered fingerprint
    publicKey: { type: String,  required: true },   // Public key of the fingerprint
    counter: { type: Number, required: true, default: 0 },        // Counter to prevent replay attacks
    transports: { type: [String] },   // Transport types (e.g., "usb", "nfc")
    deviceType: { type: String },                 // Device type (e.g., mobile, desktop)
    backedUp: { type: Boolean, default: false },  // Whether the credential is backed up
                
}, { _id: false }); 


module.exports = fingerprintSchema;



