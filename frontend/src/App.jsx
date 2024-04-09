import React, { useEffect } from 'react'
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

import Home from './pages/home/Home';
import Order from './pages/order/Order';
import Cart from './pages/cart/Cart';
import Dashboard from './pages/admin/dashboard/Dashboard';
import NoPage from './pages/nopage/NoPage';
import MyState from './context/data/myState';

import ProductInfo from './pages/productInfo/ProductInfo';
import AddProduct from './pages/admin/page/AddProduct';
import UpdateProduct from './pages/admin/page/UpdateProduct';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Allproducts from './pages/allproducts/Allproducts';
import Login from './pages/registration/Login';
import { useDispatch, useSelector } from 'react-redux';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './fireabase/FirebaseConfig';
import { userExist, userNotExist } from './redux/reducer/userReducer';
import { getUser } from './redux/api/userApi';

function App() {

  const dispatch = useDispatch();
  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        
        const data = await getUser(user.uid);
        if (data.user)
          dispatch(userExist(data.user));
        else
          dispatch(userNotExist());
      }
      else {
        dispatch(userNotExist());
      }
    });
  }, []);
  return (
    <MyState>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/allproducts" element={<Allproducts />} />
          <Route path="/order" element={
            <ProtectedRoute>
              <Order />
            </ProtectedRoute>
          } />
          <Route path="/cart" element={<Cart />} />
          <Route path="/dashboard" element={
            <ProtectedRouteForAdmin>
              <Dashboard />
            </ProtectedRouteForAdmin>
          } />
          <Route path='/login' element={<Login />} />
          
          <Route path='/productinfo/:id' element={<ProductInfo />} />
          <Route path='/addproduct' element={
            <ProtectedRouteForAdmin>
              <AddProduct />
            </ProtectedRouteForAdmin>
          } />
          <Route path='/updateproduct' element={
            <ProtectedRouteForAdmin>
              <UpdateProduct />
            </ProtectedRouteForAdmin>
          } />
          <Route path="/*" element={<NoPage />} />
        </Routes>
        <ToastContainer />
      </Router>

    </MyState>

  )
}

// user 

export const ProtectedRoute = ({ children }) => {
  const { user, loading } = useSelector(
    (state) =>
      state.userReducer
  );
  if (user) {
    return children
  } else {
    return <Navigate to={'/login'} />
  }
}

// admin 

const ProtectedRouteForAdmin = ({ children }) => {
  const { user, loading } = useSelector(
    (state) =>
      state.userReducer
  );
  if (user?.email === 'nrpatil_b20@it.vjti.ac.in') {
    return children
  }
  else {
    return <Navigate to={'/login'} />
  }

};

export default App