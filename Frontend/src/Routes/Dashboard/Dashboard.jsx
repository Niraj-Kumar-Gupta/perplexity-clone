import React, { useState ,lazy,Suspense,useEffect } from 'react';
import genailogo from '../../assets/artificial-intelligence-ai-icon.svg';
import styles from './Dashboard.module.css';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
const FingerPrintSetupComponent = lazy(() => import('../../Components/FingerPrintSetup/FingerPrintSetup'));


function Dashboard() {
    const navigator = useNavigate()
    const user = useSelector((state) => state.user.userDetails);
    const fingerprintsLength = user?.fingerprintsLength;
    const [isFingerPrintSetupDone, setIsFingerPrintSetupDone] = useState(false); 
  
    useEffect(() => {
        if (fingerprintsLength && !isFingerPrintSetupDone) {
            setIsFingerPrintSetupDone(true);
        }
    }, [fingerprintsLength, isFingerPrintSetupDone]);

    return (
        <div className={styles.dashboard}>
             <Suspense fallback={<div>Loading...</div>}>
                {!isFingerPrintSetupDone && !fingerprintsLength && <FingerPrintSetupComponent />}
            </Suspense>
            <div className={styles.dashboardContainer}>
                  <div className={styles.cardContainer}>
                      <div className={styles.card} onClick={() => navigator('/chat')}>
                           <img src={genailogo} alt="GenAI Logo" className={styles.genaiLogo} />
                           <p>Generative AI</p>
                      </div>
                 </div>
            </div>
        </div>
    );
}

export default Dashboard;


