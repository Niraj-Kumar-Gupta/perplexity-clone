import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState } from 'react';
import axios from 'axios';


const startTimer = (setTimer) => {
    setTimer(60);
    const intervalId = setInterval(() => {
      setTimer((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(intervalId);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
  };

export default function useSendOTP(formData){
    const [emaiLoading, setEmailLoading] = useState(false);
    const [phoneLoading, setPhoneLoading] = useState(false);
    const [emailOTPExpireTimer, setEmailTimer] = useState(0);  
    const [phoneOTPExpireTimer, setPhoneTimer] = useState(0); 
    const [isOtpSent, setIsOtpSent] = useState(false);
 
    const handleEmailOtpSend = async(email)=>{
        try {
            setEmailLoading(true)
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/send-email-otp`, {
              email:email,
            });
            console.log(response);
            if (response.data.success) {
              toast.success("OTP Sent Sucessfully!");
              setIsOtpSent(true);
              startTimer(setEmailTimer); 
            } else {
              toast.error('Failed to send OTPs');
            }
          } catch (error) {
            toast.error('Failed to send OTPs');
            console.error(error);
          } finally {
            setEmailLoading(false);
          }
    }
    const handlePhoneOtpSend = async(phone)=>{
       
        try {
            setPhoneLoading(true);
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/send-phone-otp`, {
              phone:phone,
            });
            if (response.data.success) {
              toast.success("OTP Sent Sucessfully!");
              setIsOtpSent(true);
              startTimer(setPhoneTimer); 
            } else {
              toast.error('Failed to send OTPs');
            }
          } catch (error) {
            toast.error('Failed to send OTPs');
            console.error(error);
          } finally {
            setPhoneLoading(false);
          }
    }

    return {
        emaiLoading,// loading states
        phoneLoading, // loading states
        emailOTPExpireTimer, // 1 min timer to expire
        phoneOTPExpireTimer, // 1 min timer to expire 
        handleEmailOtpSend,  // function to invoke otp generation
        handlePhoneOtpSend,  // function to invoke otp generation
        isOtpSent // send successfully or not
    }
};