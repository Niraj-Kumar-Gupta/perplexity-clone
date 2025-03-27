const mongoose = require('mongoose');
const fingerprintSchema = require('./FingerPrint');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: Number ,default: undefined },
    password: { type: String },
    emailVerified: { type: Boolean, default: false },
    phoneVerified: { type: Boolean, default: false },
    fingerprints: [fingerprintSchema],
    
},  { timestamps: true });

const emailOtpSchema = new mongoose.Schema({
    email : {type:String,required:true},
    emailOtp: {type:String,require:true},
    expirationTime:{type:Number,required:true},
});

const phoneOtpSchema = new mongoose.Schema({
    phone : {type:Number,required:true},
    phoneOtp:{type:String,required:true},
    expirationTime:{type:Number,required:true},
})


const User = mongoose.model('User', userSchema);
const EmailOtp = mongoose.model('EmailOtp',emailOtpSchema);
const PhoneOtp = mongoose.model('PhoneOtp',phoneOtpSchema);

module.exports = { User, EmailOtp, PhoneOtp };
