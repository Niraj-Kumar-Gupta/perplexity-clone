import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState } from 'react';
import axios from 'axios';

export default function useEmailVerify()
{
    const [loading, setLoading] = useState(false);
    const [isEmailVerified, setIsEmailVerified] = useState(false);
    const [errorEmailMessage ,setEmailErrorMessage] = useState(null);

    const verifyEmailOtp = async (email,userOtpEmail) => {
        setLoading(true);
        setEmailErrorMessage(null);
        try {
          const verifyResponse = await axios.post(`${import.meta.env.VITE_API_URL}/api/verify-email-otp`, {
            email: email,
            otpEmail: userOtpEmail,
          });
    
          if (verifyResponse.data.verified) {
            setIsEmailVerified(true);
            toast.success("Email Verified Sucessfully!");
            
          } else {
            setEmailErrorMessage(verifyResponse.data.message);
          }
        } catch (error) {
          console.error(error);
          setEmailErrorMessage('Otp expired. Resend Otp again!');
        } finally {
          setLoading(false);
        }
        
      };
      
    return{loading,isEmailVerified,errorEmailMessage,verifyEmailOtp};
}