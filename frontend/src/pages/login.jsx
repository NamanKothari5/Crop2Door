import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import React from 'react';
import toast from "react-hot-toast"
import { auth } from '../firebase';
import { getUser, useLoginMutation } from '../redux/api/userAPI';
import { useDispatch } from 'react-redux';
import { userExist } from '../redux/reducer/userReducer';

const Login = () => {
    const [login]=useLoginMutation();
    
    const dispatch = useDispatch();
    const loginHandler=async()=>{
        try {
            const provider=new GoogleAuthProvider();
            const {user}=await signInWithPopup(auth,provider);

            const res=await login({
                name:user.displayName,
                email:user.email,
                gender:"male",
                dob:"03-11-2001",
                role:"customer",
                _id:user.uid
            });

            if("data" in res){
                const data = await getUser(user.uid);
                dispatch(userExist(data.user));
                toast.success(res.data.message);
            }
            else{
                const error=res.error;
                toast.error(error.data.message);
            }
        } catch (error) {
            toast.error("Sign in failed");
        }
    }
    return (
        <div>
            <button onClick={loginHandler}>Press for login</button>
        </div>
    )
}

export default Login