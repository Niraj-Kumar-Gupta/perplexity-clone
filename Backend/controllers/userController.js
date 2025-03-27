const {User,EmailOtp, PhoneOtp} = require('../models/User');
const { sendResetPasswordEmail } = require ('../services/emailService.js');
const { emailOtpSender } = require ('../services/emailOtpService.js');
const { phoneOtpSender } = require('../services/phoneOtpService.js');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


// -------------------------- Send email OTPs ---------------------------------
const sendEmailOtp = async (req, res) => {
  const { email } = req.body;
  
  const emailOtp = Math.floor(100000 + Math.random() * 900000); 
  const expirationTime = Date.now() + 60 * 1000; 


  try {
    const hashEmailOtp =  await bcrypt.hash(emailOtp.toString(),10);
    const emailExist = await EmailOtp.findOne({email});
    
    if(emailExist){
      await EmailOtp.updateOne(
        { _id: emailExist._id },
        { emailOtp: hashEmailOtp, expirationTime: expirationTime }
      );
    }
    else{
      const newOtp = new EmailOtp({
        email,
        emailOtp: hashEmailOtp,
        expirationTime
      });

      await newOtp.save();
    }

    await emailOtpSender(email,emailOtp);

    return res.status(200).json({ success: true, message: 'Email OTP sent successfully' });
  } catch (error) {
    console.error('Error sending email OTP:', error);
    return res.status(500).json({ success: false, message: 'Failed to send email OTP' });
  }
};

// -------------------------- Send Phone OTPs ---------------------------------
const sendPhoneOtp = async (req, res) => {
  const { phone } = req.body;
  const phoneOtp = Math.floor(100000 + Math.random() * 900000); 
  const expirationTime = Date.now() + 60 * 1000; 

  try {
    const hashPhonelOtp = await bcrypt.hash(phoneOtp.toString(),10);
     const phoneExist = await PhoneOtp.findOne({phone});
    if(phoneExist){
      await PhoneOtp.updateOne(
        { _id: phoneExist._id },
        { phoneOtp:hashPhonelOtp, expirationTime:expirationTime }
      );      
    }else{
    const newOtp = new PhoneOtp({
      phone,
      phoneOtp:hashPhonelOtp,
      expirationTime
    });

    await newOtp.save();
  }
 
    await phoneOtpSender(phone,phoneOtp);

    console.log('SMS sent:', phoneOtp);
    return res.status(200).json({ success: true, message: 'Phone OTP sent successfully' });
  } catch (error) {
    console.error('Error sending phone OTP:', error);
    return res.status(500).json({ success: false, message: 'Failed to send phone OTP' });
  }
};



//--------------------------- Verify Email OTP ---------------------------
const verifyEmailOtp = async (req, res) => {
  const { email, otpEmail } = req.body;
  
  const otpData = await EmailOtp.findOne({email});

  if (!otpData) {
    return res.json({ verified: false, message: 'No OTP found.' });
  }

  const { emailOtp, expirationTime } = otpData;
  
  if (Date.now() > expirationTime) {
    await otpData.deleteOne(); 
    return res.json({ verified: false, message: 'OTP expired.' });
  }

  
  const isValidOtp = await bcrypt.compare( otpEmail.toString(), emailOtp);
  
  if (isValidOtp) {
    await otpData.deleteOne(); 
    User.findOneAndUpdate({ email }, { emailVerified: true }, { new: true })
      .then(() => res.status(200).json({ verified: true  , message: 'Email Verified Sucessfully!'}))
      .catch(err => res.status(500).json({ verified: false }));
  } else {
    res.status(200).json({ verified: false , message: 'Incorrect OTP. Try again'});
  }
};


//--------------------------- Verify Phone OTP---------------------------
const verifyPhoneOtp = async(req, res) => {
  const { phone, otpPhone } = req.body;

  const otpData = await PhoneOtp.findOne({phone});
  if (!otpData) {
    return res.json({ verified: false, message: 'No OTP found.' });
  }

  const { phoneOtp, expirationTime } = otpData;

  if (Date.now() > expirationTime) {
    await otpData.deleteOne(); 
    return res.json({ verified: false, message: 'OTP expired.' });
  }

  const isValidOtp = await bcrypt.compare(otpPhone.toString(), phoneOtp);
  if (isValidOtp) {
    await otpData.deleteOne(); 
    User.findOneAndUpdate({ phone }, { phoneVerified: true }, { new: true })
      .then(() => res.status(200).json({ verified: true }))
      .catch(err => res.status(500).json({ verified: false }));
  } else {
    res.status(200).json({ verified: false ,message: 'Incorrect OTP. Try again'});
  }
};

