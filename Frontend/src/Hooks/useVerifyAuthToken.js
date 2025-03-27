import { useState, useEffect } from 'react';
import axios from 'axios';

export default function useVerifyAuthToken(token) {
    const [state, setState] = useState({
        user: null,
        isAuth: false,
        loading: !!token, // Only load if we have a token
        error: null
    });

    useEffect(() => {
        const controller = new AbortController();
        
        const verifyToken = async () => {
            try {
                const { data } = await axios.get(
                    `${import.meta.env.VITE_API_URL}/api/verify-token`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                        signal: controller.signal
                    }
                );

                setState({
                    user: data.userDetails,
                    isAuth: data.success,
                    loading: false,
                    error: data.success ? null : 'Invalid token'
                });

            } catch (error) {
                if (!axios.isCancel(error)) {
                    setState({
                        user: null,
                        isAuth: false,
                        loading: false,
                        error: error.response?.data?.message || 'Token verification failed'
                    });
                }
            }
        };

        if (token) {
            verifyToken();
        } else {
            // Immediately resolve if no token
            setState(prev => prev.loading ? {
                ...prev,
                loading: false,
                isAuth: false
            } : prev);
        }

        return () => controller.abort();
    }, [token]); // Only re-run if token changes

    return state;
}