import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function useSignup(){
     
    const [loadingSignup, setLoadingSignup] = useState(false);
    const navigate = useNavigate();

    const handleSignupSubmit = async (formData,isEmailVerified,isPhoneVerified) => {
        if (isEmailVerified && isPhoneVerified) {
            setLoadingSignup(true);
          try {
            const saveResponse = await axios.post(`${import.meta.env.VITE_API_URL}/api/save-user`, formData);
            if (saveResponse.data.success) {
              const token = saveResponse.data.token;
              localStorage.setItem('authToken', token);
              // toast.success('Sign in successfully!');
              navigate('/');
            } else {
              toast.error(saveResponse.data.message);
            }
          } catch (error) {
            console.error(error);
            toast.error('Error saving user details, please try again later.');
          } finally {
            setLoadingSignup(false);
          }
        } else {
          toast.error('Both email and phone OTPs must be verified!');
        }
      };
      return{loadingSignup,handleSignupSubmit}
}