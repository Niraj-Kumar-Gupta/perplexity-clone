import React, { useState } from 'react';
import './SignupForm.css';
import useEmailVerify from '../../Hooks/useEmailVerify';
import usePhoneVerify from '../../Hooks/usePhoneVerify';
import useSendOTP from '../../Hooks/useSendOTP';
import useSignup from '../../Hooks/useSignup';
import useCheckEmailPhoneExist from '../../Hooks/useCheckEmaiPhoneExist';
import Signup from '../../Components/Signup/Signup';
import EmailOtpVerification from '../../Components/EmailOtpVerification/EmailOtpVerification';
import PhoneOtpVerification from '../../Components/PhoneOtpVerification/PhoneOtpVerification';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function SignupForm() {
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const [isOtpSentPage, setIsOtpSentPage] = useState(false);
  const [isPageVerified,setIsPageVerified]= useState(false)
 
  // ---- check email and phone already exist or not -----
  const {handleCheckEmailExist,handleCheckPhoneExist} = useCheckEmailPhoneExist();

  // --- generate otps (email and phone):----
  const {emaiLoading,emailOTPExpireTimer,handleEmailOtpSend} = useSendOTP();
  const {phoneLoading,phoneOTPExpireTimer,handlePhoneOtpSend} = useSendOTP();

  // --- verify email and phone otp ---
  const {isEmailVerified,errorEmailMessage,verifyEmailOtp} = useEmailVerify();
  const {isPhoneVerified,errorPhoneMessage,verifyPhoneOtp} = usePhoneVerify();
  
  //--- signup ------
  const { handleSignupSubmit} = useSignup();

  const handleProceed = async(event) =>{
    event.preventDefault();
    if(formData.password !== formData.confirmPassword){
       toast.error("The passwords do not match !!");
       return;
    }
    const isEmailExist = await handleCheckEmailExist(formData.email);
    if(isEmailExist) {toast.error('Email already exist'); return;}
    const isPhonelExist = await handleCheckPhoneExist(formData.phone);
    if(isPhonelExist) {toast.error('Phone Number already exist'); return;}
    
   if(!isEmailExist && !isPhonelExist){
    await handleEmailOtpSend(formData.email);
    setIsOtpSentPage(true);
   }else{
    return;
   }
  }

  const handleProceedNext = async(event)=>{
    event.preventDefault();
    await handlePhoneOtpSend(formData.phone);
    setIsPageVerified(true);
  }
 
  const handleFinalSubmit = async(event)=>{
    event.preventDefault();
    await handleSignupSubmit(formData,isEmailVerified,isPhoneVerified);
  }

  return (
    <>
      <div className="signup-card">
        <h2 className="title">Sign Up</h2>
        <p className="sub-title">Explore the dashboard world</p>

        {!isOtpSentPage ? (
           <Signup
             handleProceed = {handleProceed}
             formData={formData}
             setFormData={setFormData}
             emaiLoading={emaiLoading}
           />
        ) : (
          <div className="input-container">
            {!isPageVerified ? (
            <EmailOtpVerification
                 email = {formData.email}
                 emailOTPExpireTimer={emailOTPExpireTimer}
                 isEmailVerified={isEmailVerified}
                 verifyEmailOtp={verifyEmailOtp}
                 errorEmailMessage={errorEmailMessage}
                 handleProceedNext = {handleProceedNext}
                 handleEmailOtpSend={handleEmailOtpSend}
                 phoneLoading={phoneLoading}
               />
            ): (
              <PhoneOtpVerification
                 phone = {formData.phone}
                 phoneOTPExpireTimer={phoneOTPExpireTimer}
                 isPhoneVerified={isPhoneVerified}
                 verifyPhoneOtp={verifyPhoneOtp}
                 errorPhoneMessage={errorPhoneMessage}
                 handleFinalSubmit = {handleFinalSubmit}
                 handlePhoneOtpSend={handlePhoneOtpSend}
            />)}
          </div>
        )}
      </div>
    </>
  );
}

export default SignupForm;






