import axios from "axios"
import { useState } from "react";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function useCheckEmailPhoneExist(){
    const [loadingEmail,setLoadingEmail] = useState(false);
    const [isEmailAlreadyExist,setIsEmailAlreadyExist] = useState(false);
    const [isPhoneAlreadyExist,setIsPhoneAlreadyExist] = useState(false);
    const handleCheckEmailExist= async(email)=>{
      try{
        setLoadingEmail(true)
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/verify-email-exist`,{email});
        if(response.data.exist){
          setIsEmailAlreadyExist(true);
          
          return true;
        }else{
          setIsEmailAlreadyExist(false);
          return false;
        }
      } 
      catch(error){
        console.error(error);
      }finally{
        setLoadingEmail(false)
      }
     
    }

    const handleCheckPhoneExist= async(phone)=>{
        
        try{
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/verify-phone-exist`,{phone});
            if(response.data.exist){
                setIsPhoneAlreadyExist(true);
                
                return true;
            }else{
                setIsPhoneAlreadyExist(false);
                return false;
            }
          } 
          catch(error){
            console.error(error);
    
          } 
    }
    return{loadingEmail,isEmailAlreadyExist,isPhoneAlreadyExist,handleCheckEmailExist,handleCheckPhoneExist}
}