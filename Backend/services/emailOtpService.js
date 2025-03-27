const { transporter }= require('../config/emailConfig.js');

const emailOtpSender = async(email,emailOtp)=>{

    const mailOptions = {
        from: 'placementttt576567@gmail.com',
        to: email,
        subject: 'Your Email Verification OTP Code',
        text: `Your one-time verification code is: ${emailOtp}. Please type this code in your app to complete the verification.`,
      };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email Verification OTP Code sent');
    } catch (error) {
        console.error('Error sending Email Verification OTP Code:', error);
        throw new Error('Could not send Email Verification OTP Code');
    }
}
module.exports = { emailOtpSender };