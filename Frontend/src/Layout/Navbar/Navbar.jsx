import logo from '../../assets/logo.png'
import logoText from '../../assets/logotext.svg'
import { FaUserCircle } from "react-icons/fa";
import './Navbar.css'
import { toast } from 'react-toastify';
import { useDispatch,useSelector } from 'react-redux';
import { clearUser } from '../../features/user/userSlices';

function Navbar(){
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.userDetails);
    const handleClickedLogout = ()=>{
      localStorage.removeItem('authToken');
      dispatch(clearUser());
      toast.success("Logout successfully !!");
      setTimeout(()=>{
        window.location.reload();
      },400);
    }
    return(
        <>
         <div className="navbar-container">
            <div className="logo-container">
              <img src={logo} alt="logo" />
              <img src={logoText} alt="textlogo" />
            </div>
            {user &&  <div className='right-container'>
            <div className="right-container1">
                 <FaUserCircle className='icons'/>
                 {/* <span>{user}</span> */}
            </div>
            <button className='right-container' onClick={handleClickedLogout} type='submit'>Logout</button>
            </div>}
         </div>
        </>
    )
}

export default Navbar;