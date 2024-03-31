import { Toaster } from "react-hot-toast";
import Login from "./pages/login";
import { useDispatch, useSelector } from "react-redux";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import { userExist, userNotExist } from "./redux/reducer/userReducer";
import { auth } from "./firebase";
import { getUser } from "./redux/api/userAPI";



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
        if(data.user)
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
    <div>
    <Login></Login>
    <Toaster />
    
    </div>
  );
}

export default App;
