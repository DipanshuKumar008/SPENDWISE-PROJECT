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

        if (name !== "" && email !== "" && password !== "" && confirmPassword !== "") {
            if (password === confirmPassword) {
                setLoading(true);
                createUserWithEmailAndPassword(auth, email, password).then((userCredential) => {

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


                })
                    .catch((error) => {
                        if (error.code === "auth/email-already-in-use") {
                            toast.error("Account already exists. Please sign in.");
                            setLoginForm(true); // optional: auto switch to login
                        } else {
                            toast.error(error.message);
                        }
                        setLoading(false);
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

                    const user = userCredential.user;
                    toast.success("User Logged In!")
                    console.log("User Logged in", user)
                    setLoading(false)
                    navigate("/dashboard")
                })
                .catch((error) => {
                    if (error.code === "auth/user-not-found") {
                        toast.error("Account does not exist. Please sign up.");
                        setLoginForm(false);
                    } else if (error.code === "auth/wrong-password") {
                        toast.error("Incorrect password.");
                    } else {
                        toast.error(error.message);
                    }
                    setLoading(false);
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
            } catch (e) {
                toast.error(e.message);
            }
        }
    }





    async function googleAuth() {
        setLoading(true);

        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            const userRef = doc(db, "users", user.uid);
            const userSnap = await getDoc(userRef);

            // ❌ user not registered
            if (!userSnap.exists()) {
                toast.error("Account does not exist. Please sign up first.");
                await auth.signOut();        // ✅ correct
                return;                     // ✅ STOP FLOW
            }

            // ✅ valid user
            toast.success("Login successful");
            navigate("/dashboard");

        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    }




    async function googleSignup() {
        setLoading(true);

        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            await createDoc(user); // create Firestore profile

            toast.success("Account created successfully");
            navigate("/dashboard");
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    }




    return (
        <>
            {loginForm ? (
                /* ================= LOGIN UI ================= */
                <div className='signup-wrapper'>
                    <h2 className='title'>
                        Login on <span style={{ color: "var(--theme)" }}>SPENDWISE</span>
                    </h2>

                    <form>
                        <Input
                            type="email"
                            label="Email"
                            state={email}
                            setstate={setEmail}
                            placeholder="DamonSalvatore123@gmail.com"
                        />

                        <Input
                            type="password"
                            label="Password"
                            state={password}
                            setstate={setPassword}
                            placeholder="Example@123"
                        />

                        <Button
                            disabled={loading}
                            text={loading ? "Loading..." : "Login Using Email and Password"}
                            onClick={loginUsingEmail}
                        />

                        <p className='p-login'>or</p>

                        {/* ✅ LOGIN with Google → googleAuth (CORRECT) */}
                        <Button
                            onClick={googleAuth}
                            text={loading ? "Loading..." : "Login Using Google"}
                            blue={true}
                        />

                        <p
                            className='p-login'
                            style={{ cursor: "pointer" }}
                            onClick={() => setLoginForm(false)}
                        >
                            Don't have an account?
                            <span className='p-login p-blue'> Sign up</span>
                        </p>
                    </form>
                </div>
            ) : (
                /* ================= SIGNUP UI ================= */
                <div className='signup-wrapper'>
                    <h2 className='title'>
                        Sign Up on <span style={{ color: "var(--theme)" }}>SPENDWISE</span>
                    </h2>

                    <form>
                        <Input
                            type="text"
                            label="Full Name"
                            state={name}
                            setstate={setName}
                            placeholder="Damon Salvatore"
                        />

                        <Input
                            type="email"
                            label="Email"
                            state={email}
                            setstate={setEmail}
                            placeholder="DamonSalvatore123@gmail.com"
                        />

                        <Input
                            type="password"
                            label="Password"
                            state={password}
                            setstate={setPassword}
                            placeholder="Example@123"
                        />

                        <Input
                            type="password"
                            label="Confirm Password"
                            state={confirmPassword}
                            setstate={setConfirmPassword}
                            placeholder="Example@123"
                        />

                        <Button
                            disabled={loading}
                            text={loading ? "Loading..." : "Signup Using Email and Password"}
                            onClick={signupWithEmail}
                        />

                        <p className='p-login'>or</p>



                        {/* ✅ AFTER (FIXED) */}
                        <Button
                            onClick={googleSignup}
                            text={loading ? "Loading..." : "Signup Using Google"}
                            blue={true}
                        />

                        <p
                            className='p-login'
                            style={{ cursor: "pointer" }}
                            onClick={() => setLoginForm(true)}
                        >
                            Already have an account?
                            <span className='p-login p-blue'> Click here</span>
                        </p>
                    </form>
                </div>
            )}
        </>

    );
}








export default SignupSigninComponent;