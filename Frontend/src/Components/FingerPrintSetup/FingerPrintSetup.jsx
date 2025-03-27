import * as React from 'react';
import styles from  './FingerPrintSetup.module.css';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import biometricSetup from '../../assets/biometricSetup.png'
import fingerPrintLogo from '../../assets/print.png'
import  useFingerprint  from '../../Hooks/useFingerprintAuth';
import { IoMdCheckmarkCircleOutline } from "react-icons/io";


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 900,
    height:500,
    bgcolor: 'background.paper',
    boxShadow: 24,
    borderRadius:3,
    p: 4,
    border: 'none',
    outline: 'none',
    display: 'flex',
  };


  const backdropStyle = {
    backdropFilter: 'blur(10px)',  
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
};

const FingerPrintSetup = () => {
    const email = 'nigupta@griddynamics.com'; 
    const {registerFingerprint,isLoading, error, success }  = useFingerprint();
    const [open, setOpen] = React.useState(true);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const handleClicked = async () => {
        try {
            await registerFingerprint(email);
        } catch (error) {
            console.error(error);
        }
    }
    return (
        <>
            <div className={styles.ContainerBox}>
                 <Modal
                    aria-labelledby="transition-modal-title"
                    aria-describedby="transition-modal-description"
                    open={open}
                    onClose={false}
                    closeAfterTransition
                    slots={{ backdrop: Backdrop }}
                    slotProps={{
                    backdrop: {
                        style: backdropStyle,
                    },
                    }}
                >
                    <Fade in={open}>
                         <Box sx={style}>
                           <div className={styles.leftContainer}>
                           <img src={fingerPrintLogo} alt={"biometric"} />
                             <span className={styles.horizontal}></span>
                             <h2 className={styles.headerName}>Biometrics</h2>
                             <p className={styles.description}>Enable biometric login to access your dashboard.</p>
                             
                            {!success && <button 
                               className={styles.btn}
                               onClick={handleClicked} 
                              >Enable biometric</button>}

                              {success && <button 
                               className={styles.btn}
                               onClick={handleClose} 
                              >Close</button>}

                              {success && <span className={styles.success}><IoMdCheckmarkCircleOutline/></span>}
                              {error && <span className={styles.error}>{error}</span>}
                           </div>
                           <div className={styles.rightContainer}>
                               <img src={biometricSetup} alt={"biometric"} />
                           </div>
                        </Box>
                    </Fade>
                </Modal>
            </div>
        </>
    );
}

export default FingerPrintSetup;

