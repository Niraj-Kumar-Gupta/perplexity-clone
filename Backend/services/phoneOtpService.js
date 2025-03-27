const client = require('../config/phoneConfig.js');

const phoneOtpSender = async(phone,phoneOtp)=>{
    
    try {
        await client.messages.create({
            body: `Your one-time verification code is: ${phoneOtp}. Please type this code in your app to complete the verification.`,
            from: process.env.TWILIO_PHONE_NO,
            to: `+91 ${phone}`,
          });
        
        console.log('phone Verification OTP Code sent');
    } catch (error) {
        console.error('Error sending phone Verification OTP Code:', error);
        throw new Error('Could not send phone Verification OTP Code');
    }
}
module.exports = { phoneOtpSender };