
import { useSelector } from 'react-redux';
import { Navigate ,Outlet } from 'react-router-dom';

const PublicRoute = () => {
   const { userDetails } = useSelector((state) => state.user);
   return !userDetails ? <Outlet /> : <Navigate to="/"  />;
};
 
export default PublicRoute;