import styles from './ResetPassword.module.css'
import { useState } from 'react';

export default function ResetPassword({
    formData,
    setFormData,
    handleSubmit,
    loadingPasswordReset,
   }) {
     
    const [show,setShow] = useState(false);

     const handleChange = (e)=>{
        const { name, value } = e.target;
        setFormData({...formData, [name]: value });
     }
    return(
        <>
             <form onSubmit={handleSubmit}>
                <input
                    className={styles.inputField}
                    type="password"
                    name="password"
                    placeholder="New password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
                <input
                    className={styles.inputField}
                    type={show ?"text":'password'}
                    name="confirmPassword"
                    placeholder="Re-enter password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                />

               <div className={styles.clickme}>
                    <input type='checkbox' id='clickme' name='show-password' onClick={()=>{setShow((pass)=> !pass)}}/>
                    <label htmlFor="clickme">Show Password</label>
                </div>

                <button type="submit" className={styles.submitButton}>
                  {loadingPasswordReset ? (
                   'Updating...'
                    ) : (
                    'Update Password '
                    )}
                </button>
             </form>
        </>
    )
}