import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState} from 'react';
import axios from 'axios';

export default function usePhoneVerify(){
    const [loading, setLoading] = useState(false);
    const [isPhoneVerified, setIsPhoneVerified] = useState(false);
    const [errorPhoneMessage ,setPhoneErrorMessage] = useState(null);

    const verifyPhoneOtp = async (phone,userOtpPhone) => {
        setLoading(true);
        setPhoneErrorMessage(null);
        try {
          const verifyResponse = await axios.post(`${import.meta.env.VITE_API_URL}/api/verify-phone-otp`, {
            phone:phone,
            otpPhone: userOtpPhone,
          });
        
          if (verifyResponse.data.verified) {
            setIsPhoneVerified(true);
            toast.success("Number Verified Sucessfully!");
          } else {
            setPhoneErrorMessage(verifyResponse.data.message);
          }
        } catch (error) {
          console.error(error);
          setPhoneErrorMessage('Otp expired. Resend Otp again!');
        } finally {
          setLoading(false);
        }
      };
      
      return{loading, isPhoneVerified, errorPhoneMessage,verifyPhoneOtp};
}