import styles from './Login.module.css'
import { useState } from 'react';
export default function Login({
    formData,
    setFormData,
    handleSubmit,
    loading
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
                    type="text"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
                <input
                    className={styles.inputField}
                    type={show ?"text":'password'}
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
                <div className={styles.clickme}>
                    <input type='checkbox' id='clickme' name='show-password' onClick={()=>{setShow((pass)=> !pass)}}/>
                    <label htmlFor="clickme">Show Password</label>
                </div>
    
                <button type="submit" className={styles.submitButton}>
                    {loading ? 'Proceeding...':'Login'}
                </button>
             </form>

        </>
    )
}