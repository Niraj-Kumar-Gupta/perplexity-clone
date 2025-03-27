import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function useLogin()
{
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleLoginSubmit = async(formData)=>{
        setLoading(true);
       try{
          const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/login`,formData);
         
          if(response.data.success){
            // toast.success("Login Sucessfully!");
            const token = response.data.token;
            localStorage.setItem('authToken', token);
            navigate('/');
          }
          else{
            setErrorMessage(response.data.message)
            toast.error(response.data.message);
          }
       }
       catch(error){
        console.error(error);
        setErrorMessage('Error verifying Details ,please try again later.');
        toast.error('Error verifying Details.');
       }
       finally {
        setLoading(false);
      }
    }
    return { loading, handleLoginSubmit, errorMessage }
}