// ------------------ check email and phone is exist on database or not -------------------
const checkEmailExist = async(req,res)=>{
  const {email} = req.body;
  try{
    const isExist = await User.findOne({email});
    if(isExist){
      return res.status(200).json({exist:true});
    }
    else{
      return res.status(200).json({exist:false});
    }
  }
  catch(error){
    return res.status(500).json({ error: 'An error occurred while checking email existence' });
  }
  
}


const checkPhoneExist = async(req,res)=>{
  const {phone} = req.body;
  try{
    const isExist = await User.findOne({phone});
    if(isExist){
      return res.status(200).json({exist:true});
    }
    else{
      return res.status(200).json({exist:false});
    }
  }
  catch(error){
    return res.status(500).json({ error: 'An error occurred while checking phone existence' });
  }
}


// ---------------------- sign and save User Details and token creation ---------------------------
const saveUser = async (req, res) => {
  const { name, email, phone, password } = req.body;
  const userAlreadyExist = await User.findOne({email});
  if(userAlreadyExist){
    return res.status(200).json({success: false, message: 'User already Exist!'})
  }
  const hashedPassword = await bcrypt.hash(password,10);

  try {
    const newUser = new User({
      name,
      email,
      phone,
      password:hashedPassword,
      emailVerified: true,
      phoneVerified: true,
    });

    await newUser.save();
    const token = jwt.sign(
      {
        userId: newUser._id,
        email: newUser.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    

    res.status(200).json({ success: true, message: 'User saved successfully!' ,token});
  } catch (error) {
    console.error('Error saving user:', error);
    res.status(500).json({ success: false, message: 'Error saving user details' });
  }
};

// ---------------------- Login & token creation--------------------------------------

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const newUser = await User.findOne({ email });
  
    if (!newUser) {
      return res.json({ success: false, message: "User not found." });
    }
    if (!newUser.password ) {
      return res.json({ success: false, message: "Incorrect password.." });
    }
    const isPasswordValid = await bcrypt.compare(password, newUser.password);
    if (!isPasswordValid) {
      return res.json({ success: false, message: "Incorrect password. Please try again." });
    }

    const token = jwt.sign(
      {
        userId: newUser._id,
        email: newUser.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({ success: true, message: 'Login successful', token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};


//---------------------reset password ------------------------------
const resetPassword = async(req,res)=>{
   const {email} = req.body;
   console.log(email);
   try{
    const isUser = await User.findOne({email});
    if(!isUser){
      return res.status(201).json({ success: false, message: "User doesn't exist!" });
    }
    
    const token = jwt.sign(
      { userId: isUser._id, email: isUser.email },
       process.env.JWT_SECRET,
       { expiresIn: '180s' }
    );
    
    const resetLink = `${process.env.CLIENT_URL}/auth/reset_password?token=${token}`;
    
    await sendResetPasswordEmail(email,resetLink);
    
    res.status(200).json({ success:true, message:"Reset Link send to email!"});
   }catch(error){
    console.error("Error resetting password:", error);
    res.status(500).json({ success:false, message:"Internal server error"})
   }
}

///---------------update reset passwprd -----------------
const updateResetPassword = async (req, res) => {
  const { user, password } = req.body;
  if (!user || !password) {
    return res.status(400).json({ success: false, message: "User ID and password are required" });
  }

  try {
    const usr = await User.findById(user);
    if (!usr) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    usr.password = hashedPassword;
    await usr.save();
    console.log("password reset successfully")
    res.status(200).json({ success: true, message: "Password has been reset successfully!" });

  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ success: false, message: "Internal Server Error. Please try again later." });
  }
};

// ---------------------- authorization and token validation (middle ware)---------------------------

const auth = async(req, res) => {
  const authHeader = req.headers.authorization;
  
  if (authHeader) {
    const token = authHeader.split(' ')[1]; 
    try {
      const decorded = jwt.verify(token, process.env.JWT_SECRET);
      const userDetails = await User.findOne({email:decorded.email});
      if(!userDetails){
        return res.status(401).json({
          success: false,
          message: 'Token expired, please try again.',
        });
      }
      
      return res.status(200).json({
        success: true,
        userDetails: {
          userId: userDetails._id,
          fingerprintsLength: userDetails.fingerprints.length
      }
      });
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Token expired, please try again.',
        });
      } else {
        return res.status(403).json({
          success: false,
          message: 'Invalid token, authorization denied.',
        });
      }
    }
  } else {
    return res.status(401).json({
      success: false,
      message: 'Authorization token missing.',
    });
  }
};

module.exports = {
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
};



