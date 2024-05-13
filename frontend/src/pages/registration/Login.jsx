import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { useDispatch,useSelector } from 'react-redux';
import { userExist } from '../../redux/reducer/userReducer';
import { useLocation, useNavigate } from "react-router-dom";
import { getUser, useLoginMutation } from '../../redux/api/userApi';
import { auth } from '../../fireabase/FirebaseConfig';
import { toast } from 'react-toastify';
// import '../index.css'; 
// import '../styles/login.css'; 
const LoginPage = () => {
    const navigate = useNavigate();
    const [login,] = useLoginMutation();
    const [isSignUp, setIsSignUp] = useState(false);
    const dispatch = useDispatch();
    const [pincode, setPincode] = useState("");
    const [address, setAddress] = useState("");
    const [registeredRole, setRegisteredRole] = useState("");
    const [newRole, setNewRole] = useState("");
    const location = useLocation();
    
    const { user, loading } = useSelector(
        (state) =>
            state.userReducer
    );
    useEffect(() => {
        if(user && location.state){
            const redirectPath=location.state.prevPath;
            navigate(`${redirectPath}`);
        }
    },[user])
    const loginHandler = async (e) => {
        e.preventDefault();
        try {
            const provider = new GoogleAuthProvider();
            const { user } = await signInWithPopup(auth, provider);
            let loginProperties = {
                _id: user.uid,
                name: user.displayName,
                email: user.email,
            }

            if (isSignUp) {
                loginProperties["pincode"] = pincode;
                loginProperties["address"] = address;
                loginProperties["role"] = newRole;
            }
            else
                loginProperties["role"] = registeredRole;

            const res = await login(loginProperties);


            if ("data" in res) {
                const data = await getUser(user.uid);
                dispatch(userExist(data.user));
                toast.success(res.data.message);
                navigate("/");
            }
            else {
                const error = res.error;
                toast.error(error.data.message);
            }
        } catch (error) {
            toast.error("Sign in failed");
        }
    }
    return (
        <div className='login-page'>
            <div className={`container ${isSignUp ? 'right-panel-active' : ''}`} >
                {/* Sign Up Form */}
                <div className="form-container sign-up-container">
                    <form onSubmit={loginHandler}>
                        <h1>Create Account</h1>
                        <label htmlFor="role">Registering as:</label>
                        <select value={newRole} onChange={(e) => setNewRole(e.target.value)} id='role'>
                            <option value="">Choose your role</option>
                            <option value="farmer">Farmer</option>
                            <option value="customer">Customer</option>
                        </select>
                        <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Address" />
                        <input type="number" value={pincode} onChange={(e) => setPincode(e.target.value)} placeholder="Pincode" />

                        <button>
                            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="30" height="30" viewBox="0 0 48 48">
                                <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
                                <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
                                <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
                                <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
                            </svg>
                            <span>Signup with Google</span>
                        </button>
                    </form>
                </div>

                {/* Sign In Form */}
                <div className="form-container sign-in-container">
                    <form onSubmit={loginHandler}>
                        <h1>Sign in</h1>
                        <label htmlFor="role">Login as:</label>
                        <select value={registeredRole} onChange={(e) => setRegisteredRole(e.target.value)} id='role'>
                            <option value="">Choose your role</option>
                            <option value="farmer">Farmer</option>
                            <option value="customer">Customer</option>
                            <option value="admin">Admin</option>
                        </select>
                        <a href="#">Forgot your password?</a>
                        <button>
                            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="30" height="30" viewBox="0 0 48 48">
                                <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
                                <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
                                <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
                                <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
                            </svg>
                            <span>Sign in with Google</span>
                        </button>
                    </form>
                </div>

                {/* Overlay Container */}
                <div className="overlay-container">
                    <div className="overlay">
                        <div className="overlay-panel overlay-left">
                            <h1>Welcome Back!</h1>
                            <p>To keep connected with us please login using your registered google account</p>
                            <button className="ghost" onClick={() => setIsSignUp(false)}>Sign In</button>
                        </div>
                        <div className="overlay-panel overlay-right">
                            <h1>Hello, Friend!</h1>
                            <p>Enter your personal details and start journey with us</p>
                            <button className="ghost" onClick={() => setIsSignUp(true)}>Sign Up</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoginPage