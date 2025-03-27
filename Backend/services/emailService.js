const { transporter }= require('../config/emailConfig.js');

const sendResetPasswordEmail = async (email, resetLink) => {
   
    const mailOptions = {
        from: process.env.EMAIL_SENDER_ACCOUNT,
        to: email,
        subject: 'Reset Your Password',
        text: `To reset your password, click this link: ${resetLink}. The link expires in 5 minutes.`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Reset password email sent');
    } catch (error) {
        console.error('Error sending reset password email:', error);
        throw new Error('Could not send email');
    }
};
module.exports = {sendResetPasswordEmail}
