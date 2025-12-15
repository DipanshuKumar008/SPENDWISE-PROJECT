import React, { useState } from 'react'
import { useNavigate } from "react-router-dom";
import "./style.css"
import Input from "../Input"
import Button from '../Button'
import { toast } from 'react-toastify'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebase"
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";

const provider = new GoogleAuthProvider();



function SignupSigninComponent() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [loginForm, setLoginForm] = useState(false)
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate()



    function signupWithEmail() {
        //authonticate the user , or basically create a new account using email and pass
        if (name !== "" && email !== "" && password !== "" && confirmPassword !== "") {
            if (password === confirmPassword) {
                setLoading(true);
                createUserWithEmailAndPassword(auth, email, password).then((userCredential) => {
                    // Signed up 
                    const user = userCredential.user;
                    console.log("User => ", user)
                    toast.success("User created!")
                    setLoading(false);
                    setName("")
                    setEmail("")
                    setPassword("")
                    setConfirmPassword("")
                    createDoc(user)
                    navigate("/dashboard")
                    // Create a doc with user id as the following id

                })
                    .catch((error) => {
                        // const errorCode = error.code;
                        const errorMessage = error.message;
                        toast.error(errorMessage)
                        // ..
                    });
            } else {
                toast.error("Password and Confirm Password don't match!")
                setLoading(false)
            }

        } else {
            toast.error("All fields are mandatory!")
            setLoading(false);
        }
    }

    function loginUsingEmail() {
        console.log("Email ", email)
        console.log("Password ", password)
        setLoading(true)

        if (email !== "" && password !== "") {
            signInWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    // Signed in 
                    const user = userCredential.user;
                    toast.success("User Logged In!")
                    console.log("User Logged in", user)
                    setLoading(false)
                    navigate("/dashboard")
                    // ...
                })
                .catch((error) => {
                    // const errorCode = error.code;
                    const errorMessage = error.message;
                    toast.error(errorMessage)
                    setLoading(false)
                });
        } else {
            toast.error("All Fields are mandatory!")
        }
    }


    async function createDoc(user) {
        if (!user) return;

        const userRef = doc(db, "users", user.uid);
        const userData = await getDoc(userRef);

        if (!userData.exists()) {
            try {
                await setDoc(userRef, {
                    name: user.displayName || name,
                    email: user.email,
                    photoURL: user.photoURL || "",
                    createdAt: new Date(),
                });
                toast.success("User profile created");
                setLoading(false)
            } catch (e) {
                toast.error(e.message);
                setLoading(false)
            }
        }
    }




    function googleAuth() {
        setLoading(true)
        try {
            signInWithPopup(auth, provider)
                .then((result) => {
                    // This gives you a Google Access Token. You can use it to access the Google API.
                    // const credential = GoogleAuthProvider.credentialFromResult(result);
                    // const token = credential.accessToken;
                    // The signed-in user info.
                    const user = result.user;
                    console.log("User =>", user)
                    toast.success("User authonticated!")
                    createDoc(user)
                    setLoading(false)
                    navigate("/dashboard")
                    // IdP data available using getAdditionalUserInfo(result)
                    // ...
                }).catch((error) => {
                    // Handle Errors here.
                    setLoading(false)

                    // const errorCode = error.code;
                    const errorMessage = error.message;
                    toast.error(errorMessage)
                    // The email of the user's account used.
                    // const email = error.customData.email;
                });

        } catch (e) {
            setLoading(false)
            toast.error(e.message)

        }

    }

    return (
        <>
            {loginForm ? (
                <div className='signup-wrapper'>
                    <h2 className='title'>Login on
                        <span style={{ color: "var(--theme)" }}> SPENDWISE
                        </span>
                    </h2>
                    <form>

                        <Input
                            type={"email"}
                            label={"Email"}
                            state={email}
                            setstate={setEmail}
                            placeholder={'DamonSalvatore123@gmail.com'}
                        />
                        <Input
                            type={"password"}
                            label={"Password"}
                            state={password}
                            setstate={setPassword}
                            placeholder={'Example@123'}
                        />
                        <Button
                            disabled={loading}
                            text={loading ? "Loading..." : "Login Using Email and Password"} onClick={loginUsingEmail} />
                        <p className='p-login'>or</p>
                        <Button
                            onClick={googleAuth}
                            text={loading ? "Loading..." : "Login Using Google"} blue={true} />
                        <p className='p-login'
                            style={{ cursor: "pointer" }}
                            onClick={() => setLoginForm(!loginForm)}
                        >Don't have an account? <span className='p-login p-blue' >Sign up</span></p>
                    </form>
                </div>
            ) :
                (
                    <div className='signup-wrapper'>
                        <h2 className='title'>Sign Up on
                            <span style={{ color: "var(--theme)" }}> SPENDWISE
                            </span>
                        </h2>
                        <form>
                            <Input
                                type={"text"}
                                label={"Full Name"}
                                state={name}
                                setstate={setName}
                                placeholder={'Damon Salvatore'}
                            />
                            <Input
                                type={"email"}
                                label={"Email"}
                                state={email}
                                setstate={setEmail}
                                placeholder={'DamonSalvatore123@gmail.com'}
                            />
                            <Input
                                type={"password"}
                                label={"Password"}
                                state={password}
                                setstate={setPassword}
                                placeholder={'Example@123'}
                            />
                            <Input
                                type={"password"}
                                label={"Confirm Password"}
                                state={confirmPassword}
                                setstate={setConfirmPassword}
                                placeholder={'Example@123'}
                            />
                            <Button
                                disabled={loading}
                                text={loading ? "Loading..." : "Signup Using Email and Password"} onClick={signupWithEmail} />
                            <p className='p-login'>or</p>
                            <Button
                                onClick={googleAuth}
                                text={loading ? "Loading..." : "Signup Using Google"} blue={true} />
                            <p className='p-login'
                                style={{ cursor: "pointer" }}
                                onClick={() => setLoginForm(!loginForm)}
                            >Or Have An Account Already? <span className='p-login p-blue'>Click here</span> </p>
                        </form>
                    </div>
                )
            }
        </>
    );
}








export default SignupSigninComponent;