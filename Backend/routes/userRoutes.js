
const express = require('express');

const {
  sendEmailOtp,
  sendPhoneOtp,
  verifyEmailOtp,
  verifyPhoneOtp,
  checkEmailExist,
  checkPhoneExist,
  saveUser,
  login,
  resetPassword,
  updateResetPassword,
  auth,
  
} = require('../controllers/userController');

const chatController = require('../controllers/chatController');
const { googleAuth } = require('../controllers/googleAuthController');

const router = express.Router();



// -------------------------- Send Email OTP -------------------------

router.post('/send-email-otp', sendEmailOtp);


// -------------------------- Send Phone OTP -------------------------

router.post('/send-phone-otp', sendPhoneOtp);


// -------------------------- Verify Email and phone OTP -------------------------

router.post('/verify-email-otp', verifyEmailOtp);

router.post('/verify-phone-otp', verifyPhoneOtp);

// -------------------------- Verify Email and phone exist on db or not ------------------------
router.post('/verify-email-exist', checkEmailExist);

router.post('/verify-phone-exist', checkPhoneExist);



// -------------------------- Save User details---------------------------------
router.post('/save-user', saveUser);

router.post('/login',login);

// router.get('/auth/google',googleAuthCallback);

// router.get('/auth/google/callback',googleAuthCallback);

router.get('/auth-google',googleAuth)

router.post('/reset-password',resetPassword);

router.post('/update-password',updateResetPassword);

router.get('/verify-token',auth);

// -------------------------- generative ai chats---------------------------------

router.post('/initialize', chatController.initializeChat);
router.get('/message', chatController.handleMessage);
router.get('/history/:chatId', chatController.getChatHistory); 
router.get('/list/:userId', chatController.getChatList);  
router.delete('/:chatId', chatController.deleteChat);

// New routes for handling large messages
router.post('/message-session', chatController.createMessageSession);
router.get('/message-stream/:sessionId', chatController.streamMessageResponse);

module.exports = router;
