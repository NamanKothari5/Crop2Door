import React, { useEffect } from 'react'
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useLocation,
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
import { productDetails } from './assets/productDetails';

function App() {
  const { user, loading } = useSelector(
    (state) =>
      state.userReducer
  );
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
          <Route path='/faker' element={<MyState />} />
          <Route path="/" element={<Home />} />
          <Route path="/allproducts" element={<Allproducts />} />
          <Route path="/order" element={
            <ProtectedRoute user={user}>
              <Order />
            </ProtectedRoute>
          } />
          <Route path="/cart" element={<Cart />} />
          <Route path="/dashboard" element={
            <ProtectedRouteForFarmer user={user}>
              <Dashboard />
            </ProtectedRouteForFarmer>
          } />
          <Route path='/login' element={<Login />} />

          <Route path='/productinfo' element={<ProductInfo />} />
          <Route path='/addproduct' element={
            <ProtectedRouteForFarmer user={user}>
              <AddProduct />
            </ProtectedRouteForFarmer>
          } />
          <Route path='/updateproduct/:id' element={
            <ProtectedRouteForFarmer user={user}>
              <UpdateProduct />
            </ProtectedRouteForFarmer>
          } />
          <Route path="/*" element={<NoPage />} />
        </Routes>
        <ToastContainer />
      </Router>

    </MyState>

  )
}

// user 

export const ProtectedRoute = (props) => {
  const location = useLocation();
  if (props.user) {
    return props.children
  } else {
    return <Navigate to={'/login'} state={{ prevPath: location.pathname }}/>
  }
}

// admin 

const ProtectedRouteForFarmer = (props) => {
  const location = useLocation();
  
  if (props.user?.role === 'farmer') {
    return props.children
  }
  else {
    return <Navigate to={'/login'} state={{ prevPath: location.pathname }} />
  }

};

export default App