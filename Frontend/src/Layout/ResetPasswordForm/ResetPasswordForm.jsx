import { useNavigate, useLocation } from 'react-router-dom';
import styles from './ResetPasswordForm.module.css'
import ResetPassword from '../../Components/ResetPassword/ResetPassword';
import useVerifyAuthToken from '../../Hooks/useVerifyAuthToken'
import usePasswordReset from '../../Hooks/usePasswordReset'
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { TbSettingsCheck } from "react-icons/tb";
import { MdVerified } from "react-icons/md";
import { FcExpired } from "react-icons/fc";
import { GoUnlink } from "react-icons/go";


export default function ResetPasswordForm()
{
    const location = useLocation();
    const nagivate = useNavigate()
    const token = new URLSearchParams(location.search).get('token');
    if(!token){
        return <div>No token found</div>;
    }
   
    const { user,isAuth ,loading} =  useVerifyAuthToken(token);

    const {loadingPasswordReset,handlePasswordUpdateSubmit} = usePasswordReset();
    const [isPasswordUpdated , setIsPasswordUpdated] =  useState(false);

    const [formData , setFormData] = useState({
        user:null,
        password:'',
        confirmPassword:'',
    })

    useEffect(() => {
        if (user) {
            setFormData((prevData) => ({ ...prevData, user:user.userId }));
        }
    }, [user]);

   const handleSubmit = async(event) => {
     event.preventDefault();
     if(formData.password !== formData.confirmPassword){
        toast.error("The passwords do not match !!");
        return;
     }
    
    const result = await handlePasswordUpdateSubmit(formData);
    if(!result){
        toast.error("Error resetting password!");
        return;
    }
    setIsPasswordUpdated(true);
    toast.success("Password has been reset successfully!");
}

if(loading){
    <div>Loading...</div>
}

    if(!isAuth)
    {
        return(
            <>
             <div className={styles.resetCard}>
             <FcExpired className={styles.expiredLinkIcon}/>
             <h2 className={styles.title}>Link Expired</h2>
                    <p className={styles.subTitle}>To reset your password, return to Forgot password page</p>
             <button type="button" 
                       className={styles.submitButton}
                       onClick={()=> nagivate('/reset') }
                       >
                        Reset password again
                     </button>
                 {/* <GoUnlink className={styles.crossIcon}/> */}
             </div>
            </>
        )
    }else{
    return(
        <div className={styles.resetCard}>

           {!isPasswordUpdated ? (
           <> 
               <TbSettingsCheck className={styles.privacyLoginIcon}/>
                    <h2 className={styles.title}>Reset Password</h2>
                    <p className={styles.subTitle}>Please kindly set your new password</p>
           
                <ResetPassword
                    formData={formData}
                    setFormData={setFormData}
                    handleSubmit={handleSubmit}
                    loadingPasswordReset={loadingPasswordReset}
                />
           </>
           ):(
            <>
                <TbSettingsCheck className={styles.privacyLoginIcon}/>
                <h2 className={styles.title}>Password changed!</h2>
                    <p className={styles.subTitle}>You've Successfully Reset Your Password</p>
                    <button type="button" 
                       className={styles.submitButton}
                       onClick={()=> nagivate('/login') }
                       >
                        Login Now
                     </button>
                  <MdVerified className={styles.confirmIcon}/>
            </>
             )}
        </div>
    )
 } 
}