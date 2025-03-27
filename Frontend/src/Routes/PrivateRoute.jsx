import { useEffect } from "react";
import { Navigate,Outlet } from "react-router-dom";
import { useDispatch , useSelector } from "react-redux";
import useVerifyAuthToken from '../Hooks/useVerifyAuthToken';
import { setUser, clearUser } from '../features/user/userSlices';

const globalStyles = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;


const styles = {
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    gap: '1rem',
    backgroundColor: '#f8f9fa'
  },
  spinner: {
    width: '50px',
    height: '50px',
    border: '5px solid #f3f3f3',
    borderTop: '5px solid #3498db',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  },
  loadingText: {
    color: '#2c3e50',
    fontSize: '1.2rem',
    fontFamily: 'Arial, sans-serif'
  },
  errorText: {
    color: '#e74c3c',
    padding: '1rem',
    textAlign: 'center'
  }
};

const PrivateRoute = () => {  
  const dispatch = useDispatch(); 
  const user = useSelector((state) => state.user.userDetails?.userId);
  const token = localStorage.getItem('authToken');
  const { loading,isAuth, user: verifiedUser ,error} = useVerifyAuthToken( token && !user ? token : null);

  useEffect(() => {
    if (isAuth && verifiedUser && token) {
      dispatch(setUser({ user: verifiedUser, token }));
    }
  }, [isAuth, verifiedUser, token, dispatch]);
 
  if (user) return <Outlet />;

  if (!token) return <Navigate to="/login" />;

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <style>{globalStyles}</style>
        <div style={styles.spinner}></div>
        <p style={styles.loadingText}>Verifying session...</p>
      </div>
    );
  }

  if (error) {
    console.error('Authentication error:', error);
    dispatch(clearUser());
    localStorage.removeItem('authToken');

    return (
      <Navigate 
        to="/login" 
        state={{ 
          error: "Session expired. Please login again.",
          errorStyle: styles.errorText 
        }} 
      />
    );
  }

  return isAuth ? <Outlet /> : <Navigate to="/login" />;
};




export default PrivateRoute;