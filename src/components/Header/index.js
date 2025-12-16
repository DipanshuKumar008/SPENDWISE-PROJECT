import React, { useEffect } from 'react'
import "./style.css"
import { auth } from "../../firebase"
import { useAuthState } from "react-firebase-hooks/auth"
import { useNavigate } from 'react-router-dom';
import { signOut } from "firebase/auth";
import { toast } from "react-toastify";
import userSvg from '../../assets/userImg.svg'





function Header() {

    const [user, loading] = useAuthState(auth);

    const navigate = useNavigate();
    useEffect(() => {
        if (user) {
            navigate("/dashboard")
        }
    }, [user,loading,navigate])


    function logoutFnc() {
        signOut(auth)
            .then(() => {
                toast.success("Logged Out Successfully!");
                navigate("/");
            })
            .catch((error) => {
                toast.error(error.message);
            });
    }

    return (
        <div className='navbar'>
            <p className='logo'>SPENDWISE</p>
            {user && (
                <div style={{display:"flex", alignItems:"center",gap:"0.75rem"}}>
                <img 
                src={user.photoURL ? user.photoURL: userSvg}  
                style={{borderRadius:"50%" ,height:"2rem",width:"2rem"}} 
                alt='user-profile-Img'
                />
                <p className='logo link' onClick={logoutFnc}>Logout</p>
                </div>
            )}
        </div>
    );
}

export default Header