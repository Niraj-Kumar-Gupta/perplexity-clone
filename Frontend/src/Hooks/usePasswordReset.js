import axios from "axios"
import { useState } from "react";

export default function usePasswordReset(){
    const [loadingPasswordReset ,setLoadingPasswordReset] = useState(false);
    const handlePasswordReset = async(email)=>{
  
        setLoadingPasswordReset(true);
           try{
             const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/reset-password`,{email})
             return res.data.success === true;
           }
           catch(error){
            console.error("Error resetting password:", error);
             return false;
           }
           finally{
            setLoadingPasswordReset(false);
           }
    }
    const handlePasswordUpdateSubmit = async(formData)=>{
      setLoadingPasswordReset(true);
          try{
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/update-password`,formData)
            return res.data.success === true;
          }
          catch(error){
          console.error("Error resetting password:", error);
            return false;
          }
          finally{
          setLoadingPasswordReset(false);
          }
    }
    return {loadingPasswordReset,handlePasswordReset,handlePasswordUpdateSubmit};
}