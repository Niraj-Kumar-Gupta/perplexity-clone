import styles from './PhoneOtpVerification.module.css';
import React, { useState, useRef ,useEffect} from 'react';
import {  MdVerified } from "react-icons/md";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { TbDeviceMobileMessage } from "react-icons/tb";

export default function PhoneOtpVerification({
    phone,
    phoneOTPExpireTimer,
    isPhoneVerified,
    verifyPhoneOtp,
    errorPhoneMessage,
    handleFinalSubmit ,
    handlePhoneOtpSend,
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

  const handleClickedVerify = async() => {
    const userOtpPhone = otp.join('');
    if (userOtpPhone.length === 6 && userOtpPhone.match(/^\d{6}$/)) {
      await verifyPhoneOtp(phone,userOtpPhone); 
    } else {
      toast.error('Please enter a valid 6-digit OTP');
    }
  };


  useEffect(()=>{
    if (errorPhoneMessage) {
      setIsInvalidOtp(true);
      // toast.error(errorPhoneMessage);
      setTimeout(() => {
        setIsInvalidOtp(false);
        setOtp(Array(6).fill(''));
      }, 400);
    }
  },[errorPhoneMessage]);

  return (
    <>
      <div>
        <TbDeviceMobileMessage className={styles.optIcon} />
        <div className={styles.textContainer}>
          <h3>Please check your Phone</h3>
          <p>We've sent a code to {phone}</p>
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
              disabled={isPhoneVerified}
            />
          ))}
        </div>

        <p className={styles.resend}>
           Didn't get the code?{' '}
            <span 
                onClick={() => {
                if (phoneOTPExpireTimer <= 0 && phone && !isPhoneVerified) {
                    handlePhoneOtpSend(phone);
                  }
                }}
                className={phoneOTPExpireTimer > 0 ? styles.textLight : styles.textDark}
               >
                Click to Resend
            </span>
        </p>

        <div className={styles.btnsContainer}>
          <div className={styles.btnsBox}>
            {isPhoneVerified ? (
              <button className={styles.btns} onClick={handleFinalSubmit}>
                Submit
              </button>
            ):(
              <button className={styles.btns} onClick={handleClickedVerify} disabled={isPhoneVerified}>
                  Verify
              </button>
            )}
          </div>

          {isPhoneVerified ? (
            <MdVerified className={styles.verifiedIcon} />
          ) : (
            <p className={styles.resend}>
              Resend OTP in <p>{phoneOTPExpireTimer}s</p>
            </p>
          )}
        </div>
      </div>
    </>
  );
}
