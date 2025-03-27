import styles from './EmailOtpVerification.module.css';
import React, { useState, useRef, useEffect } from 'react';
import { MdMarkEmailRead, MdVerified } from "react-icons/md";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function EmailOtpVerification({
  email, 
  emailOTPExpireTimer, 
  isEmailVerified, 
  verifyEmailOtp, 
  errorEmailMessage, 
  handleProceedNext,
  handleEmailOtpSend,
  phoneLoading
}) {
  const [otp, setOtp] = useState(Array(6).fill(''));
  const [isInvalidOtp, setIsInvalidOtp] = useState(false); 
  const inputRefs = useRef([]);

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (isNaN(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value !== '' && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleClickedVerify = async (e) => {
    const userOtpEmail = otp.join('');
    if (userOtpEmail.length === 6 && userOtpEmail.match(/^\d{6}$/)) {
      await verifyEmailOtp(email,userOtpEmail);   
    } else {
      toast.error('Please enter a valid 6-digit OTP');
    }
  };

  useEffect(()=>{
    if (errorEmailMessage) {
      setIsInvalidOtp(true);
      // toast.error(errorEmailMessage);
      setTimeout(() => {
        setIsInvalidOtp(false);
        setOtp(Array(6).fill(''));
      }, 400);
    }
  },[errorEmailMessage])

  return (
    <>
      <div>
        <MdMarkEmailRead className={styles.optIcon} />
        <div className={styles.textContainer}>
          <h3>Please check your email</h3>
          <p>We've sent a code to {email}</p>
        </div>

        <div className={styles.otpBoxContainer}>
          {otp.map((_, index) => (
            <input
              key={index}
              type="text"
              value={otp[index]}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              maxLength="1"
              ref={(el) => (inputRefs.current[index] = el)}
              className={`${styles.otpInputBar} ${isInvalidOtp ? styles.shake : ''}`} 
              disabled={isEmailVerified}
            />
          ))}
        </div>

        <p className={styles.resend } disabled={isEmailVerified}>
           Didn't get the code?{' '}
            <span 
                onClick={() => {
                if (emailOTPExpireTimer <= 0 && email && !isEmailVerified) {
                    handleEmailOtpSend(email);
                  }
                }}
                className={emailOTPExpireTimer > 0 ? styles.textLight : styles.textDark}
               >
                Click to Resend
            </span>
        </p>

        <div className={styles.btnsContainer}>
          <div className={styles.btnsBox}>
            
            {isEmailVerified ?(
              <button className={styles.btns} onClick={handleProceedNext}>
               {phoneLoading ? 'Processing...':'Next'} 
              </button>
            ):(
              <button className={styles.btns} onClick={handleClickedVerify} >     
                  Verify
             </button>
            )}
          </div>

          {isEmailVerified ? (
            <MdVerified className={styles.verifiedIcon} />
          ) : (
            <p className={styles.resend}>
              Resend OTP in <span2>{emailOTPExpireTimer}s</span2>
            </p>
          )}
        </div>
      </div>
    </>
  );
}
