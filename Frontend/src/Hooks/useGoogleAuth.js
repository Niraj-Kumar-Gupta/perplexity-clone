import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import axios from 'axios';
import { useGoogleLogin } from '@react-oauth/google';

const useGoogleAuth = () => {
    const navigate = useNavigate();
    
    const handleGoogleLogin = useGoogleLogin({

        onSuccess: async (authResult) => {
            const access_Token = authResult.access_token;
            const response = await axios.get( `${import.meta.env.VITE_API_URL}/api/auth-google`,
                {
                  headers: { Authorization: `Bearer ${access_Token}` }
                }
              );
            if(response.data.success){
                localStorage.setItem('authToken', response.data.token);
                navigate('/');
            }else{
                console.error('Login Failed');
            }
        },
        onError:()=>{
            console.log('Login Failed');
        },
        useOneTap: true,

    })


    return { handleGoogleLogin }
}

export default useGoogleAuth;
