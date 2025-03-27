import styles from './ForgotPassword.module.css'


export default function ForgotPassword({
    formData,
    setFormData,
    handleSubmit,
    loadingPasswordReset,
   }) {

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
                <button type="submit" className={styles.submitButton}>
                  {loadingPasswordReset ? (
                   'Sending...'
                    ) : (
                    'Send Email'
                    )}
                </button>
             </form>
        </>
    )
}