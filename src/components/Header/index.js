import React from 'react'
import "./style.css"
import { auth } from "../../firebase"
import { useAuthState } from "react-firebase-hooks/auth"
import { signOut } from "firebase/auth"
import { toast } from "react-toastify"
import userSvg from '../../assets/userImg.svg'

function Header() {
    const [user, loading] = useAuthState(auth);

    function logoutFnc() {
        signOut(auth)
            .then(() => toast.success("Logged Out Successfully!"))
            .catch((error) => toast.error(error.message));
    }

    return (
        <div className='navbar'>
            <p className='logo'>SPENDWISE</p>

            {!loading && user && (
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <img
                        src={user.photoURL || userSvg}
                        alt="user-profile"
                        style={{
                            width: "2rem",
                            height: "2rem",
                            borderRadius: "50%",
                            objectFit: "cover"
                        }}
                    />
                    <p className='logo link' onClick={logoutFnc}>
                        Logout
                    </p>
                </div>
            )}
        </div>
    );
}

export default Header;
