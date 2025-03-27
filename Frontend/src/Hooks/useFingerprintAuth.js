import { useState } from "react";
import { startAuthentication, startRegistration } from "@simplewebauthn/browser"
import { useNavigate} from 'react-router-dom';
const useFingerprint = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const nagivate = useNavigate();

    const serverUrl = import.meta.env.VITE_API_URL;
   
    const registerFingerprint = async (email) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(
                `${serverUrl}/auth/register-options?email=${email}`,
                {
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                }
            )
          
            if(!response.ok){
                const data = await response.json();
                setError(data.error); 
                return;
            }

           const optionsJSON = await response.json();

            const registrationJSON = await startRegistration(optionsJSON)

            const verifyResponse = await fetch(`${serverUrl}/auth/register-verify`, {
                credentials: "include",
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(registrationJSON),
            });
         
            const verifyData = await verifyResponse.json();
            if (!verifyResponse.ok || !verifyData.verified) {
                throw new Error(verifyData.error || "Failed to verify registration.");
            }
            setSuccess('Successfully registered');
            
    
        } catch (err) {
            console.log(err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    
    const authenticateFingerprint = async (email) => {
        setIsLoading(true);
        // setError(null);
       
        try {
            
            const response = await fetch(`${serverUrl}/auth/authenticate-options?email=${email}`,{
                credentials: "include",
                headers: { "Content-Type": "application/json" },
            });
            const optionsJSON = await response.json();
           
            const authResponse = await startAuthentication( optionsJSON );
          
            const verifyResponse = await fetch(`${serverUrl}/auth/authenticate-verify`, {
                credentials: "include",
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(authResponse),
            });

            const verifyData = await verifyResponse.json();
            if (!verifyResponse.ok || !verifyData.verified) {
              throw new Error(verifyData.error || "Failed to verify authentication.");
            }
           
            const token = verifyData.token;
            localStorage.setItem('authToken',token);
            nagivate('/');
           
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        isLoading,
        error,
        success,
        registerFingerprint,
        authenticateFingerprint,
    };
};

export default useFingerprint;
